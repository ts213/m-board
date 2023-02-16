from io import BytesIO
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db.models import Q
from rest_framework import serializers
from .models import Post, Board
from django.utils.html import escape
import re
from PIL import Image


class SinglePostSerializer(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.title')
    date = serializers.SerializerMethodField(method_name='get_date_timestamp')
    bump = serializers.SerializerMethodField(method_name='get_bump_timestamp')

    @staticmethod
    def get_date_timestamp(thread: Post):
        return thread.date.timestamp()

    @staticmethod
    def get_bump_timestamp(thread: Post):
        return thread.bump.timestamp()

    class Meta:
        model = Post
        fields = ('id', 'board', 'text', 'poster', 'file', 'thumb', 'thread', 'date', 'bump')


class ThreadListSerializer(SinglePostSerializer):
    replies = serializers.SerializerMethodField()  # stackoverflow.com/questions/64867785

    @staticmethod
    def get_replies(post: Post):
        posts = post.post_set.order_by('-date')[:4][::-1]
        return SinglePostSerializer(posts, many=True).data

    class Meta(SinglePostSerializer.Meta):
        fields = SinglePostSerializer.Meta.fields + ('replies',)


class ThreadSerialier(SinglePostSerializer):
    posts = serializers.SerializerMethodField(method_name='get_posts')
    # threadId = serializers.IntegerField(source='pk')

    @staticmethod
    def get_posts(thread: Post):
        posts = Post.objects.filter(
            Q(pk=thread.pk) |
            Q(thread__pk=thread.pk)
        )
        return SinglePostSerializer(posts, many=True).data

    class Meta(SinglePostSerializer.Meta):
        fields = ('id', 'board', 'posts')


class NewPostSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if validated_data.get('thread_id') == '0':  # 0 == new thread, new threads' thread_id is empty
            validated_data.pop('thread_id')

        validated_data['text'] = escape(validated_data['text'])
        validated_data['text'] = wrap_quoted_text_in_tag(validated_data['text'])
        validated_data['text'] = add_link(validated_data['text'])
        if 'file' in validated_data:
            validated_data['thumb'] = make_thumbnail(validated_data['file'])
        return Post.objects.create(**validated_data)

    @staticmethod
    def validate_file(obj):
        if obj.size > 1_000_000:  # 1 MB
            raise ValidationError('file too large')
        return obj

    class Meta:
        model = Post
        exclude = ['board']


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'


def wrap_quoted_text_in_tag(post_text: str):
    def callback(match_obj):
        span = '<span style="color:red">{repl}</span>'
        return span.format(repl=match_obj.group(0).strip())

    post_text = re.sub('^\\s*::.+(?m)', callback, post_text)
    return post_text


def add_link(post_text: str):
    def callback(match_obj):
        found_quote = match_obj.group(0)
        span = ('<a'
                ' class="quote-link"'
                ' data-quoted={}'
                ' href="#{}/">'
                '{}'
                '</a>')
        return span.format(found_quote.strip('gt;&gt;'),
                           found_quote.strip('gt;&gt;'),
                           found_quote.strip())

    post_text = re.sub('^\\s*&gt;&gt;[0-9]+(?m)', callback, post_text)
    return post_text


def make_thumbnail(inmemory_image):
    print(type(inmemory_image))
    image = Image.open(inmemory_image)
    image.thumbnail(size=(200, 220))
    output = BytesIO()
    image.save(output, quality=85, format=image.format)
    output.seek(0)
    thumb = ContentFile(output.read(), name='thumb_' + inmemory_image.name)
    return thumb

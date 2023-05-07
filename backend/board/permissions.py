from rest_framework import permissions
from django.utils import timezone
from .models import Post
from .utils import get_user_from_header, user_is_janny


class PostPermission(permissions.BasePermission):
    allowed_time = 60 * 60 * 24  # day

    def has_object_permission(self, request, view, post: Post):
        forbidden = False

        if request.method == 'GET':
            return not forbidden

        user = get_user_from_header(request)
        if not user:
            return forbidden

        if user_is_janny(user, post):
            return not forbidden

        if not post.thread:
            return forbidden

        time_diff_secs = (timezone.now() - post.date).total_seconds()

        forbidden = \
            time_diff_secs > self.allowed_time or \
            user != post.user

        if request.method == 'PATCH':
            forbidden = post.edited_at is not None

        return not forbidden

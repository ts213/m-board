# Generated by Django 4.2b1 on 2023-03-16 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0003_alter_post_edited_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='edited_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

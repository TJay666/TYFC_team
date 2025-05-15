# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        PLAYER = 'player', 'Player'
        COACH = 'coach', 'Coach'
        ADMIN = 'admin', 'Admin'
        GUEST = 'guest', 'Guest' # Assuming a guest role exists

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PLAYER)

    # Add related_name to avoid clashes with auth.User.groups and auth.User.user_permissions
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="user_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="user_set",
        related_query_name="user",
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
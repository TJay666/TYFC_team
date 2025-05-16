# backend/users/urls.py
from django.urls import path
from . import views
from .views import RegisterView # Explicitly import RegisterView

urlpatterns = [
    path('users/', views.user_list, name='user_list'),
    path('users/<int:user_id>/role/', views.update_user_role, name='update_user_role'),
    path('register/', RegisterView.as_view(), name='register'), # Add register URL
]
# backend/users/urls.py
from django.urls import path
from . import views
from .views import RegisterView # Explicitly import RegisterView

urlpatterns = [
    path('', views.user_list, name='user_list'),  # 直接對應到 /api/users/
    path('me/', views.current_user, name='current_user'),  # 直接對應到 /api/users/me/
    path('<int:user_id>/role/', views.update_user_role, name='update_user_role'),  # 直接對應到 /api/users/{id}/role/
    path('register/', RegisterView.as_view(), name='register'), # 直接對應到 /api/users/register/
]
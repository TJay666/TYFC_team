# backend/leagues/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeagueViewSet

router = DefaultRouter()
router.register(r'leagues', LeagueViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

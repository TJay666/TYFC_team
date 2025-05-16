# backend/match_statistics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchStatisticViewSet

router = DefaultRouter()
router.register(r'match-statistics', MatchStatisticViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

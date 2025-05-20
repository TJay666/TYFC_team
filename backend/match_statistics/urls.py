# backend/match_statistics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchStatisticViewSet

router = DefaultRouter()
# 修改為更直觀的 API 路徑
router.register(r'statistics', MatchStatisticViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

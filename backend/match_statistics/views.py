# backend/match_statistics/views.py
from rest_framework import viewsets
from .models import MatchStatistic
from .serializers import MatchStatisticSerializer

class MatchStatisticViewSet(viewsets.ModelViewSet):
    queryset = MatchStatistic.objects.all()
    serializer_class = MatchStatisticSerializer

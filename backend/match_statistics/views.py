# backend/match_statistics/views.py
from django.db.models import Sum, Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import MatchStatistic
from players.models import Player
from .serializers import MatchStatisticSerializer

class MatchStatisticViewSet(viewsets.ModelViewSet):
    queryset = MatchStatistic.objects.all()
    serializer_class = MatchStatisticSerializer
    
    @action(detail=False, methods=['GET'], url_path='team-stats')
    def team_stats(self, request):
        """
        獲取團隊統計數據，例如每位球員的進球數、助攻數等
        """
        goal_stats = MatchStatistic.objects.filter(statistic_type='goal').values('player').annotate(
            total_goals=Sum('value')
        ).order_by('-total_goals')
        
        assist_stats = MatchStatistic.objects.filter(statistic_type='assist').values('player').annotate(
            total_assists=Sum('value')
        ).order_by('-total_assists')
        
        # 將結果轉換為帶有球員名字的字典
        result = {
            'goals': [],
            'assists': []
        }
        
        for stat in goal_stats:
            try:
                player = Player.objects.get(pk=stat['player'])
                result['goals'].append({
                    'player_id': stat['player'],
                    'player_name': player.name,
                    'value': stat['total_goals']
                })
            except Player.DoesNotExist:
                pass
        
        for stat in assist_stats:
            try:
                player = Player.objects.get(pk=stat['player'])
                result['assists'].append({
                    'player_id': stat['player'],
                    'player_name': player.name,
                    'value': stat['total_assists']
                })
            except Player.DoesNotExist:
                pass
                
        return Response(result)

# backend/match_statistics/serializers.py
from rest_framework import serializers
from .models import MatchStatistic
from matches.serializers import MatchSerializer # Optional: for nested match details
from players.serializers import PlayerSerializer # Optional: for nested player details
from matches.models import Match  # 正確引入 Match 模型
from players.models import Player  # 正確引入 Player 模型

class MatchStatisticSerializer(serializers.ModelSerializer):
    # Include nested read-only relation fields
    match = MatchSerializer(read_only=True)
    player = PlayerSerializer(read_only=True)

    # 修正為正確的模型 queryset
    match_id = serializers.PrimaryKeyRelatedField(queryset=Match.objects.all(), source='match', write_only=True)
    player_id = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all(), source='player', write_only=True)
    
    class Meta:
        model = MatchStatistic
        fields = ['id', 'match', 'player', 'statistic_type', 'value', 'match_id', 'player_id']
        read_only_fields = ['id', 'match', 'player']

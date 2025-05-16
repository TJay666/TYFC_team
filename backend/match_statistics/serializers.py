# backend/match_statistics/serializers.py
from rest_framework import serializers
from .models import MatchStatistic
from matches.serializers import MatchSerializer # Optional: for nested match details
from players.serializers import PlayerSerializer # Optional: for nested player details

class MatchStatisticSerializer(serializers.ModelSerializer):
    # Optional: Include nested serializers for read-only views
    # match = MatchSerializer(read_only=True)
    # player = PlayerSerializer(read_only=True)

    # Add writable fields for the foreign keys if needed for creating/updating statistics
    match_id = serializers.PrimaryKeyRelatedField(queryset=MatchStatistic.objects.all(), source='match', write_only=True)
    player_id = serializers.PrimaryKeyRelatedField(queryset=MatchStatistic.objects.all(), source='player', write_only=True)

    class Meta:
        model = MatchStatistic
        # Include all fields from the model, plus the writable foreign key fields
        fields = '__all__'

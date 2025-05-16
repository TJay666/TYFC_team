# backend/matches/serializers.py
from rest_framework import serializers
from .models import Match
from teams.serializers import TeamSerializer
from leagues.serializers import LeagueSerializer
from teams.models import Team  # Import Team model
from leagues.models import League # Import League model

class MatchSerializer(serializers.ModelSerializer):
    # Use nested serializers to include team and league details
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    league = LeagueSerializer(read_only=True)

    # Add writable fields for the foreign keys if needed for creating/updating matches
    home_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='home_team', write_only=True)
    away_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='away_team', write_only=True)
    league_id = serializers.PrimaryKeyRelatedField(queryset=League.objects.all(), source='league', write_only=True)

    class Meta:
        model = Match
        # Include all fields from the model, plus the writable foreign key fields
        fields = '__all__'

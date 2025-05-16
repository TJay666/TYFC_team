# backend/players/serializers.py
from rest_framework import serializers
from .models import Player
from teams.serializers import TeamSerializer # Import TeamSerializer

class PlayerSerializer(serializers.ModelSerializer):
    # Optionally, include a nested TeamSerializer to show team details
    # team = TeamSerializer(read_only=True)

    class Meta:
        model = Player
        fields = '__all__'


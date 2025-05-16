# backend/players/models.py
from django.db import models
from teams.models import Team # Import the Team model

class Player(models.Model):
    name = models.CharField(max_length=255)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players') # Link to the Team model
    position = models.CharField(max_length=100, blank=True, null=True)
    number = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.team.name})"

    class Meta:
        unique_together = ('team', 'number') # Ensure a player number is unique within a team

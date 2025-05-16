# backend/match_statistics/models.py
from django.db import models
from matches.models import Match
from players.models import Player

class MatchStatistic(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='statistics')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='match_statistics')
    statistic_type = models.CharField(max_length=100) # e.g., 'goal', 'assist', 'yellow card'
    value = models.PositiveIntegerField(default=0) # e.g., number of goals, assists, etc.

    def __str__(self):
        return f"{self.player.name} - {self.statistic_type} ({self.value}) in Match {self.match.id}"

    class Meta:
        verbose_name_plural = "Match Statistics"
        # Optional: Add a constraint to ensure unique statistic type per player per match
        # unique_together = ('match', 'player', 'statistic_type')

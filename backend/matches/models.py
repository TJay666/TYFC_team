# backend/matches/models.py
from django.db import models
from teams.models import Team
from leagues.models import League

class Match(models.Model):
    date_time = models.DateTimeField()
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matches')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matches')
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='matches')
    home_team_score = models.PositiveIntegerField(default=0)
    away_team_score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.home_team.name} vs {self.away_team.name} on {self.date_time.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        verbose_name_plural = "Matches"
        ordering = ['date_time']

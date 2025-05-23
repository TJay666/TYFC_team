# backend/teams/models.py
from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

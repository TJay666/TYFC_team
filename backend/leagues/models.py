# backend/leagues/models.py
from django.db import models

class League(models.Model):
    name = models.CharField(max_length=255, unique=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

# contests/models.py
from django.db import models
from django.conf import settings
from problems.models import Problem

class Contest(models.Model):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    problems = models.ManyToManyField(Problem, related_name='contests')

    def __str__(self):
        return self.title

class ContestParticipant(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    # You could add more fields here later, like rank or penalties.

    class Meta:
        # Ensures a user can only register for a contest once
        unique_together = ('contest', 'user')

    def __str__(self):
        return f'{self.user.username} in {self.contest.title}'
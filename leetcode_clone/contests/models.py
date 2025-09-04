from django.db import models
from django.conf import settings
from problems.models import Problem

class Contest(models.Model):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # problems = models.ManyToManyField(Problem, related_name='contests')
    description = models.TextField(blank=True, null=True, help_text="A general description of the contest.")
    rules = models.TextField(blank=True, null=True, help_text="Specific rules for the contest.")
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_contests', null=True)

    def __str__(self):
        return self.title

class ContestParticipant(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    last_successful_submission = models.DateTimeField(null=True, blank=True)
    solved_problems = models.ManyToManyField(Problem, blank=True)
    
    class Meta:
        unique_together = ('contest', 'user')

    def __str__(self):
        return f'{self.user.username} in {self.contest.title}'
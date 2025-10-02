# problems/models.py
from django.db import models
from django.conf import settings

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    constraints = models.TextField(blank=True, help_text="List the constraints for the problem, one per line.")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, blank=True)
    contest = models.ForeignKey('contests.Contest', on_delete=models.CASCADE, related_name='problems', null=True, blank=True)
    time_limit = models.FloatField(default=1.0, help_text="Time limit in seconds for a solution to run.")
    points = models.IntegerField(default=100, help_text="Points awarded for solving this problem in a contest")
    input_format = models.TextField(blank=True, null=True, help_text="Description of the input format.")
    output_format = models.TextField(blank=True, null=True, help_text="Description of the output format.")
    solved_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='solved_problems', blank=True)

    def __str__(self):
        return self.title

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, related_name='test_cases', on_delete=models.CASCADE)
    input_data = models.TextField()
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=False, help_text="Hide this test case from users")

    def __str__(self):
        return f"Test Case for {self.problem.title}"
    

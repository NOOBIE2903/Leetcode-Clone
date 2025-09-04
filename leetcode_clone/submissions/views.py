from django.utils import timezone
from rest_framework import generics, permissions
from .models import Submission
from .serializers import SubmissionSerializer
from .judge_service import execute_code
from contests.models import ContestParticipant 

class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(user=self.request.user)

class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        submission = serializer.save(user=self.request.user, status='Pending')
        
        result = execute_code(
            code=submission.code,
            language=submission.language,
            problem=submission.problem
        )
        
        submission.status = result['status']
        submission.output = result['output']
        submission.save()
        
        problem = submission.problem
        if submission.status == 'Accepted':
            problem.solved_by.add(self.request.user)
            
            if problem.contest is not None:
                contest = problem.contest
                now = timezone.now()
                
                # print("--- TIME CHECK DEBUG ---")
                # print(f"Contest Start Time (UTC): {contest.start_time}")
                # print(f"Submission Time (UTC):    {now}")
                # print(f"Contest End Time (UTC):   {contest.end_time}")
                # print(f"Is submission within window? {contest.start_time <= now <= contest.end_time}")
                # print("------------------------")
                
                if contest.start_time <= now <= contest.end_time:
                    try:
                        participant = ContestParticipant.objects.get(contest=contest, user=self.request.user)
                        
                        if not participant.solved_problems.filter(pk=problem.pk).exists():
                            participant.score += problem.points
                            participant.last_successful_submission = now
                            
                            participant.solved_problems.add(problem)
                            
                            participant.save()
                        
                    except ContestParticipant.DoesNotExist:
                        print(f"User {self.request.user} is not registered for contest {contest.title}.")
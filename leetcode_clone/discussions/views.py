# discussions/views.py
from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer
from problems.models import Problem

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Filter comments by the problem ID in the URL
        problem_id = self.kwargs['problem_pk']
        return Comment.objects.filter(problem_id=problem_id)

    def perform_create(self, serializer):
        problem_id = self.kwargs['problem_pk']
        problem = Problem.objects.get(id=problem_id)
        # Associate comment with the problem and logged-in user
        serializer.save(author=self.request.user, problem=problem)
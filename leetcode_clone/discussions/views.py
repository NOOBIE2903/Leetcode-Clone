from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer
from problems.models import Problem

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        problem_id = self.kwargs['problem_pk']
        return Comment.objects.filter(
            problem_id=problem_id, 
            parent__isnull=True
        ).prefetch_related('replies')

    def perform_create(self, serializer):
        """
        This method correctly associates the new comment with the
        problem and the logged-in user.
        """
        problem = Problem.objects.get(pk=self.kwargs['problem_pk'])
        serializer.save(author=self.request.user, problem=problem)
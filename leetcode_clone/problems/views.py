from rest_framework import generics, permissions 
from .models import Problem
from .serializers import ProblemListSerializer, ProblemDetailSerializer, ProblemCreateSerializer 

class ProblemListView(generics.ListAPIView):
    serializer_class = ProblemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Problem.objects.filter(contest__isnull=True)
        tag_name = self.request.query_params.get('tag')
        if tag_name is not None:
            queryset = queryset.filter(tags__name__iexact=tag_name)
        return queryset

class ProblemDetailView(generics.RetrieveAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemDetailSerializer
    permission_classes = [permissions.AllowAny]
    
class ProblemCreateView(generics.CreateAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemCreateSerializer
    permission_classes = [permissions.IsAuthenticated] 
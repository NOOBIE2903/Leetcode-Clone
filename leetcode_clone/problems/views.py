# problems/views.py
from rest_framework import generics
from .models import Problem
from .serializers import ProblemListSerializer, ProblemDetailSerializer

class ProblemListView(generics.ListAPIView):
    serializer_class = ProblemListSerializer

    def get_queryset(self):
        queryset = Problem.objects.all()
        tag_name = self.request.query_params.get('tag')
        if tag_name is not None:
            queryset = queryset.filter(tags__name__iexact=tag_name)
        return queryset

class ProblemDetailView(generics.RetrieveAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemDetailSerializer
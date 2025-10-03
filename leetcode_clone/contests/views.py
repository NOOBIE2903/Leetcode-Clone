from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Contest, ContestParticipant
from .serializers import (
    ContestListSerializer, 
    ContestDetailSerializer, 
    ContestCreateSerializer, 
    ContestParticipantSerializer
)

class ContestListView(generics.ListAPIView):
    queryset = Contest.objects.all().order_by('-start_time')
    serializer_class = ContestListSerializer
    permission_classes = [permissions.AllowAny]

class ContestDetailView(generics.RetrieveAPIView):
    queryset = Contest.objects.all()
    serializer_class = ContestDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

class ContestRegisterView(generics.CreateAPIView):
    queryset = ContestParticipant.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            contest = Contest.objects.get(pk=kwargs.get('pk'))
        except Contest.DoesNotExist:
            return Response({'detail': 'Contest not found.'}, status=status.HTTP_404_NOT_FOUND)

        if contest.organizer == request.user:
            return Response({'detail': 'You cannot register for a contest you organized.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if contest.end_time < timezone.now():
            return Response({'detail': 'This contest has already ended.'}, status=status.HTTP_400_BAD_REQUEST)

        if ContestParticipant.objects.filter(contest=contest, user=request.user).exists():
            return Response({'detail': 'You are already registered for this contest.'}, status=status.HTTP_400_BAD_REQUEST)
            
        ContestParticipant.objects.create(contest=contest, user=request.user)
        return Response({'detail': f'Successfully registered for "{contest.title}".'}, status=status.HTTP_201_CREATED)
    
class ContestCreateView(generics.CreateAPIView):
    queryset = Contest.objects.all()
    serializer_class = ContestCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
    
class ContestLeaderboardView(generics.ListAPIView):
    serializer_class = ContestParticipantSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        contest_id = self.kwargs['pk']
        return ContestParticipant.objects.filter(contest_id=contest_id).order_by('-score', 'last_successful_submission')
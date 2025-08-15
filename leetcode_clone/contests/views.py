# contests/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Contest, ContestParticipant
from .serializers import ContestListSerializer, ContestDetailSerializer

class ContestListView(generics.ListAPIView):
    queryset = Contest.objects.all()
    serializer_class = ContestListSerializer
    permission_classes = [permissions.AllowAny]

class ContestDetailView(generics.RetrieveAPIView):
    queryset = Contest.objects.all()
    serializer_class = ContestDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContestRegisterView(generics.CreateAPIView):
    queryset = ContestParticipant.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        contest_id = kwargs.get('pk')
        contest = Contest.objects.get(id=contest_id)
        
        # Check if the user is already registered
        if ContestParticipant.objects.filter(contest=contest, user=request.user).exists():
            return Response({'detail': 'You are already registered for this contest.'}, status=status.HTTP_400_BAD_REQUEST)
            
        ContestParticipant.objects.create(contest=contest, user=request.user)
        return Response({'detail': 'Successfully registered for the contest.'}, status=status.HTTP_201_CREATED)
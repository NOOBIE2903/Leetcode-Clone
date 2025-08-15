# contests/serializers.py
from rest_framework import serializers
from .models import Contest, ContestParticipant
from problems.serializers import ProblemListSerializer

class ContestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ['id', 'title', 'start_time', 'end_time']

class ContestDetailSerializer(serializers.ModelSerializer):
    problems = ProblemListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Contest
        fields = ['id', 'title', 'start_time', 'end_time', 'problems']

class ContestRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestParticipant
        fields = ['contest']
from rest_framework import serializers
from .models import Contest, ContestParticipant
from problems.serializers import ProblemListSerializer

class ContestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ['id', 'title', 'start_time', 'end_time']

class ContestProblemSerializer(ProblemListSerializer):
    """ A custom problem serializer that includes points. """
    class Meta(ProblemListSerializer.Meta):
        fields = ProblemListSerializer.Meta.fields + ['points']

class ContestDetailSerializer(serializers.ModelSerializer):
    problems = ProblemListSerializer(many=True, read_only=True)
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = ['id', 'title', 'description', 'rules', 'start_time', 'end_time', 'problems', 'is_registered']

    def get_is_registered(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return ContestParticipant.objects.filter(contest=obj, user=user).exists()
        return False

class ContestRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestParticipant
        fields = ['contest']
        
class ContestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ['id', 'title', 'description', 'rules', 'start_time', 'end_time']
        read_only_fields = ['id']
        
class ContestParticipantSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ContestParticipant
        fields = ['username', 'score']
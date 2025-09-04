from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser, CodeDraft
from .serializers import UserSerializer, CodeDraftSerializer
from problems.models import Problem
from submissions.models import Submission
from django.db.models import Count
from rest_framework.parsers import MultiPartParser, FormParser

class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user
    
class CodeDraftView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, problem_pk, language):
        try:
            draft = CodeDraft.objects.get(user=request.user, problem_id=problem_pk, language=language)
            return Response({'code': draft.code})
        except CodeDraft.DoesNotExist:
            return Response({'code': ''}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, problem_pk, language):
        draft, created = CodeDraft.objects.update_or_create(
            user=request.user, 
            problem_id=problem_pk, 
            language=language,
            defaults={'code': request.data.get('code', '')}
        )
        return Response({'status': 'draft saved'}, status=status.HTTP_200_OK)
    
class UserProfileStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        solved_problems = Problem.objects.filter(solved_by=user)
        difficulty_counts = solved_problems.values('difficulty').annotate(count=Count('id'))
        
        stats = {
            'easy_solved': 0,
            'medium_solved': 0,
            'hard_solved': 0
        }
        for item in difficulty_counts:
            if item['difficulty'] == 'Easy':
                stats['easy_solved'] = item['count']
            elif item['difficulty'] == 'Medium':
                stats['medium_solved'] = item['count']
            elif item['difficulty'] == 'Hard':
                stats['hard_solved'] = item['count']
                
        stats['total_easy'] = Problem.objects.filter(difficulty='Easy').count()
        stats['total_medium'] = Problem.objects.filter(difficulty='Medium').count()
        stats['total_hard'] = Problem.objects.filter(difficulty='Hard').count()
        
        language_counts = Submission.objects.filter(user=user).values('language').annotate(count=Count('id'))
        stats['languages'] = {item['language']: item['count'] for item in language_counts}
        
        return Response(stats)
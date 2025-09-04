from django.urls import path
from .views import ContestListView, ContestDetailView, ContestRegisterView, ContestCreateView, ContestLeaderboardView

urlpatterns = [
    path('', ContestListView.as_view(), name='contest-list'),
    path('<int:pk>/', ContestDetailView.as_view(), name='contest-detail'),
    path('<int:pk>/register/', ContestRegisterView.as_view(), name='contest-register'),
    path('create/', ContestCreateView.as_view(), name='contest-create'),
    path('<int:pk>/leaderboard/', ContestLeaderboardView.as_view(), name='contest-leaderboard'),
]
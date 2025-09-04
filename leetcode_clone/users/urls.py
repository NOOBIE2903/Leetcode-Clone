from django.urls import path
from .views import UserCreateView, UserProfileView, CodeDraftView, UserProfileStatsView

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('drafts/problem/<int:problem_pk>/language/<str:language>/', CodeDraftView.as_view(), name='code-draft'),
    path('profile/stats/', UserProfileStatsView.as_view(), name='profile-stats'),
]
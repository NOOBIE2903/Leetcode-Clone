
from django.urls import path, include
from .views import ProblemListView, ProblemDetailView, ProblemCreateView 

urlpatterns = [
    path('', ProblemListView.as_view(), name='problem-list'),
    path('<int:pk>/', ProblemDetailView.as_view(), name='problem-detail'), 
    path('<int:problem_pk>/comments/', include('discussions.urls')),
    path('create/', ProblemCreateView.as_view(), name='problem-create'),
]
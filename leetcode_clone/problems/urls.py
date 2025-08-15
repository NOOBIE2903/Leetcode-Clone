
from django.urls import path, include
from .views import ProblemListView, ProblemDetailView   

urlpatterns = [
    path('', ProblemListView.as_view(), name='problem-list'),
    # This <int:pk> is looking for the automatic 'id' of the problem
    path('<int:pk>/', ProblemDetailView.as_view(), name='problem-detail'), 
    path('<int:problem_pk>/comments/', include('discussions.urls')),
]
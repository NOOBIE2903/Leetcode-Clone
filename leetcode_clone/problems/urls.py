
from django.urls import path
from .views import ProblemListView, ProblemDetailView   

urlpatterns = [
    path('', ProblemListView.as_view(), name='problem-list'),
    # This <int:pk> is looking for the automatic 'id' of the problem
    path('<int:pk>/', ProblemDetailView.as_view(), name='problem-detail'), 
]
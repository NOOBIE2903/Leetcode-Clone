# contests/urls.py
from django.urls import path
from .views import ContestListView, ContestDetailView, ContestRegisterView

urlpatterns = [
    path('', ContestListView.as_view(), name='contest-list'),
    path('<int:pk>/', ContestDetailView.as_view(), name='contest-detail'),
    path('<int:pk>/register/', ContestRegisterView.as_view(), name='contest-register'),
]
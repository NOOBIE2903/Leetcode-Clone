# submissions/urls.py
from django.urls import path
from .views import SubmissionListView, SubmissionCreateView

urlpatterns = [
    # For listing user's own submissions and creating a new one
    path('', SubmissionListView.as_view(), name='submission-list'),
    path('create/', SubmissionCreateView.as_view(), name='submission-create'),
]
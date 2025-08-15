# submissions/serializers.py
from rest_framework import serializers
from .models import Submission

class SubmissionSerializer(serializers.ModelSerializer):
    # Make user and status read-only as they are set programmatically
    user = serializers.StringRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'problem', 'language', 'code', 'status', 'output', 'created_at', 'user']
# problems/serializers.py
from rest_framework import serializers
from .models import Problem, TestCase, Tag

class TagSerializer(serializers.ModelSerializer):
   class Meta:
        model = Tag
        fields = ['id', 'name']

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ['input_data', 'expected_output']

class ProblemListSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Problem
        fields = ['id', 'title', 'difficulty', 'tags']

class ProblemDetailSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True, read_only=True)
    # Use the full TagSerializer to show more tag detail if needed
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Problem
        # Add 'tags' to the fields list
        fields = ['id', 'title', 'description', 'difficulty', 'tags', 'test_cases']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['test_cases'] = TestCaseSerializer(
            instance.test_cases.filter(is_hidden=False), many=True
        ).data
        return representation
from rest_framework import serializers
from .models import Problem, TestCase, Tag

class TagSerializer(serializers.ModelSerializer):
   class Meta:
        model = Tag
        fields = ['id', 'name']

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ['input_data', 'expected_output', 'is_hidden']

class ProblemListSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True, read_only=True)
    is_solved = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = ['id', 'title', 'difficulty', 'tags', 'constraints', 'is_solved']
    
    def get_is_solved(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.solved_by.filter(pk=user.pk).exists()
        return False

class ProblemDetailSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    is_solved = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'input_format', 'output_format', 'constraints', 'difficulty', 'tags', 'test_cases', 'is_solved']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        visible_test_cases = instance.test_cases.filter(is_hidden=False)[:3]
        representation['test_cases'] = TestCaseSerializer(visible_test_cases, many=True).data
        return representation
    
    def get_is_solved(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.solved_by.filter(pk=user.pk).exists()
        return False
    
class ProblemCreateSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True)

    class Meta:
        model = Problem
        fields = ['title', 'description', 'input_format', 'output_format', 'constraints', 'difficulty', 'points', 'contest', 'test_cases']


    def create(self, validated_data):
        test_cases_data = validated_data.pop('test_cases')
        problem = Problem.objects.create(**validated_data)
        for test_case_data in test_cases_data:
            TestCase.objects.create(problem=problem, **test_case_data)
        return problem

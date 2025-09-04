from rest_framework import serializers
from .models import CustomUser, CodeDraft

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(max_length=None, use_url=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'profile_picture', 'linkedin_url', 'github_url', 'website_url']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class CodeDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeDraft
        fields = ['language', 'code']
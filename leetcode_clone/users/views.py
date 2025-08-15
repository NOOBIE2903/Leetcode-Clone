# users/views.py
from rest_framework import generics
from .models import *
from .serializers import *

class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
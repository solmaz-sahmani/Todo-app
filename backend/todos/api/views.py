from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from todos.models import Todo

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
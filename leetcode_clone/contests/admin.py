# contests/admin.py
from django.contrib import admin
from .models import Contest, ContestParticipant
from problems.models import Problem

class ProblemInline(admin.TabularInline):
    model = Problem
    fields = ('title', 'difficulty', 'points')
    extra = 1 

class ContestAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time')
    inlines = [ProblemInline]
    
    
admin.site.register(Contest, ContestAdmin)
admin.site.register(ContestParticipant)
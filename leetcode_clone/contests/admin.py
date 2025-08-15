# contests/admin.py
from django.contrib import admin
from .models import Contest, ContestParticipant

class ContestAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time')
    filter_horizontal = ('problems',) # A better UI for selecting problems

admin.site.register(Contest, ContestAdmin)
admin.site.register(ContestParticipant)
# submissions/admin.py
from django.contrib import admin
from .models import Submission

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'problem', 'user', 'language', 'status', 'created_at')
    list_filter = ('status', 'language')
    # Make all fields read-only in the admin detail view
    readonly_fields = ('problem', 'user', 'language', 'code', 'status', 'output', 'created_at')

admin.site.register(Submission, SubmissionAdmin)
from django.contrib import admin
from .models import Submission

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'problem', 'user', 'language', 'status', 'created_at')
    list_filter = ('status', 'language')
    readonly_fields = ('problem', 'user', 'language', 'code', 'status', 'output', 'created_at')

admin.site.register(Submission, SubmissionAdmin)
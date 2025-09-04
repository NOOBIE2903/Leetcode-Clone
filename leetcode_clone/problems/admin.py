from django.contrib import admin
from .models import *

class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 1

class ProblemAdmin(admin.ModelAdmin):
    inlines = [TestCaseInline]
    list_display = ('title', 'difficulty', 'created_at')
    list_filter = ('difficulty',)
    search_fields = ('title',)
    filter_horizontal = ('tags',) 

admin.site.register(Tag)
admin.site.register(Problem, ProblemAdmin)
admin.site.register(TestCase)
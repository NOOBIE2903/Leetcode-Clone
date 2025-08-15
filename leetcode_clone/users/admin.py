from django.contrib import admin
from django.contrib.auth.admin import UserAdmin 
from .models import *

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Add the fields from your custom user model to the display and fieldsets
    # For example, if you added 'profile_picture'
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('profile_picture',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('profile_picture',)}),
    )
admin.site.register(CustomUser)
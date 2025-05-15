# backend/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Add the 'role' field to the list of fields displayed in the admin list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')

    # Add the 'role' field to the fields that can be edited in the admin detail view
    fieldsets = UserAdmin.fieldsets + (('Role', {'fields': ('role',)}),)

    # Add the 'role' field to the search fields
    search_fields = ('username', 'email', 'role')

    # Add the 'role' field to the list filters
    list_filter = ('is_staff', 'role')

# Unregister the default User model if it was registered
try:
    admin.site.unregister(User)
except admin.site.NotRegistered:
    pass

# Register the CustomUser with the custom admin class
admin.site.register(User, CustomUserAdmin)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ('email', 'name', 'phone', 'is_staff', 'created_at')
    search_fields = ('email', 'name')
    ordering      = ('-created_at',)

    fieldsets = (
        (None,           {'fields': ('email', 'password')}),
        ('Personal info',{'fields': ('name', 'phone', 'address')}),
        ('Permissions',  {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
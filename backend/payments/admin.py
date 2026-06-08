from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ('order', 'phone', 'amount', 'status', 'reference', 'created_at')
    list_filter   = ('status',)
    search_fields = ('phone', 'reference')
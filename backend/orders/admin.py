from django.contrib import admin
from .models import Order, OrderItem, Cart, CartItem, Wishlist

class OrderItemInline(admin.TabularInline):
    model  = OrderItem
    extra  = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'status', 'payment_method', 'payment_status', 'total', 'created_at')
    list_filter   = ('status', 'payment_method', 'payment_status')
    search_fields = ('user__email', 'shipping_name', 'shipping_phone')
    list_editable = ('status', 'payment_status')
    inlines       = [OrderItemInline]

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user',)
from rest_framework import serializers
from .models import Cart, CartItem, Wishlist, Order, OrderItem
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model  = CartItem
        fields = ('id', 'product', 'product_id', 'quantity')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model  = Cart
        fields = ('id', 'items', 'total')

    def get_total(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model  = Wishlist
        fields = ('id', 'products', 'product_id')


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ('id', 'product', 'name', 'price', 'quantity')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = (
            'id', 'status', 'payment_method', 'payment_status',
            'total', 'shipping_name', 'shipping_phone',
            'shipping_address', 'notes', 'items', 'created_at'
        )
        read_only_fields = ('status', 'payment_status', 'total')


class PlaceOrderSerializer(serializers.Serializer):
    payment_method   = serializers.ChoiceField(choices=['momo', 'cash', 'card'])
    shipping_name    = serializers.CharField()
    shipping_phone   = serializers.CharField()
    shipping_address = serializers.CharField()
    notes            = serializers.CharField(required=False, allow_blank=True)
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Wishlist, Order, OrderItem
from .serializers import (
    CartSerializer, CartItemSerializer,
    WishlistSerializer, OrderSerializer, PlaceOrderSerializer
)
from products.models import Product


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'})


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity   = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response(CartSerializer(cart).data)

    def patch(self, request, pk):
        try:
            item = CartItem.objects.get(id=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request, pk):
        try:
            item = CartItem.objects.get(id=pk, cart__user=request.user)
            item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist).data)

    def post(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product_id  = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product in wishlist.products.all():
            wishlist.products.remove(product)
            return Response({'message': 'Removed from wishlist'})
        else:
            wishlist.products.add(product)
            return Response({'message': 'Added to wishlist'})


class OrderListView(generics.ListAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart.items.all())

        # Create order
        order = Order.objects.create(
            user             = request.user,
            total            = total,
            payment_method   = serializer.validated_data['payment_method'],
            shipping_name    = serializer.validated_data['shipping_name'],
            shipping_phone   = serializer.validated_data['shipping_phone'],
            shipping_address = serializer.validated_data['shipping_address'],
            notes            = serializer.validated_data.get('notes', ''),
        )

        # Create order items (snapshot)
        for item in cart.items.all():
            OrderItem.objects.create(
                order    = order,
                product  = item.product,
                name     = item.product.name,
                price    = item.product.price,
                quantity = item.quantity,
            )

        # Clear cart after order
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
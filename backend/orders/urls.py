from django.urls import path
from .views import (
    CartView, CartItemView,
    WishlistView,
    OrderListView, PlaceOrderView, OrderDetailView
)

urlpatterns = [
    path('cart/',              CartView.as_view(),        name='cart'),
    path('cart/items/',        CartItemView.as_view(),     name='cart-items'),
    path('cart/items/<int:pk>/', CartItemView.as_view(),   name='cart-item-detail'),
    path('wishlist/',          WishlistView.as_view(),     name='wishlist'),
    path('orders/',            OrderListView.as_view(),    name='order-list'),
    path('orders/place/',      PlaceOrderView.as_view(),   name='place-order'),
    path('orders/<int:pk>/',   OrderDetailView.as_view(),  name='order-detail'),
]
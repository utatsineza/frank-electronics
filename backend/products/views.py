from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListCreateAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProductListView(generics.ListCreateAPIView):
    serializer_class   = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['name', 'description', 'category__name']
    ordering_fields    = ['price', 'rating', 'created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('cat')
        badge    = self.request.query_params.get('badge')
        if category:
            queryset = queryset.filter(category__slug=category)
        if badge:
            queryset = queryset.filter(badge=badge)
        return queryset


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Product.objects.all()
    serializer_class   = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
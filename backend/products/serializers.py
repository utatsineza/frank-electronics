from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ('id', 'name', 'slug', 'icon')


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model  = Product
        fields = (
            'id', 'name', 'category', 'category_name',
            'description', 'price', 'old_price', 'image',
            'emoji', 'badge', 'rating', 'reviews',
            'stock', 'is_active', 'created_at'
        )
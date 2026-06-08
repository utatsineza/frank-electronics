from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=10, blank=True)  # emoji

    def __str__(self):
        return self.name


class Product(models.Model):
    BADGE_CHOICES = [
        ('new', 'New'),
        ('sale', 'Sale'),
        ('hot', 'Hot'),
    ]

    name        = models.CharField(max_length=200)
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=12, decimal_places=2)
    old_price   = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    image       = models.ImageField(upload_to='products/', blank=True, null=True)
    emoji       = models.CharField(max_length=10, blank=True)
    badge       = models.CharField(max_length=10, choices=BADGE_CHOICES, blank=True)
    rating      = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    reviews     = models.PositiveIntegerField(default=0)
    stock       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
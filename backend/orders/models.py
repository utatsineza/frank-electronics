from django.db import models
from users.models import User
from products.models import Product


class Cart(models.Model):
    user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.email}"


class CartItem(models.Model):
    cart     = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"


class Wishlist(models.Model):
    user     = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"Wishlist of {self.user.email}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',    'Pending'),
        ('confirmed',  'Confirmed'),
        ('processing', 'Processing'),
        ('shipped',    'Shipped'),
        ('delivered',  'Delivered'),
        ('cancelled',  'Cancelled'),
    ]

    PAYMENT_CHOICES = [
        ('momo',  'MTN MoMo'),
        ('cash',  'Cash on Delivery'),
        ('card',  'Card'),
    ]

    user            = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method  = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash')
    payment_status  = models.CharField(max_length=20, default='unpaid')
    total           = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_name   = models.CharField(max_length=100)
    shipping_phone  = models.CharField(max_length=20)
    shipping_address= models.TextField()
    notes           = models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} — {self.user.email if self.user else 'Guest'}"


class OrderItem(models.Model):
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product    = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name       = models.CharField(max_length=200)  # snapshot at time of order
    price      = models.DecimalField(max_digits=12, decimal_places=2)  # snapshot
    quantity   = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity}x {self.name}"
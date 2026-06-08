from django.db import models
from orders.models import Order


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending',  'Pending'),
        ('success',  'Success'),
        ('failed',   'Failed'),
    ]

    order        = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    phone        = models.CharField(max_length=20)
    amount       = models.DecimalField(max_digits=12, decimal_places=2)
    reference    = models.CharField(max_length=100, blank=True)  # MTN transaction ID
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id} — {self.status}"
from django.urls import path
from .views import InitiatePaymentView, CheckPaymentView, MoMoCallbackView

urlpatterns = [
    path('momo/pay/',                    InitiatePaymentView.as_view(), name='momo-pay'),
    path('momo/status/<str:reference>/', CheckPaymentView.as_view(),    name='momo-status'),
    path('momo/callback/<str:reference>/', MoMoCallbackView.as_view(),  name='momo-callback'),
]
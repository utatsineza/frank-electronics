import uuid
import requests
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from .models import Payment
from orders.models import Order


def get_momo_token():
    """Get access token from MTN MoMo API"""
    url = f"{settings.MOMO_BASE_URL}/collection/token/"
    credentials = base64.b64encode(
        f"{settings.MOMO_API_USER}:{settings.MOMO_API_KEY}".encode()
    ).decode()
    headers = {
        "Authorization": f"Basic {credentials}",
        "Ocp-Apim-Subscription-Key": settings.MOMO_SUBSCRIPTION_KEY,
    }
    response = requests.post(url, headers=headers)
    response.raise_for_status()
    return response.json().get("access_token")


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        phone    = request.data.get("phone")  # e.g. 0788123456

        if not order_id or not phone:
            return Response(
                {"error": "order_id and phone are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        # Format phone — MTN expects 2507XXXXXXXX format
        phone_clean = phone.replace('+', '').replace(' ', '').replace('-', '')
        if phone_clean.startswith('07') or phone_clean.startswith('08'):
            phone_clean = '250' + phone_clean[1:]
        elif phone_clean.startswith('7') or phone_clean.startswith('8'):
            phone_clean = '250' + phone_clean

        amount   = int(order.total)
        ref      = str(uuid.uuid4())

        try:
            token = get_momo_token()
        except Exception as e:
            return Response(
                {"error": "Failed to connect to MTN MoMo API"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Create payment record
        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={"phone": phone_clean, "amount": amount, "reference": ref}
        )
        payment.phone     = phone_clean
        payment.amount    = amount
        payment.reference = ref
        payment.status    = "pending"
        payment.save()

        # Request to pay
        url = f"{settings.MOMO_BASE_URL}/collection/v1_0/requesttopay"
        headers = {
            "Authorization":              f"Bearer {token}",
            "X-Reference-Id":             ref,
            "X-Target-Environment":       settings.MOMO_ENVIRONMENT,
            "Ocp-Apim-Subscription-Key":  settings.MOMO_SUBSCRIPTION_KEY,
            "Content-Type":               "application/json",
        }
        if settings.MOMO_CALLBACK_URL:
            headers["X-Callback-Url"] = settings.MOMO_CALLBACK_URL

        payload = {
            "amount":       str(amount),
            "currency":     "RWF",
            "externalId":   str(order.id),
            "payer": {
                "partyIdType": "MSISDN",
                "partyId":     phone_clean,
            },
            "payerMessage": f"Frank Electronics Order #{order.id}",
            "payeeNote":    f"Payment for Order #{order.id}",
        }

        try:
            resp = requests.post(url, json=payload, headers=headers)
            if resp.status_code == 202:
                return Response({
                    "message":   "Payment request sent to your phone",
                    "reference": ref,
                    "status":    "pending"
                })
            else:
                payment.status = "failed"
                payment.save()
                return Response(
                    {"error": "MTN MoMo request failed", "details": resp.text},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            payment.status = "failed"
            payment.save()
            return Response(
                {"error": "Failed to send payment request"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class CheckPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        try:
            token = get_momo_token()
        except Exception:
            return Response({"error": "Failed to connect to MTN MoMo API"}, status=503)

        url = f"{settings.MOMO_BASE_URL}/collection/v1_0/requesttopay/{reference}"
        headers = {
            "Authorization":             f"Bearer {token}",
            "X-Target-Environment":      settings.MOMO_ENVIRONMENT,
            "Ocp-Apim-Subscription-Key": settings.MOMO_SUBSCRIPTION_KEY,
        }

        try:
            resp = requests.get(url, headers=headers)
            data = resp.json()
            momo_status = data.get("status", "").lower()

            # Update our payment record
            try:
                payment = Payment.objects.get(reference=reference)
                if momo_status == "successful":
                    payment.status = "success"
                    payment.order.status = "confirmed"
                    payment.order.save()
                elif momo_status == "failed":
                    payment.status = "failed"
                payment.save()
            except Payment.DoesNotExist:
                pass

            return Response({
                "status":    momo_status,
                "reference": reference,
                "data":      data
            })
        except Exception as e:
            return Response({"error": "Failed to check payment status"}, status=503)


class MoMoCallbackView(APIView):
    """MTN calls this URL when payment is complete"""
    permission_classes = [AllowAny]

    def post(self, request, reference):
        data        = request.data
        momo_status = data.get("status", "").lower()

        try:
            payment = Payment.objects.get(reference=reference)
            if momo_status == "successful":
                payment.status       = "success"
                payment.order.status = "confirmed"
                payment.order.save()
            elif momo_status == "failed":
                payment.status = "failed"
            payment.save()
        except Payment.DoesNotExist:
            pass

        return Response({"message": "Callback received"})
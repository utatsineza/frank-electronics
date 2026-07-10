import os
import random
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import User, PasswordResetOTP
from .serializers import (
    RegisterSerializer, UserSerializer, ChangePasswordSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')
        user     = authenticate(request, email=email, password=password)

        if not user:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class   = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'error': 'Wrong password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password changed successfully'})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully'})


class UserListView(generics.ListAPIView):
    serializer_class   = UserSerializer
    permission_classes = [IsAdminUser]
    queryset           = User.objects.all().order_by('-created_at')


def send_otp_email(email, otp):
    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = os.environ.get('BREVO_API_KEY', '')

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )

        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email}],
            sender={"name": "Frank Electronics", "email": settings.DEFAULT_FROM_EMAIL},
            subject="Frank Electronics — Password Reset Code",
            text_content=f"Your password reset code is: {otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, ignore this email."
        )

        api_instance.send_transac_email(send_smtp_email)
        return True
    except ApiException as e:
        print(f"Brevo API error: {e}")
        return False


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        if not User.objects.filter(email=email).exists():
            return Response({'message': 'If this email exists, an OTP has been sent.'})

        otp = str(random.randint(100000, 999999))
        PasswordResetOTP.objects.create(email=email, otp=otp)

        send_otp_email(email, otp)

        return Response({'message': 'If this email exists, an OTP has been sent.'})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email    = serializer.validated_data['email']
        otp      = serializer.validated_data['otp']
        password = serializer.validated_data['password']

        cutoff = timezone.now() - timedelta(minutes=10)
        otp_obj = PasswordResetOTP.objects.filter(
            email=email, otp=otp, used=False, created_at__gte=cutoff
        ).order_by('-created_at').first()

        if not otp_obj:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(password)
        user.save()
        otp_obj.used = True
        otp_obj.save()

        return Response({'message': 'Password reset successfully'})
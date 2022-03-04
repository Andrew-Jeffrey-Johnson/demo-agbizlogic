from django.contrib.auth.models import User
from common.models import PasswordResetCode
from common.serializers import UserSerializer
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from AgBiz_Logic.settings import HOSTNAME
from django.utils.timezone import now
import string
import random
import json



class UserViewSet(ModelViewSet):
    """ API endpoint for the User model.
    """

    serializer_class = UserSerializer
    lookup_field = "username"


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters and authorization.
        """

        queryset = None

        if self.request.user.is_superuser:
            queryset = User.objects.all()

        return queryset


    @action(detail=True, methods=['post'])
    def reset_password(self, request, username):
        """ Sending a POST request to this endpoint will send an email to the 'email' address of the User with a 'username'
            that matches the URL 'username' parameter.
        """

        try:
            user = User.objects.filter(username=username)[0]

            code = generate_code(user)
            subject = "AgBiz Logic Password Reset"
            message = "Click the link to reset your password"
            html_message = "Someone (hopefully you) has requested to change the password of the account associated with this email. " \
                "Visit the link below to be taken to a page where you can change your password. " \
                "<br><br>" \
                "<a href=\"" + HOSTNAME + "\/forgot_password?username=" + user.username + "&code=" + str(code) + "\">" \
                    "" + HOSTNAME + "/forgot_password?username=" + user.username + "&code=" + str(code) + "" \
                "</a>"

            send_mail(
                subject=subject,
                message=message,
                from_email="agbizlogicweb@gmail.com",
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )

            response = Response({"message": "Email sent to email address for user with matching username"}, status=200)

        except IndexError:
            response = Response({"error": "No user found with matching username"}, status=400)

        return response


    @action(detail=True, methods=['post'])
    def set_password(self, request, username):
        """ Sending a POST request to this endpoint will change the User's password to the 'new_password' in the payload
            if the 'code' in the request payload is valid.
        """

        try:
            user = User.objects.filter(username=username)[0]
            password_reset_code = PasswordResetCode.objects.filter(user=user)[0]
            time_difference = (now() - password_reset_code.created_date)

            if "code" not in request.data:
                response = Response({'error': "Missing password reset code in request payload"}, status=400)

            elif "new_password" not in request.data:
                response = Response({'error': "Missing new password in request payload"}, status=400)

            elif (time_difference.total_seconds() / 60) > 15:
                response = Response({'error': "Exceeded the time limit to change password"}, status=400)

            elif password_reset_code.code != request.data['code']:
                response = Response({'error': "Wrong code number"}, status=400)

            else:
                user.set_password(request.data["new_password"])
                user.save()
                response = Response({'status': "Password set successfully"}, status=200)

        except IndexError:
            response = Response({"error": "No user found with matching username"}, status=400)
        except TypeError:
            response = Response({"error": "No password reset request made"})

        return response



################################################################################
#                            Helper Functions
################################################################################

def generate_code(user):
    """ Return a temporary code for the user to use to reset their password.
    """

    chars = string.ascii_uppercase + string.digits
    random_code = ''.join(random.choice(chars) for _ in range(10))
    password_reset_code = PasswordResetCode(user=user, created_date=now(), code=random_code)
    password_reset_code.save()

    return random_code

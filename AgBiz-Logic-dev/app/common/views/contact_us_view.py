from common.serializers import SupportMessageSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated



class ContactUsView(APIView):
    """ API endpoint to make support requests.
    """

    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def post(self, request, **kwargs):
        """ Sending a POST request to this endpoint sends a support email.
        """

        try:
            serializer = SupportMessageSerializer(request.data)

            message = serializer.data["message"] + "\nUsername: " + request.user.username + "\nEmail: " + request.user.email

            send_mail(
                subject=serializer.data["subject"],
                message=message,
                from_email=request.user.email,
                recipient_list=["agbizlogicweb@gmail.com"],
            )

            response = Response(serializer.data, 200)

        except KeyError:
            response = Response({}, 400)

        return response

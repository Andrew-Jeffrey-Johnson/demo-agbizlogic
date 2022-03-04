from common.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class CurrentUserView(APIView):
    """ API endpoint for the current logged in User model.
    """

    def get(self, request):
        """ Returns a serialized User object of the current user if they are authenticated.
            Otherwise returns empty array.
        """

        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            response = Response(serializer.data)

        else:
            response = Response({})

        return response

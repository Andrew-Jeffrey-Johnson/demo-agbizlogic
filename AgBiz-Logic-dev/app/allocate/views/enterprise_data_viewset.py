from allocate.models import EnterpriseData
from registration.models import ScheduleF
from django.contrib.auth.models import User
from allocate.serializers import EnterpriseDataSerializer
from registration.serializers import ScheduleFSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response



class EnterpriseDataViewSet(ModelViewSet):
    """ API endpoint for Budget model.
    """

    lookup_field = 'id'
    lookup_value_regex = '[0-9]+'
    serializer_class = EnterpriseDataSerializer


    def dispatch(self, *args, **kwargs):
        """ Overriding this method allows method decorators to check login status.
        """

        self.http_method_names = ['get', 'post', 'put', 'delete']

        return super(EnterpriseDataViewSet, self).dispatch(*args, **kwargs)


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
        """

        # Check for invalid query parameters
        for key in self.request.query_params.keys():
            if key not in {'username', 'fields'}:
                raise PermissionDenied("Invalid Request")

        # Default queryset is all objects in database
        queryset = EnterpriseData.objects.all()

        username = self.request.query_params.get('username', None)

        if username is not None:
            if username == self.request.user.get_username():
                try:
                    queryset = queryset.filter(user=User.objects.get(username=username))
                except User.DoesNotExist:
                    queryset = None
            else:
                queryset = None

        return queryset


    def create(self, request, *args, **kwargs):
        """ Add user to new object, then save to database. Check to make sure that the limit for EnterpriseData objects
            has not been reached.
        """

        queryset = EnterpriseData.objects.filter(user=self.request.user, enterprise=self.request.data['enterprise'])
        serializer = EnterpriseDataSerializer(data=request.data)

        if serializer.is_valid() and len(queryset) == 7:
            return Response({"error":"EnterpriseData limit reached"}, status=400)

        else:
            serializer.save(user=self.request.user)

            return Response(serializer.data, status=201)

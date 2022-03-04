from registration.models import ScheduleF
from django.contrib.auth.models import User
from registration.serializers import ScheduleFSerializer
from rest_framework.viewsets import ModelViewSet



class ScheduleFViewSet(ModelViewSet):

    serializer_class = ScheduleFSerializer


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.
        """

        # Default queryset is all objects in database
        queryset = ScheduleF.objects.all()

        username = self.request.query_params.get('username', None)

        if username is not None:
            queryset = queryset.filter(user=User.objects.filter(username=username)[0])

        return queryset


    def perform_create(self, serializer):
        """ Add user to new object, then save to database.
        """

        serializer.save(user=self.request.user)

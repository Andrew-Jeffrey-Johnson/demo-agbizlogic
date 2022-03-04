from dashboard.models import Dashboard, Tile
from dashboard.serializers import DashboardSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated



class DashboardView(APIView):
    """ API endpoint for '/dashboards/{id}/'.
    """

    serializer_class = DashboardSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


    def post(self, request):
        """ Sending a POST request to this endpoint returns the Dashboard instance associated with the request user.
            Creates a default Dashboard object if one does not exist for the request user.
            Returns HTTP 400 if request user is anonymous.
        """

        try:
            dashboard = Dashboard.objects.filter(user=request.user)[0]
            serializer = DashboardSerializer(dashboard)
            response = Response(serializer.data, status=200)

        except IndexError:
            dashboard = Dashboard.objects.create(user=request.user)

            for tile in DEFAULT_DASHBOARD['tiles']:
                Tile.objects.create(dashboard=dashboard, **tile)

            serializer = DashboardSerializer(Dashboard.objects.get(pk=dashboard.pk))
            response = Response(serializer.data, status=201)

        return response


    def put(self, request):
        """ Sending a PUT request to this endpoint accepts a Dashboard object payload and updates the associated tiles
            with the payload values, then returns the updated Dashboard.
        """

        try:
            for tile in request.data['tiles']:
                old_tile = Tile.objects.get(pk=tile['id'])
                old_tile.row = tile['row']
                old_tile.column = tile['column']
                old_tile.save()

            dashboard = Dashboard.objects.filter(pk=request.data['id'])[0]
            serializer = DashboardSerializer(dashboard)
            response = Response(serializer.data, status=200)

        except IndexError:
            response = Response({"error": "Dashboard with that id does not exist"}, status=404)

        return response


DEFAULT_DASHBOARD = {
    'tiles': [
        {
            'tile_type': "info",
            'row': 1,
            'column': 1,
        },
        {
            'tile_type': "climate",
            'row': 2,
            'column': 1,
        },
        {
            'tile_type': "budgets",
            'row': 1,
            'column': 2,
        },
        {
            'tile_type': "scenarios",
            'row': 3,
            'column': 1,
        },
        {
            'tile_type': "profit",
            'row': 2,
            'column': 2,
        },
        {
            'tile_type': "lease",
            'row': 3,
            'column': 2,
        },
        {
            'tile_type': "finance",
            'row': 4,
            'column': 2,
        },
        {
            'tile_type': "environment",
            'row': 5,
            'column': 2,
        },
    ]
}

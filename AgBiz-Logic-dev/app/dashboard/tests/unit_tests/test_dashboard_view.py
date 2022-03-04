from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from dashboard.models import Dashboard, Tile
from dashboard.views import DashboardView
from django.contrib.auth.models import User


class DashboardAPITestCase(APITestCase):
    """ Test suite for the Dashboard model REST API.
    """

    def setUp(self):
        """ Set the request factory, viewset, users, and base URL.
        """

        self.factory = APIRequestFactory()

        self.user = User.objects.create(**USER)
        self.user_2 = User.objects.create(**USER_2)


    def test_returns_valid(self):
        """ Test POST request returns Dashboard instance associated with request user.
        """

        dashboard = Dashboard.objects.create(user=self.user)

        view = DashboardView.as_view()
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(dashboard.pk, response.data['id'])


    def test_creates_default_config_if_does_not_exist(self):
        """ Test that if the request user does not have a Dashboard object associated with them, a default Dashboard
            object will be created and returned with HTTP 201.
        """

        view = DashboardView.as_view()
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(201, response.status_code)
        self.assertEqual(1, response.data['id'])


    def test_returns_tiles(self):
        """ Test returns associated Tile objects.
        """

        dashboard = Dashboard.objects.create(user=self.user)
        num = 3
        for i in range(0, num):
            Tile.objects.create(dashboard=dashboard, tile_type="info", row=1, column=i)

        view = DashboardView.as_view()
        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(num, len(response.data['tiles']))


    def test_save_dashboard_valid(self):
        """ Test sending PUT request with valid Dashboard object updates all tiles in the payload.
        """

        dashboard = Dashboard.objects.create(user=self.user)
        tile_1_original = Tile.objects.create(dashboard=dashboard, tile_type="info", row=1, column=1)
        tile_2_original = Tile.objects.create(dashboard=dashboard, tile_type="climate", row=2, column=1)

        tile_1_updated = {
            "id": tile_1_original.id,
            "row": 2,
            "column": 2,
        }
        tile_2_updated = {
            "id": tile_2_original.id,
            "row": 1,
            "column": 2,
        }
        updated_dashboard = {
            "id": dashboard.id,
            "tiles": [
                tile_1_updated,
                tile_2_updated,
            ],
        }

        view = DashboardView.as_view()
        request = self.factory.put('', updated_dashboard, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = view(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(dashboard.id, response.data['id'])
        self.assertEqual(tile_1_updated['row'], response.data['tiles'][0]['row'])
        self.assertEqual(tile_2_updated['row'], response.data['tiles'][1]['row'])
        self.assertEqual(tile_1_updated['column'], response.data['tiles'][0]['column'])
        self.assertEqual(tile_2_updated['column'], response.data['tiles'][1]['column'])



# Dictionaries used to create test objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
USER_2 = {
    'username':'terrygillam',
    'first_name': 'Terry',
    'last_name': 'Gillam',
    'email':'terrygillam@holygrail.com'
}

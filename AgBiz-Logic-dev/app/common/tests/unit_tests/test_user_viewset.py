from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from common.views import UserViewSet
from django.contrib.auth.models import User
from django.utils.timezone import now
from common.models import PasswordResetCode
import datetime
import mock
import copy



class UserViewSetTestCase(APITestCase):
    """ Test case for the User REST API.
    """

    def setUp(self):
        """ Set the request factory, viewset, users, and base URL.
        """

        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(**USER_OUTLINE)
        self.old_password = "montypython"
        self.user.set_password(self.old_password)
        self.user.save()


    def test_list_unauthorized(self):
        """ Test request to list all users responds with empty list if user is not a superuser.
        """

        viewset = UserViewSet.as_view({'get': 'list'})
        request = self.factory.get('', format='json')
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(response.data))


    def test_list_authorized(self):
        """ Test request to list all users responds with empty list if user is not a superuser.
        """

        viewset = UserViewSet.as_view({'get': 'list'})
        request = self.factory.get('', format='json')
        force_authenticate(request, self.user)
        response = viewset(request)

        self.assertEqual(200, response.status_code)
        self.assertFalse(len(response.data) == 0)


    def test_create_valid(self):
        """ Test create action.
        """

        new_user = copy.deepcopy(USER_OUTLINE_2)
        viewset = UserViewSet.as_view({'post': 'create'})
        request = self.factory.post('', new_user, format='json')
        response = viewset(request)

        self.assertEqual(201, response.status_code)
        self.assertTrue(response.data['id'] != None)
        self.assertEqual(new_user['username'], response.data['username'])


    def test_create_admin_valid(self):
        """ Test creating a user with admin rights.
        """

        new_user = copy.deepcopy(USER_OUTLINE_2)
        new_user['is_superuser'] = True
        viewset = UserViewSet.as_view({'post': 'create'})
        request = self.factory.post('', new_user, format='json')
        response = viewset(request)

        self.assertEqual(201, response.status_code)
        self.assertTrue(response.data['id'] != None)
        self.assertEqual(new_user['username'], response.data['username'])
        self.assertTrue(User.objects.get(id=response.data['id']).is_superuser)


    @mock.patch("common.views.user_viewset.send_mail")
    def test_reset_password_sends_email(self, mock_send_mail):
        """ Test POST request to '/reset_password/' will send an email to the 'email' address for the User with the
            matching 'username'.
        """

        viewset = UserViewSet.as_view({"post": "reset_password"})
        request = self.factory.post('', format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username=self.user.username)

        self.assertTrue(mock_send_mail.called, "Failed to send email")
        self.assertEqual(200, response.status_code)


    def test_reset_password_user_does_not_exist(self):
        """ Test sending POST request to this endpoint when no User with the matching username exists returns HTTP 400
            and error message.
        """

        viewset = UserViewSet.as_view({"post": "reset_password"})
        request = self.factory.post('', {}, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username="bob")

        self.assertEqual(400, response.status_code)
        self.assertEqual({"error": "No user found with matching username"}, response.data)


    def test_set_password_valid_code(self):
        """ Test sending POST request with 'new_password' and valid 'code' in payload changes the User's password and
            returns HTTP 200.
        """

        payload = {
            'new_password': "newPassword4",
            'code': "83fe2",
        }
        password_reset_code = PasswordResetCode(user=self.user, created_date=now(), code=payload['code'])
        password_reset_code.save()

        viewset = UserViewSet.as_view({"post": "set_password"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username=self.user.username)
        user = User.objects.get(id=self.user.id)

        self.assertEqual(200, response.status_code)
        self.assertEqual({'status': "Password set successfully"}, response.data)
        self.assertTrue(user.check_password(payload["new_password"]))


    def test_set_password_invalid_code(self):
        """ Test sending POST request with 'new_password' and invalid 'code' and
            returns HTTP 400.
        """

        payload = {
            'new_password': "newPassword4",
            'code': "83fe2",
        }
        password_reset_code = PasswordResetCode(user=self.user, created_date=now(), code="abc8181")
        password_reset_code.save()

        viewset = UserViewSet.as_view({"post": "set_password"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username=self.user.username)
        user = User.objects.get(id=self.user.id)

        self.assertEqual(400, response.status_code)
        self.assertEqual({'error': "Wrong code number"}, response.data)
        self.assertTrue(user.check_password(self.old_password))


    def test_set_password_expired_code(self):
        """ Test sending POST request with 'new_password' and expired 'code' and
            returns HTTP 400.
        """

        payload = {
            'new_password': "newPassword4",
            'code': "83fe2",
        }

        date = datetime.datetime.strptime('24052016', "%d%m%Y").date()
        p = PasswordResetCode(user = self.user, created_date = date, code = payload['code'])
        p.save()

        viewset = UserViewSet.as_view({"post": "set_password"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username=self.user.username)
        user = User.objects.get(id=self.user.id)

        self.assertEqual(400, response.status_code)
        self.assertEqual({'error': "Exceeded the time limit to change password"}, response.data)
        self.assertTrue(user.check_password(self.old_password))


    def test_set_password_missing_code(self):
        """ Test sending POST request without 'code' in request payload returns HTTP 400 and does not change the User's
            password.
        """

        payload = {
            'new_password': "newPassword4",
        }

        viewset = UserViewSet.as_view({"post": "set_password"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username=self.user.username)
        user = User.objects.get(id=self.user.id)

        self.assertEqual(400, response.status_code)
        self.assertTrue(user.check_password(self.old_password))


    def test_set_password_missing_new_password(self):
        """ Test sending POST request without 'new_password' in request body returns HTTP 400 and does not change the
            User's password.
        """

        payload = {
            'code': "83fe2",
        }

        viewset = UserViewSet.as_view({"post": "set_password"})
        request = self.factory.post('', payload, format='json')
        force_authenticate(request, user=self.user)
        response = viewset(request, username=self.user.username)
        user = User.objects.get(id=self.user.id)

        self.assertEqual(400, response.status_code)
        self.assertTrue(user.check_password(self.old_password))



# Dictionaries used to create test objects

USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com',
    'password': "password",
}
USER_OUTLINE_2 = {
    'username':'michaeljordan',
    'first_name': 'Michael',
    'last_name': 'Jordan',
    'email':'ballin@bulls.com',
    'password': "password",
}

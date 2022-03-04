from django.test import TestCase
from registration.models import Business, Access_Code
from django.contrib.auth.models import User
from django.test import Client
from registration.forms import UserCreateForm, AccessCode

class UserCreationTestCase(TestCase):
    def setUp(self):


        user = User(

            username = 'dongj',
            first_name = 'John',
            last_name= 'Dong',
            email= 'test@gmail.com'

        )


        user.set_password("test")
        user.save()

        Business.objects.create(
            user=user,
            name="John's Business",
            address1="1484 NW 20th St",
            zipcode="97230", city="Portland",
            state="OR", industry="Agriculture",
            primary_business="Wholesales",
            secondary_business="Producer"
        )

    def test_business_models(self):

        user = User.objects.get(username='dongj')
        business = Business.objects.get(user=user)
        self.assertEqual(business.user, user)

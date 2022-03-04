from django.db import models
from django.contrib.auth.models import User
import datetime



class PasswordResetCode(models.Model):
    """ Represents the password reset code needed to change a User's password.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    created_date = models.DateTimeField(blank=False)
    code = models.CharField(max_length=100, blank=False)

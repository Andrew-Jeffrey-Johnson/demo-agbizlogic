from unicodedata import category
from django.db import models

class File(models.Model):
    Date = models.DateTimeField
    Memo = models.TextField()
    Payee = models.CharField(max_length=100)
    Tags = models.CharField(max_length=100)
    Total_by_cat = models.DecimalField(max_digits=12,decimal_places=2)
    Payment = models.DecimalField(max_digits=12, decimal_places=2)
    Deposit = models.DecimalField(max_digits=12, decimal_places=2)
    Cat = models.CharField(max_length=100)

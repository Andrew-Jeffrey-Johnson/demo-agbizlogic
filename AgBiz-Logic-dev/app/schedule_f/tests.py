from django.test import TestCase
from django.contrib.auth.models import User
from registration.models import Business, ScheduleF
from schedule_f.forms import IncomeForm, ExpenseForm

class IncomeModelTestCase(TestCase):
    
    def setUp(self):

        user = User(
                
                username = 'dongj',
                first_name = 'John',
                last_name= 'Dong',
                email= 'test@gmail.com'
                    
        )

            
        user.set_password("test")
        user.save()

        Business.objects.create(user=user, name="John's Business", address1="1484 NW 20th St", zipcode="97230", city="Portland", state="OR", industry="Agriculture", primary_business="Wholesales", secondary_business="Producer")

    def test_save(self):
        user = User.objects.get(username='dongj')
        tax = ScheduleF.objects.create(user=user,line_1_a='350,000',
        line_1_b= '50,000',
        line_1_c= '300,000',
        line_2='3,500,000',
        line_3_a= '3,000',
        line_3_b= '1,500',
        line_4_a= '60,000',
        line_4_b= '60,000',
        line_5_a= '0',
        line_5_b= '0',
        line_5_c= '0',
        line_6_a= '200,000',
        line_6_b= '200,000',
        line_6_d= '0',
        line_7= '150,000',
        line_8= '12,500',
        gross_income= '4,224,000',
        line_10= '10,000',
        line_11= '160,000',
        line_12= '25,000',
        line_13= '20,000',
        line_14= '250,000',
        line_15= '300,000',
        line_16= '13,000',
        line_17= '75,000',
        line_18= '28,000',
        line_19= '100,000',
        line_20= '50,000',
        line_21_a= '300,000',
        line_21_b= '50,000',
        line_22= '200,000',
        line_23= '15,000',
        line_24_a= '52,000',
        line_24_b= '150,000',
        line_25= '30,000',
        line_26= '60,000',
        line_27= '25,000',
        line_28= '10,000',
        line_29= '9,000',
        line_30= '40,000',
        line_31= '40,000',
        line_32_a= '10,000',
        line_32_b= '50,000',
        total_expenses= '2,072,000',
        net_profit = '2,152,000',
        other_expense_1="miscellaneous",
        other_expense_2="Other miscellaneous",
        )

        self.assertEqual(ScheduleF.objects.filter(user=user).exists(), True)


class IncomeFormTestCase(TestCase):
    
    def test_one(self):
        
        data = {'line_1_a':'350,000',
        'line_1_b': '50,000',
        'line_1_c': '300,000',
        'line_2': '3,500,000',
        'line_3_a': '3,000',
        'line_3_b': '1,500',
        'line_4_a': '60,000',
        'line_4_b': '60,000',
        'line_5_a': '0',
        'line_5_b': '0',
        'line_5_c': '0',
        'line_6_a': '200,000',
        'line_6_b': '200,000',
        'line_6_d': '0',
        'line_7': '150,000',
        'line_8': '12,500',
        'gross_income': '4,224,000'}
        form = IncomeForm(data)
        self.assertEqual(form.is_valid(), True)

    def test_two(self):
        
        data = {'line_1_a':'350,000',
        'line_1_b': '50,000',
        'line_1_c': '300,000',

        'line_3_a': '3,000',
        'line_3_b': '1,500',
        'line_4_a': '60,000',
        'line_4_b': '60,000',
   
        'line_6_a': '200,000',
        'line_6_b': '200,000',
        'line_6_d': '0',
       
        'line_8': '12,500',
        'gross_income': '4,224,000'}
        form = IncomeForm(data)
        self.assertEqual(form.is_valid(), True)


    def test_three(self):
        
        data = {'line_1_a':'350,000',
        'line_1_b': '50,000',
        'line_1_c': '300,000',
        'line_2': '3,500,000',
        'line_3_a': '3,000',
        'line_3_b': '1,500',
        'line_4_a': '60,000',
        'line_4_b': '60,000',
        'line_5_a': '0',
        'line_5_b': '0',
        'line_5_c': '0',
        'line_6_a': '200,000',
        'line_6_b': '200,000',
        'line_6_d': '0',
        'line_7': '150,000',
        'line_8': '12,500'}
        form = IncomeForm(data)
        self.assertEqual(form.is_valid(), False)

class ExpenseFormTestCase(TestCase):
    
    def test_one(self):
        
        data = {'line_10': '10,000',
        'line_11': '160,000',
        'line_12': '25,000',
        'line_13': '20,000',
        'line_14': '250,000',
        'line_15': '300,000',
        'line_16': '13,000',
        'line_17': '75,000',
        'line_18': '28,000',
        'line_19': '100,000',
        'line_20': '50,000',
        'line_21_a': '300,000',
        'line_21_b': '50,000',
        'line_22': '200,000',
        'line_23': '15,000',
        'line_24_a': '52,000',
        'line_24_b': '150,000',
        'line_25': '30,000',
        'line_26': '60,000',
        'line_27': '25,000',
        'line_28': '10,000',
        'line_29': '9,000',
        'line_30': '40,000',
        'line_31': '40,000',
        'line_32_a': '10,000',
        'line_32_b': '50,000',
        'total_expenses': '2,072,000'}
        form = ExpenseForm(data)
        self.assertEqual(form.is_valid(), True)

    
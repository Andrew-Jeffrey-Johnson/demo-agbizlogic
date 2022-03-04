import sys
import os
import django

sys.path.append('../../')
os.environ['DJANGO_SETTINGS_MODULE'] = 'AgBiz_Logic.settings'
django.setup()

from university_budget.models import *
from budget.models import *
from localflavor.us.models import USStateField
from localflavor.us.us_states import STATE_CHOICES
import time
import argparse

'''
------ HOW TO RUN ------
python3 FipsBudgetConnector.py --create all


See bottom of program to get a feel for the different options
'''
'''
This code is built to manage the many relationship between budgets and
fips codes.

This code makes some defaults:
 1. If no state is selected, or the budget "state/region" is USA, 0 is used for
    the fips code.
 2. If no county is selected, but the state is selected, all fips codes in that
    state will be added
 3. If neither a state nor a county was selected or able to be found, the fips
    code will default to -1.
'''

FLAGS = None


class FipsBudgetConnector():
    university_budget_items = UniversityBudget.objects.all()
    user_budget_items = Budget.objects.all()
    fips_codes_items = FIPSRegion.objects.all()


    def clearConnections(self, whichBudget):
        if whichBudget is "all" or whichBudget is "agbiz":
            print("Clearing agbiz fips connections...")
            for university_budget in self.university_budget_items.exclude(state=""):
                university_budget.fips_codes.clear()
        if whichBudget is "all" or whichBudget is "user":
            print("Clearing user fips connections...")
            for user_budget in self.user_budget_items:
                user_budget.fips_codes.clear()
        if whichBudget is "all" or whichBudget is "ers":
            print("Clearing ers fips connections...")
            for ers_budget in self.university_budget_items.filter(state=""):
                ers_budget.fips_codes.clear()


    def createUserBudgetConnections(self):
        totalNum = len(self.user_budget_items)
        i = 0
        for user_budget in self.user_budget_items:
            start = time.time()
            i += 1
            for fips_code in self.fips_codes_items.filter(state=str(user_budget.state)):
                if str(user_budget.state) == str(fips_code.state):
                    if str(user_budget.region) in str(fips_code.county):
                        user_budget.fips_codes.clear() #Should be only one code if both are selected
                        user_budget.fips_codes.add(fips_code)
                        break
                    user_budget.fips_codes.add(fips_code)
            print("Finished: %d/%d in %f" % (i, totalNum, time.time()-start))


    def createAgBizBudgetConnections(self):
        totalNum = len(self.university_budget_items.exclude(state=""))
        i = 0
        for university_budget in self.university_budget_items.exclude(state=""):
            start = time.time()
            i += 1
            for fips_code in self.fips_codes_items.filter(state=str(university_budget.state)):
                if str(university_budget.state) == str(fips_code.state):
                    if str(university_budget.region) in str(fips_code.county):
                        university_budget.fips_codes.clear() #Should be only one code if both are selected
                        university_budget.fips_codes.add(fips_code)
                        break
                    university_budget.fips_codes.add(fips_code)
            print("Finished: %d/%d in %f" % (i, totalNum, time.time()-start))

    
    def createERSBudgetConnections(self):
        totalNum = len(self.university_budget_items.filter(state=""))
        i = 0
        for university_budget in self.university_budget_items.filter(state=""):
            start = time.time()
            i += 1
            for fips_code in self.fips_codes_items.filter(ersregionstring=str(university_budget.region)):
                university_budget.fips_codes.add(fips_code)
            print("Finished: %d/%d in %f" % (i, totalNum, time.time()-start))


    # HELPER TO DETERMINE WHICH BUDGETS TO CONNECT
    def createConnections(self, whichBudget):
        if whichBudget is "all" or whichBudget is "agbiz":
            self.createAgBizBudgetConnections()
        if whichBudget is "all" or whichBudget is "user":
            self.createUserBudgetConnections()
        if whichBudget is "all" or whichBudget is "ers":
            self.createERSBudgetConnections()



    def printConnections(self):
        for university_budget in self.university_budget_items:
            codes = university_budget.fips_codes.all()
            if(codes):
                print("----\n%s\n" % (codes))

'''
------  main() -----
Reads in the flags and runs respective functions
'''
def main():
    if not FLAGS.create and not FLAGS.list and not FLAGS.create:
        print("No flags defined. Use --help to learn more. ")
    connector = FipsBudgetConnector()
    if FLAGS.create == "all":
        connector.clearConnections("all")
        connector.createConnections("all")
    if FLAGS.create == "agbiz":
        connector.clearConnections("agbiz")
        connector.createConnections("agbiz")
    if FLAGS.create == "user":
        connector.clearConnections("user")
        connector.createConnections("user")
    if FLAGS.create == "ers":
        connector.clearConnections("ers")
        connector.createConnections("ers")
    if FLAGS.list:
        connector.printConnections()
    if FLAGS.clear:
        connector.clearConnections("all")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
    '--create',
    type=str,
    help='Creates connections. User \'all\', \'agbiz\', or \'user\'',
    )
    parser.add_argument(
    '--list',
    help='Prints all connections. # WARNING: Lots of outputs. Consider piping\
    into file using "> someFile.txt"',
    action='store_true'
    )
    parser.add_argument(
    '--clear',
    help='Clears all connections.',
    action='store_true'
    )

    FLAGS, unparsed = parser.parse_known_args()
    main()

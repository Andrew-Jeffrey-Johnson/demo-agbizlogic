from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from climate.serializers import ClimateBudgetSerializer
from climate.models import ClimateBudget, ClimateScenario
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from geopy.geocoders import Nominatim
from django.conf import settings
import requests
import os
import shutil
from netCDF4 import Dataset
import numpy as np
import math
import os
from datetime import date, timedelta

MAX_LAT = 584
MAX_LON = 1385

class ClimateDataView(APIView):
    """ API endpoint for ClimateData model.
    """
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None, **kwargs):
        #check that our local file for the climate data exits.
        if not os.path.isfile(settings.DATA_PATH):
            data = {
                "error": "Short term Climate Data Unavailable. No data plots will be displayed. If this continues to happen contact system admin."
            }
            return JsonResponse(data, status=500)



        #get the data
        data = []
        county = self.kwargs['county']
        state = self.kwargs['state']
        if not county or not state:
            data = {
                "error": "Please select a valid state and county."
                }
        geolocator = Nominatim(user_agent="agbiz-logic")
        location = geolocator.geocode( county + " " + state)
        if(location == None):
            data = {
                "error": "Please select a valid state and county."
            }
        else:
            latitude = location[1][0]
            longitude = location[1][1]
            data = getData(latitude, longitude, settings.DATA_PATH)
        if 'error' in data:
            return JsonResponse(data, status=404)

        return JsonResponse(data)

#private Helper functions

#this function preforms a grid search to find the nearest point that
#has data with in a 10 x 10 Grid of the latIndex and lonIndex.
#if data still cant be found that (-1, -1) is returned.
def findData(latIndex, lonIndex, datahandle):
    interations = 5
    num = 0
    #if we are to close to the edge move the origin so that we don't over step our bounds.
    if latIndex + 5 > MAX_LAT:
        latIndex = latIndex - (MAX_LAT - latIndex)

    if lonIndex + 5 > MAX_LON:
        lonIndex = lonIndex - (MAX_LON - lonIndex)

    if latIndex - 5 <  0:
        latIndex = latIndex + (5 - latIndex)

    if lonIndex - 5 < 0:
        lonIndex = lonIndex + (5 - lonIndex)

    # preform grid search moving out from the origin.
    for i in range(num):
        for j in range(-i, i):
            if not math.isnan(datahandle[latIndex + i, lonIndex + j, 0]):
                return (latIndex + i,lonIndex + j)

            if not math.isnan(datahandle[latIndex - i,lonIndex + j, 0]):
                return(latIndex + i, lonIndex + j)

            if not math.isnan(datahandle[latIndex + j, lonIndex + i, 0]):
                return(latIndex + j, lonIndex + i)

            if not math.isnan(datahandle[latIndex + j, lonIndex - i, 0]):
                return(latIndex + j, lonIndex - i)
    return(-1, -1)

#this function attempts to find the index of the latTarget and the lonTarget
#if there is no data at that the "Correct index" Then we call a function to
#preform a grid search.
def getIndex(latTarget, lonTarget, latHandle, lonHandle, datahandle):
    #gets the list of all possible lats and longs.
    lat = latHandle[:]
    lon = lonHandle[:]

    #may be a bit off but usually looks good to me.
    latIndex = np.searchsorted(lat, latTarget, side='right')
    lonIndex = np.searchsorted(lon, lonTarget, side='right')

    #if a value exits at this lat lon pair than return the value
    if not math.isnan(datahandle[latIndex, lonIndex, 0]):
        return (latIndex, lonIndex)

    # If we don't find a value for the lat lon do gird search to find the
    # nearest point that has data.
    return findData(latIndex, lonIndex, datahandle)

#takes in a datetime since 1900 and returns a month label.
def getMonth(dateTime):
    start = date(1900, 1, 1)
    delta = timedelta(days=np.float64(dateTime))
    offset = start + delta
    return offset.month




#gets all the climate data.
def getData(lat, lon, path):

    #set up the data handle
    fileHandle = Dataset(path, 'r', format="netcdf4")
    latHandle = fileHandle.variables['lat']
    lonHandle = fileHandle.variables['lon']
    tempHandle = fileHandle.variables['tmp2m']
    tempAnomHandle = fileHandle.variables['tmp2m_anom']
    precipHandle = fileHandle.variables['prate']
    precipAnomHandle = fileHandle.variables['prate_anom_inches']
    timeHandle = fileHandle.variables["time"]

    #find the index
    (latIndex, lonIndex) = getIndex(lat, lon, latHandle, lonHandle, tempHandle)
    dateLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept",  "Oct","Nov", "Dec"]
    print(latIndex, lonIndex)
    if latIndex > 0 and lonIndex > 0:
        precip =  []
        precip_anom =  []
        precip_historic = []
        temp =  []
        temp_anom = []
        temp_historic = []
        labels = []
        lat = float(latHandle[latIndex])
        lon = float(lonHandle[lonIndex])

        #get the data
        for i in range(7):
            precip.append(np.float64(precipHandle[latIndex, lonIndex, i]))
            precip_anom.append(np.float64(precipAnomHandle[latIndex, lonIndex, i]))
            precip_historic.append(np.float64(precipHandle[latIndex, lonIndex, i]) - np.float64(precipAnomHandle[latIndex, lonIndex, i]))
            temp.append(np.float64(tempHandle[latIndex, lonIndex, i]))
            temp_anom.append(np.float64(tempAnomHandle[latIndex, lonIndex, i]))
            temp_historic.append(np.float64(tempHandle[latIndex, lonIndex, i]) - np.float64(tempAnomHandle[latIndex, lonIndex, i]))
            month = getMonth(timeHandle[i])
            labels.append(dateLabels[month - 1])

            #setting the lables for the data here.



        #will need to do some fancy stuff to get labels figured out.
        data = {
            "precip": precip,
            "precip_anom": precip_anom,
            "precip_historic": precip_historic,
            "temp": temp,
            "temp_anom": temp_anom,
            "temp_historic": temp_historic,
            "labels": labels,
            "lat": lat,
            "lon": lon
        }

        return data
    else:
        data = {
            "error": "No data available for that location. Please try again with a different location"
        }

        return data

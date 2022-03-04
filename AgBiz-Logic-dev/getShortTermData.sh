#!/bin/bash
cd app
if [ ! -d ./shortTermData ]; then
    mkdir shortTermData
fi
cd ./shortTermData
wget http://thredds.northwestknowledge.net:8080/thredds/fileServer/NWCSC_INTEGRATED_SCENARIOS_ALL_CLIMATE/bcsd-nmme/monthlyForecasts/bcsd_nmme_metdata_ENSMEAN_forecast_1monthAverage.nc
if [ -f shortTermData.nc ];
then
    rm shortTermData.nc
fi

cp bcsd_nmme_metdata_ENSMEAN_forecast_1monthAverage.nc shortTermData.nc

rm bcsd_nmme_metdata_ENSMEAN_forecast_1monthAverage.nc

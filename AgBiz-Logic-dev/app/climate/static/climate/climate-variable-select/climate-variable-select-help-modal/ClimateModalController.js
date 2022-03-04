(function() {
  'use strict';

  angular
    .module('climateModule')
    .controller('ClimateModalController', ClimateModalController);

  ClimateModalController.$inject = [
    '$uibModalInstance',
    '$state',
    '$interval',
    'help_items'
  ];

  function ClimateModalController(
    $uibModalInstance,
    $state,
    $interval,
    help_items) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.help_items;
    $ctrl.variable_divs = {};
    $ctrl.definitions = {};


    /****************************************************************
                        Controller Methods
    ****************************************************************/

    function $onInit() {
      buildVariableDivs();
      //console.log($ctrl.variable_divs);
    }



    function buildVariableDivs() {
      //console.log(help_items);
      var idx = 0;
      for(var key in help_items) {
        if (help_items.hasOwnProperty(key)) {
          $ctrl.variable_divs[String(key)] = String(help_items[key]);
          // console.log(key);
          // $ctrl.variable_divs.push([
          //   "id": idx,
          //   "variable":key,
          //   "definition":help_items[key]
          // ]);
        }
      }
    }


    $ctrl.definitions = {
      "Chilling Hours Accumulation (32–45°F; Nov–Mar)":"The number of hours between 32°F and 45°F accumulated over November 1 and March 31.",
      "Chilling Hours Total (32–45°F; Nov–Mar)":"The total number of hours between 32°F and 45°F accumulated each day between November 1 and March 31. Hourly temperatures are derived from daily minimum and maximum temperatures.",
      "Cold Snap Event Frequency":"The mean number of cold snap events per year defined as three or more consecutive days with minimum temperature below 32°F.",
      "Coldest Night Temperature":"The mean coldest minimum daily temperature experienced each winter.",
      "Diurnal Temperature Range":"The annual average of the difference between maximum and minimum daily temperature.",
      "Evaporation":"The amount of average annual evaporation.",
      "First Fall Freeze":"The median day of the year after August 1st which minimum daily temperature drops below 32°F for the first time after summer.",
      "Frost Days Frequency":"The mean number of days each year in which the minimum daily temperature is less than 32°F.",
      "Growing Degree Days Accumulation (Base 50°F)":"The amount of mean daily temperature above a base 50°F accumulated over January through December.",
      "Growing Degree Days Total (Base 32°F)":"The total amount of mean daily temperature above a base 32°F accumulated for each day over January through December.",
      "Growing Degree Days Total (Base 37.4°F)":"The total amount of mean daily temperature above a base 37.4°F accumulated for each day over January through December.",
      "Growing Degree Days Total (Base 41°F)":"The total amount of mean daily temperature above a base 41°F accumulated for each day over January through December.",
      "Growing Degree Days Total (Base 50°F)":"The total amount of mean daily temperature above a base 50°F accumulated for each day over January through December.",
      "Growing Season Length":"The mean number of days between the last spring freeze and first fall freeze.",
      "Heat Wave Event Frequency":"The mean number of heat wave events per year defined as three or more consecutive days with maximum daily temperature above 95°F.",
      "Heavy Precipitation Event Frequency":"The mean number of days each year in which the daily precipitation is greater than 0.5.",
      "Hottest Day Temperature":"The mean highest maximum daily temperature each year.",
      "Last Spring Freeze":"The median day of the year during which minimum daily temperature drops below 32°F for the last time before summer.",
      "Longest Dry Spell Length":"The mean maximum number of consecutive days per year with daily precipitation less than 0.01.",
      "Longest Wet Spell Length":"The mean maximum number of consecutive days per year with daily precipitation greater than or equal to 0.01.",
      "Maximum Temperature":"The annual average of monthly mean of daily high temperatures.",
      "Mean Temperature":"Annual average of monthly means of daily mean temperatures, computed as the mean of daily high and low temperatures.",
      "Minimum Temperature":"The annual average of monthly mean of daily low temperatures.",
      "Potential Evapotranspiration (Spring)":"Reference evapotranspiration, averaged over March through May, for a well-watered grass surface, this represents the maximum water demand for a reference grass crop calculated using the Penman-Monteith method.",
      "Precipitation":"The annual accumulated amount of daily precipitation.",
      "Snow Water Equivalent (April 1)":"The amount of water contained in the snowpack on April 1.",
      "Total Soil Moisture (Spring)":"The amount of water contained in the upper few meters of soil averaged over March through May.",
      "Tropical Nights Frequency":"The mean number of days each year in which the minimum daily temperature is greater than 68°F.",
      "Warm Days Frequency":"The mean number of days each year in which the maximum daily temperature is greater than 86°F."
    }



    function filterVariables() {

    }
  }
})();

(function() {
  'use strict';

  angular
    .module("commonModule")
    .factory("commonService", commonServiceFactory);

    commonServiceFactory.$inject = [
      '$rootScope',
      '$http',
      '$q',
    ];

    function commonServiceFactory(
      $rootScope,
      $http,
      $q) {
      var url_current_user = "/common/api/current_user/",
          url_next_step = "/common/api/next_step/",
          url_base_region_data = "/static/common/json/region_data.json",
          url_base_state_region_data = "/static/common/json/University_budget_for_State_Regions.json",
          url_commodities = "/static/common/json/commodities.json",
          url_contact_us = "/common/api/contact_us/";

      var storage = [],
          observer_callbacks = [];

      var commonService = {
        subscribeStateChange: subscribeStateChange,
        pushStorage: pushStorage,
        accessStorage: accessStorage,
        popStorage: popStorage,
        clearStorage: clearStorage,
        retrieveCurrentUser: retrieveCurrentUser,
        retrieveRegionData: retrieveRegionData,
        retrieveStateRegionData: retrieveStateRegionData,
        listCommodities: listCommodities,
        getNextStep: getNextStep,
        sendSupportMessage: sendSupportMessage,
      };

      return commonService;


      /****************************************************************
                           Methods
      ****************************************************************/

      // Observer
      function subscribeStateChange(callback) {
        observer_callbacks.push(callback);

        $rootScope.$on("$stateChangeSuccess", function() {
          angular.forEach(observer_callbacks, function(callback) {
            callback();
          });
        });
      }

      // Local storage/retrieval

      function pushStorage(item) {
        var response = $q.defer();
        storage.push(item);
        response.resolve({'data': item});

        return response.promise;
      }


      function accessStorage() {
        var response = $q.defer();
        var data = new Object();
        if (storage.length > 0) {
          data = storage[storage.length - 1];
        }
        response.resolve({'data': data});

        return response.promise;
      }


      function popStorage() {
        var response = $q.defer();
        var data = new Object();
        if (storage.length > 0) {
          data = storage[storage.length - 1];
          storage.splice(storage.length, 1);
        }
        respones.resolve({'data': data});

        return response.promise;
      }


      function clearStorage() {
        storage = [];
      }

      function retrieveRegionData() {
        return $http.get(url_base_region_data);
      }

      function retrieveStateRegionData(){
        return $http.get(url_base_state_region_data);
      }

      function listCommodities() {
        return $http.get(url_commodities);
      }

      function retrieveCurrentUser() {
        return $http.get(url_current_user);
      }


      function getNextStep(username) {
        return $http.get(url_next_step + "?username=" + username);
      }


      function sendSupportMessage(message) {
        return $http.post(url_contact_us, message);
      }

    }

})();

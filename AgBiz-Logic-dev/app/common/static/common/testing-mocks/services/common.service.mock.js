(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("commonServiceMock", commonServiceMock);

    commonServiceMock.$inject = [
      '$q',
    ];

    function commonServiceMock($q) {
      var storage = [],
          observer_callbacks = [];

      var commonServiceMock = {
        subscribeStateChange: subscribeStateChange,
        pushStorage: pushStorage,
        listCommodities: listCommodities,
        accessStorage: accessStorage,
        popStorage: popStorage,
        clearStorage: clearStorage,
        retrieveCurrentUser: retrieveCurrentUser,
        retrieveRegionData: retrieveRegionData,
        getNextStep: getNextStep,
        sendSupportMessage: sendSupportMessage,
        retrieveStateRegionData: retrieveStateRegionData,
      };

      return commonServiceMock;


      /****************************************************************
                           Methods
      ****************************************************************/

      // Observer
      function subscribeStateChange(callback) {
        observer_callbacks.push(callback);
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


      function retrieveCurrentUser() {
        var user = {
          'id': 1,
          'username': "johncleese",
        };
        var response = $q.defer();
        response.resolve({'data': user});

        return response.promise;
      }

      function listCommodities() {
        return $q.when({
          'data': {
            "Livestock": {
              "name": "Livestock",
              "label": "Enterprise Type",
              "market_label": "Market",
              "markets": [
                {
                  "name": "Conventional"
                }
              ],
              "category_1": [
                {
                  "name": "Beef Cattle",
                  "label": "Type of Production",
                  "category_2": [
                    {
                      "name": "Weaning - owned grazing"
                    }
                  ]
                }
              ]
            }
          }
        });
      }

      function retrieveRegionData() {
        return $q.when({
          'data': [
            {
              'Oregon': [
                'Washington',
                'Portland'
              ]
            }
          ]
        });
      }



      function retrieveStateRegionData() {
        return $q.when({
                  'data': [
                      {
                "region": [
                    "Northern", 
                    "Southcentral", 
                    "Southeastern", 
                    "Southeastern Dryland", 
                    "Southwestern"
                ], 
                "state": "ID"
            }, 
            {
                "region": [
                    "East Central", 
                    "South East", 
                    "South RRV", 
                    "North RRV", 
                    "South Central", 
                    "North East", 
                    "North Central", 
                    "North West", 
                    "South West"
                ], 
                "state": "ND"
            }, 
            {
                "region": [
                    "Willamette Valley", 
                    "North Central", 
                    "Eastern", 
                    "South Central", 
                    "Klamath Basin Area", 
                    "Christmas Valley Area", 
                    "South Western", 
                    "Central"
                ], 
                "state": "OR"
            }
                  ]
                });
      }


      function getNextStep(username) {
        var next_step = {
          'next_step': "agbiz",
        };
        return $q.when({'data': next_step});
      }


      function sendSupportMessage(message) {
        return $q.when({'data': message});
      }
    }

})();

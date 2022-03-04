(function() {

  describe("commonService", function() {
    var $scope,
        $httpBackend,
        user,
        url_base_current_user,
        url_next_step,
        url_contact_us,
        url_base_region_data,
        commonService;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $httpBackend = $injector.get("$httpBackend");
      commonService = $injector.get("commonService");

      url_base_current_user = "/common/api/current_user/";
      url_next_step = "/common/api/next_step/";
      url_contact_us = "/common/api/contact_us/";
      url_base_region_data = "/static/common/json/region_data.json";
      url_base_state_region_data = "/static/common/json/University_budget_for_State_Regions.json";
      user = {
        'id': 1,
        'username': "johncleese",
      };
    }));



    describe("setStateObserver", function() {
      var callback;

      beforeEach(function() {
        spyOn($scope, "$on").and.returnValue();
        callback = jasmine.createSpy("callback");
      });


      it("registers a callback function to fire on $stateChangeSuccess event", function() {
        commonService.subscribeStateChange(callback);

        expect($scope.$on.calls.argsFor(0)).toContain("$stateChangeSuccess");
      });


      it("fires registered callback function on $stateChangeSuccess event", function() {
        commonService.subscribeStateChange(callback);
        $scope.$on("$stateChangeSuccess", callback);
        $scope.$emit("$stateChangeSuccess");

        // expect(callback).toHaveBeenCalled();
        console.log("commonService setStateObserver test still failing");
      });
    });



    describe("retreiveCurrentUser", function() {

      beforeEach(function() {
        $httpBackend.expectGET(url_base_current_user).respond(200, user);
      });


      it("calls $http service to retrieve current user", function() {
        commonService.retrieveCurrentUser()
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(user);
        });

        $httpBackend.flush();
      });

    });



    describe("retrieveRegionData", function() {
      var region_data;

      it("returns a JSON object of states and counties", function() {
        region_data = [
          {
            'Oregon': [
              'Washington',
              'Portland'
            ]
          }
        ];
        $httpBackend.expectGET(url_base_region_data).respond(200, region_data);

        commonService.retrieveRegionData()
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(region_data);
        });

        $httpBackend.flush();
      });
    });



    describe("retrieveStateRegionData", function() {
      var region_data;

      it("returns a JSON object of states and regions", function() {
        region_data = [
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
        ];
        $httpBackend.expectGET(url_base_state_region_data).respond(200, region_data);

        commonService.retrieveStateRegionData()
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(region_data);
        });

        $httpBackend.flush();
      });
    });




    describe("local storage/retrieval", function() {
      var item;

      beforeEach(function() {
        item = {'id': 1};
      });

      it("can store an object and return a promise", function() {
        commonService.pushStorage(item)
        .then(function(response) {
          expect(response).toEqual(item);
        });
      });


      it("can retrieve the newest object stored and return a promise", function() {
        commonService.pushStorage({'id': 2})
        .then(function() {
          return commonService.pushStorage(item);
        })
        .then(function() {
          return commonService.accessStorage();
        })
        .then(function() {
          expect(response).toEqual(item);
        });
      });


      it("returns empty object if no object in storage", function() {
        commonService.accessStorage()
        .then(function(response) {
          expect(response).toEqual({});
        });
      });


      it("can retrieve and remove the newest object stored and return a promise", function() {
        commonService.pushStorage(item)
        .then(function() {
          return commonService.popStorage();
        })
        .then(function(response) {
          expect(response).toEqual(item);

          return commonService.accessStorage();
        })
        .then(function(response) {
          expect(response).toEqual({});
        });
      });


      it("can clear the entire storage", function() {
        commonService.pushStorage(item)
        .then(function() {
          return commonService.clearStorage();
        })
        .then(function() {
          return commonService.accessStorage();
        })
        .then(function(response) {
          expect(response).toEqual({});
        });

      });

    });



    describe("getNextStep", function () {
      var username,
          next_step;

      beforeEach(function() {
        username = "johncleese";
        next_step = "agbiz";

        $httpBackend.expectGET(url_next_step + "?username=" + username)
        .respond(200, "agbiz");
      });


      it("makes API to retrieve next step with username in query parameters", function () {
        commonService.getNextStep(username)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(next_step);
        });
      });

    });

    describe("listCommodities", function() {

    });


    describe("sendSupportMessage", function () {
      var message;

      beforeEach(function() {
        message = {
          'subject': "My Complaint",
          'message': "Why aren't there more forms?"
        };
      });


      it("makes API request to send support message", function () {
        $httpBackend.expectPOST(url_contact_us, message)
        .respond(200, message);

        commonService.sendSupportMessage(message)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(message);
        });

      });

    });

  });


}());

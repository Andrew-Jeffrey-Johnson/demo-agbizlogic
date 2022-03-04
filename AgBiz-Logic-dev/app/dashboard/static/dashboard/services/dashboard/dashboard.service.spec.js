(function() {
  'use strict';

  describe("dashboardService", function() {
    var $scope,
        $httpBackend,
        $compileSpy,
        dashboardService,
        configServiceMock,
        url_dashboard,
        dashboard_model;

    beforeEach(module("dashboardModule"));
    beforeEach(module("mockModule"));

    beforeEach(module(function($provide) {
      $compileSpy = jasmine.createSpy("$compileSpy").and.callFake(function(scope) {
        return function() {
          return "DOMElement";
        }});
      $provide.value("$compile", $compileSpy);
    }));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $httpBackend = $injector.get("$httpBackend");
      configServiceMock = $injector.get("configServiceMock")
      dashboardService = $injector.get("dashboardService", {
        configService: configServiceMock,
      });

      url_dashboard = "/dashboard/api/dashboards/";
      dashboard_model = {
        'id': 32,
        'tiles': [
          {
            'id': 54,
            'tile_type': "info",
            'row': 1,
            'column': 2,
          },
        ],
      };
    }));



    describe("retrieveDashboard", function() {

      it("calls API to retrieve user's dashboard configuration", function() {
        $httpBackend.expectPOST(url_dashboard)
        .respond(200, dashboard_model);

        dashboardService.retrieveDashboard()
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(dashboard_model);
        });

        $httpBackend.flush();
      });

    });



    describe("updateDashboard", function() {

      it("calls API to update user's dashboard configuration", function() {
        $httpBackend.expectPUT(url_dashboard)
        .respond(200, dashboard_model);

        dashboardService.updateDashboard(dashboard_model)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(dashboard_model);
        });

        $httpBackend.flush();
      });

    });



    describe("setTileGrid", function() {

      it("returns a promise that resolves to the tile grid", function(done) {
        var expected_tile_grid = {
          "2": {
            "1": "DOMElement",
          },
        };
        dashboardService.setTileGrid(dashboard_model, $scope)
        .then(function(tile_grid) {
          expect(tile_grid).toEqual(expected_tile_grid);
          done();
        });
        $scope.$digest();
      });


      xit("calls config service to retrieve application configuration", function(done) {
        spyOn(configServiceMock, "retrieveConfig").and.callThrough();
        dashboardService.setTileGrid(dashboard_model, $scope)
        .then(function(tile_grid) {
          expect(configServiceMock.retrieveConfig).toHaveBeenCalled();
          done();
        });
        $scope.$digest();
      });


      it("calls $compile service to compile tiles", function(done) {
        dashboardService.setTileGrid(dashboard_model, $scope)
        .then(function(tile_grid) {
          expect($compileSpy).toHaveBeenCalled();
          done();
        });
        $scope.$digest();
      });

    });

  });

}());

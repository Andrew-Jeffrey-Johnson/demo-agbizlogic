describe("Service: configService", function() {
  var configService,
      $window,
      $scope;

  beforeEach(module('commonModule'));

  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    $window = $injector.get('$window');
    configService = $injector.get('configService');
  }));



  describe("retrieveConfig", function() {
    var config;

    beforeEach(function() {
      $window.__config = null;
      config = {
        environment: "dev",
      };
    });


    it("returns a rejected promise if the config object could not be retrieved from $window service", function(done) {
      configService.retrieveConfig()
      .then(function(config) {
        fail();
        done();
      })
      .catch(function(reason) {
        expect(reason).toEqual({'error': "config object not found"});
        done();
      });

      $scope.$digest();
    });


    it("returns a promise that resolves to the config object retrieved from the $window service if present", function(done) {
      $window.__config = config;
      configService.retrieveConfig()
      .then(function(config) {
        expect(config).toEqual($window.__config);
        done();
      })
      .catch(function(reason) {
        fail();
        done();
      });

      $scope.$digest();
    });

  });

});
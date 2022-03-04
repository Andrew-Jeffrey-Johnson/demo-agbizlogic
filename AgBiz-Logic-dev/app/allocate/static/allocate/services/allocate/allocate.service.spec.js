describe("allocateService", function() {
  var allocateService,
      $httpBackend;

  beforeEach(module('allocateModule'));

  beforeEach(inject(function($injector) {
    allocateService = $injector.get('allocateService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  describe("listCatagories", function() {

  });



  describe("listScheduleF", function() {

  });



  describe("convertToGoldStandard", function() {

  });



  describe("listBusinessData", function() {

  });



  describe("listWholeFarm", function() {

  });



  describe("createBusinessData", function() {

  });



  describe("retrieveBusinessData", function() {

  });



  describe("updateBusinessData", function() {

  });



  describe("destroyBusinessData", function() {

  });



  describe("markCompleted", function() {

  });



  describe("listEnterpriseData", function() {

  });



  describe("createEnterpriseData", function() {

  });



  describe("retrieveEnterpriseData", function() {

  });



  describe("updateEnterpriseData", function() {

  });



  describe("destroyEnterpriseData", function() {

  });

});

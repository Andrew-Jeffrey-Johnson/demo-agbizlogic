(function() {
  'use strict';

  angular
    .module("allocateModule")
    .factory("allocateService", allocateServiceFactory);

  allocateServiceFactory.$inject = [
    "$http",
  ];

  function allocateServiceFactory($http) {
    var url_enterprise_data = "/allocate/api/enterprisedata/";
    var url_business_data = "/allocate/api/businessdata/";
    var url_schedulef_data = "/allocate/api/schedule_f/";
    var url_gold_standard_categories = "/static/allocate/services/gold_standard_categories.json";
    var url_convert = "/allocate/api/convert/";

    var allocateService = {
      listCategories: listCategories,
      listScheduleF: listScheduleF,
      convertToGoldStandard: convertToGoldStandard,

      listBusinessData: listBusinessData,
      listWholeFarm: listWholeFarm,
      createBusinessData: createBusinessData,
      retrieveBusinessData: retrieveBusinessData,
      updateBusinessData: updateBusinessData,
      destroyBusinessData: destroyBusinessData,
      markCompleted: markCompleted,

      listEnterpriseData: listEnterpriseData,
      createEnterpriseData: createEnterpriseData,
      retrieveEnterpriseData: retrieveEnterpriseData,
      updateEnterpriseData: updateEnterpriseData,
      destroyEnterpriseData: destroyEnterpriseData,
    };

    return allocateService;


    /****************************************************************
                         Methods
    ****************************************************************/

    function listCategories() {
      return $http.get(url_gold_standard_categories);
    }


    function listScheduleF(username) {
      return $http.get(url_schedulef_data + "?username=" + username);
    }


    function convertToGoldStandard(schedulef_id) {
      return $http.post(url_convert, {'schedulef': schedulef_id});
    }


    // BusinessData CRUD operations

    function listBusinessData(username) {
      return $http.get(url_business_data + "?username=" + username);
    }


    function listWholeFarm(username) {
      return $http.get(url_business_data + "list_whole_farm/");
    }


    function createBusinessData(new_business_data) {
      return $http.post(url_business_data, new_business_data);
    }


    function retrieveBusinessData(id) {
      return $http.get(url_business_data + id + "/");
    }


    function updateBusinessData(business_data) {
      return $http.put(url_business_data + business_data.id + "/", business_data);
    }


    function destroyBusinessData(id) {
      return $http.delete(url_business_data + id + "/");
    }


    function markCompleted(businessdata_id) {
      return $http.post(url_business_data + businessdata_id + "/complete/", {});
    }


    // EnterpriseData CRUD operations

    function listEnterpriseData(username) {
      return $http.get(url_enterprise_data + "?username=" + username);
    }


    function createEnterpriseData(new_enterprise_data) {
      return $http.post(url_enterprise_data, new_enterprise_data);
    }


    function retrieveEnterpriseData(id) {
      return $http.get(url_enterprise_data + id + "/");
    }


    function updateEnterpriseData(enterprise_data) {
      return $http.put(url_enterprise_data + enterprise_data.id + "/", enterprise_data);
    }


    function destroyEnterpriseData(id) {
      return $http.delete(url_enterprise_data + id + "/");
    }

  }


}());

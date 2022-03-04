(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("allocateServiceMock", allocateServiceMock);

    allocateServiceMock.$inject = [
      '$q',
    ];

    function allocateServiceMock($q) {

      var allocateServiceMock = {
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

      return allocateServiceMock;


      /****************************************************************
                           Methods
      ****************************************************************/

      function listCategories() {
        var defer = $q.defer();
        defer.resolve({'data': categories});

        return defer.promise;
      }


      function listScheduleF(username) {
        var defer = $q.defer();
        defer.resolve({'data': schedule_f_list});

        return defer.promise;
      }

      function convertToGoldStandard(schedulef_id) {
        var gold_standard_data = {
          "income_sales": {
             "name": "income_sales",
             "label": "Sales of livestock, produce, grains and other products",
             "type": "income",
             "total": 0,
           },
        };

        return $q.when({'data': gold_standard_data});
      }

      // BusinessData CRUD operations

      function listBusinessData(username) {
        var defer = $q.defer();
        defer.resolve({'data': business_data_list});

        return defer.promise;
      }


      function listWholeFarm(username) {
        var defer = $q.defer();
        defer.resolve({'data': whole_farm_list});

        return defer.promise;
      }


      function createBusinessData(new_business_data) {
        var defer = $q.defer();
        defer.resolve({'data': new_business_data});

        return defer.promise;
      }


      function retrieveBusinessData(id) {
        var defer = $q.defer();
        defer.resolve({'data': {}});

        return defer.promise;
      }


      function updateBusinessData(business_data) {
        var defer = $q.defer();
        defer.resolve({'data': business_data});

        return defer.promise;
      }


      function destroyBusinessData(id) {
        var defer = $q.defer();
        defer.resolve({'data': "Not found."});

        return defer.promise;
      }


      function markCompleted(id) {
        return $q.when({'data': {}});
      }


      // EnterpriseData CRUD operations

      function listEnterpriseData(username) {
        var defer = $q.defer();
        defer.resolve({'data': enterprise_data_list});

        return defer.promise;
      }


      function createEnterpriseData(new_enterprise_data) {
        var defer = $q.defer();
        defer.resolve({'data': new_enterprise_data});

        return defer.promise;
      }


      function retrieveEnterpriseData(id) {
        var defer = $q.defer();
        defer.resolve({'data': {}});

        return defer.promise;
      }


      function updateEnterpriseData(enterprise_data) {
        var defer = $q.defer();
        defer.resolve({'data': enterprise_data});

        return defer.promise;
      }


      function destroyEnterpriseData(id) {
        var defer = $q.defer();
        defer.resolve({'data': "Not found."});

        return defer.promise;
      }


    }

    var user = {
      'id': 1,
      'username': "johncleese",
    };

    var schedule_f_list = [
      {
        'id': 1,
        'income_sales': "200,000",
      },
    ];

    var whole_farm_list =
      {
        'expenses': {},
        'income': {}
      };

    var business_data_list = [
      {
        'id': 1,
        'business_type': "Crop",
      },
      {
        'id': 2,
        'business_type': "Livestock",
      },
    ];

    var enterprise_data_list = [
      {
        'id': 1,
        'enterprise': "Crop",
        'category_1': "Wheat",
      },
      {
        'id': 2,
      },
    ];

    var categories = {
      "expenses_goods": {
        "name": "expenses_goods",
        "label": "Cost of goods sold",
        "type": "expense",
        "total": 0
      },
      "expenses_car": {
        "name": "expenses_car",
        "label": "Car and truck expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_chemicals": {
        "name": "expenses_chemicals",
        "label": "Chemicals",
        "type": "expense",
        "total": 0
      },
      "expenses_conservation": {
        "name": "expenses_conservation",
        "label": "Conservation expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_custom_hire": {
        "name": "expenses_custom_hire",
        "label": "Custom hire",
        "type": "expense",
        "total": 0
      },
      "expenses_depreciation": {
        "name": "expenses_depreciation",
        "label": "L-T asset replacement and section 179 expense",
        "type": "expense",
        "total": 0
      },
      "expenses_employee_benefit": {
        "name": "expenses_employee_benefit",
        "label": "Employee benefit programs",
        "type": "expense",
        "total": 0
      },
      "expenses_feed": {
        "name": "expenses_feed",
        "label": "Feed",
        "type": "expense",
        "total": 0
      },
      "expenses_fertilizers": {
        "name": "expenses_fertilizers",
        "label": "Fertilizers and lime",
        "type": "expense",
        "total": 0
      },
      "expenses_freight": {
        "name": "expenses_freight",
        "label": "Freight and trucking",
        "type": "expense",
        "total": 0
      },
      "expenses_gasoline": {
        "name": "expenses_gasoline",
        "label": "Gasoline, fuel and oil",
        "type": "expense",
        "total": 0
      },
      "expenses_insurance": {
        "name": "expenses_insurance",
        "label": "Insurance (other than health)",
        "type": "expense",
        "total": 0
      },
      "expenses_interest_mortgages": {
        "name": "expenses_interest_mortgages",
        "label": "Interest on loans and mortgages",
        "type": "expense",
        "total": 0
      },
      "expenses_labor": {
        "name": "expenses_labor",
        "label": "Labor hired (less employment credits)",
        "type": "expense",
        "total": 0
      },
      "expenses_pension": {
        "name": "expenses_pension",
        "label": "Pension and profit-sharing plans",
        "type": "expense",
        "total": 0
      },
      "expenses_machinery_rent": {
        "name": "expenses_machinery_rent",
        "label": "Rent and leases: Machinery, equipment and vehicles",
        "type": "expense",
        "total": 0
      },
      "expenses_land_rent": {
        "name": "expenses_land_rent",
        "label": "Rent and leases: Land and animals",
        "type": "expense",
        "total": 0
      },
      "expenses_repairs": {
        "name": "expenses_repairs",
        "label": "Repairs and maintenance",
        "type": "expense",
        "total": 0
      },
      "expenses_seeds": {
        "name": "expenses_seeds",
        "label": "Seeds and plants",
        "type": "expense",
        "total": 0
      },
      "expenses_storage": {
        "name": "expenses_storage",
        "label": "Storage and warehousing",
        "type": "expense",
        "total": 0
      },
      "expenses_supplies": {
        "name": "expenses_supplies",
        "label": "Supplies",
        "type": "expense",
        "total": 0
      },
      "expenses_property_taxes": {
        "name": "expenses_property_taxes",
        "label": "Property taxes",
        "type": "expense",
        "total": 0
      },
      "expenses_utilities": {
        "name": "expenses_utilities",
        "label": "Utilities",
        "type": "expense",
        "total": 0
      },
      "expenses_veterinary": {
        "name": "expenses_veterinary",
        "label": "Veterinary, breeding, and medicine",
        "type": "expense",
        "total": 0
      },
      "expenses_other_1": {
        "name": "expenses_other_1",
        "label": "Other expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_other_2": {
        "name": "expenses_other_2",
        "label": "Other expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_other_3": {
        "name": "expenses_other_3",
        "label": "Other expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_other_4": {
        "name": "expenses_other_4",
        "label": "Other expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_other_5": {
        "name": "expenses_other_5",
        "label": "Other expenses",
        "type": "expense",
        "total": 0
      },
      "expenses_other_6": {
        "name": "expenses_other_6",
        "label": "Other expenses",
        "type": "expense",
        "total": 0
      },
      "income_sales": {
        "name": "income_sales",
        "label": "Sales of livestock, produce, grains and other products",
        "type": "income",
        "total": 0
      },
      "income_cooperative": {
        "name": "income_cooperative",
        "label": "Cooperative distributions received",
        "type": "income",
        "total": 0
      },
      "income_agriculture_programs": {
        "name": "income_agriculture_programs",
        "label": "Agricultural program payments",
        "type": "income",
        "total": 0
      },
      "income_insurance": {
        "name": "income_insurance",
        "label": "Crop insurance proceeds and federal crop disaster payments",
        "type": "income",
        "total": 0
      },
      "income_custom_hire": {
        "name": "income_custom_hire",
        "label": "Custom hire income",
        "type": "income",
        "total": 0
      },
      "income_other": {
        "name": "income_other",
        "label": "Other income",
        "type": "income",
        "total": 0
      }
    };




}());

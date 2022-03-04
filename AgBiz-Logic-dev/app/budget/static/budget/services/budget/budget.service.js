(function() {
  "use strict";

  angular
    .module('budgetModule')
    .factory('budgetService', budgetServiceFactory);

  budgetServiceFactory.$inject = [
    "$http",
    "$q",
  ];

  function budgetServiceFactory(
    $http,
    $q) {

    /****************************************************************
                         Private Attributes
    ****************************************************************/

    var url_base_budgets = '/budget/api/budgets/';
    var url_base_budgets_generate = url_base_budgets + "generate/";
    var url_base_university_budgets = '/university_budget/api/university_budgets/';
    var url_base_fixed_costs = '/budget/api/fixed_cost_items/';
    var url_base_variable_costs = '/budget/api/variable_cost_items/';
    var url_base_general_costs = '/budget/api/general_cost_items/';
    var url_base_income = '/budget/api/income_items/';
    var url_base_states_list = '/static/json/states.json';
    var url_base_crop_cost_categories = '/static/budget/json/crop_cost_categories.json';
    var url_base_nursery_cost_categories = '/static/budget/json/nursery_cost_categories.json';
    var url_base_livestock_cost_categories = '/static/budget/json/livestock_cost_categories.json';
    var url_base_crop_cost_data = '/static/budget/json/crop_cost_data.json';
    var url_base_nursery_cost_data = '/static/budget/json/nursery_cost_data.json';
    var url_base_livestock_cost_data = '/static/budget/json/livestock_cost_data.json';
    var url_base_nursery_cost_data = '/static/budget/json/nursery_cost_data.json';


    /****************************************************************
                         Factory Object
    ****************************************************************/

    var budgetService = {
      listUniversityBudgets: listUniversityBudgets,
      retrieveUniversityBudget: retrieveUniversityBudget,
      createFromUniversityBudget: createFromUniversityBudget,

      listBudgets: listBudgets,
      retrieveBudget: retrieveBudget,
      createBudget: createBudget,
      updateBudget: updateBudget,
      destroyBudget: destroyBudget,
      combineBudgets: combineBudgets,
      copyBudget: copyBudget,
      copyBudgetByID: copyBudgetByID,
      generateBudgets: generateBudgets,
      adjustNetReturns: adjustNetReturns,
      scaleFarmUnitQuantity: scaleFarmUnitQuantity,

      createBudgetItem: createBudgetItem,
      retrieveBudgetItem: retrieveBudgetItem,
      updateBudgetItem: updateBudgetItem,
      destroyBudgetItem: destroyBudgetItem,

      retrieveStatesList: retrieveStatesList,
      retrieveBudgetCostCategories: retrieveBudgetCostCategories,
      retrieveBudgetCostData: retrieveBudgetCostData,
    };

    return budgetService;


    /****************************************************************
                         Methods
    ****************************************************************/

    // Correct usage is to list desired fields as a string separated by commas
    // ex. "id,enterprises", pass "" for all fields
    // FIXME: Fields should be an array of desired fields with error handling
    function listUniversityBudgets(fields) {
      var request = url_base_university_budgets;
      if (fields !== undefined && fields !== "") {
        request += "?fields=" + fields;
      }

      return $http.get(request);
    }


    function retrieveUniversityBudget(id) {
      return $http.get(url_base_university_budgets + id + "/");
    }


    function createFromUniversityBudget(university_budget_id, module) {
      if(!module){
        module='';
      }
      return $http.post(url_base_university_budgets + university_budget_id + "/create_budget/",{"module" : module});
    }


    // Correct usage is to list desired fields as a string separated by commas
    // ex. "id,enterprises", pass "" for all fields
    // FIXME: Fields should be an array of desired fields with error handling
    function listBudgets(username, fields, module_name) {
      var request = url_base_budgets + "?username=" + username;

      if (fields !== undefined &&
          fields !== "") {
        request += "&fields=" + fields;
      }
      if (module_name === undefined ||
          module_name === "") {
        request += "&module=allocate";
      }
      else {
        request += "&module=" + module_name;
      }

      return $http.get(request);
    }


    // FIXME: Add filtering of object fields
    function retrieveBudget(id) {
      return $http.get(url_base_budgets + id + "/");
    }


    function createBudget(budget) {
      return $http.post(url_base_budgets, budget);
    }


    function updateBudget(budget) {
      return $http.put(url_base_budgets + budget.id + "/", budget);
    }


    function destroyBudget(id) {
      return $http.delete(url_base_budgets + id + "/");
    }


    function combineBudgets(budgets) {
      return $http.post(url_base_budgets + "combine/", {'budgets': budgets});
    }


    function copyBudget(budget) {
      return $http.post(url_base_budgets + budget.id + "/copy/", {});
    }

    function copyBudgetByID(budget_id) {
      return $http.post(url_base_budgets + budget_id + "/copy/", {});
    }


    function generateBudgets() {
      return $http.post(url_base_budgets_generate, {});
    }


    function adjustNetReturns(budget_id, percent) {
      return $http.post(url_base_budgets + budget_id + "/adjust_net_returns/", {'percent': percent});
    }


    function scaleFarmUnitQuantity(budget_id, new_farm_unit_quantity) {
      return $http.post(url_base_budgets + budget_id + "/scale_farm_unit_quantity/", {'new_farm_unit_quantity': new_farm_unit_quantity});
    }


    // Budget Item CRUD

    function createBudgetItem(item_type, item) {
      switch (item_type) {
         case "income":
          return $http.post(url_base_income, item);
        case "fixed":
          return $http.post(url_base_fixed_costs, item);
        case "variable":
          return $http.post(url_base_variable_costs, item);
        case "general":
          return $http.post(url_base_general_costs, item);
        default:
          return null;
      }
    }

    function retrieveBudgetItem(item_type, item) {
      switch (item_type) {
         case "income":
          return $http.get(url_base_income + item);
        case "fixed":
          return $http.get(url_base_fixed_costs + item);
        case "variable":
          return $http.get(url_base_variable_costs + item);
        case "general":
          return $http.get(url_base_general_costs + item);
        default:
          return null;
      }
    }

    function updateBudgetItem(item_type, item) {
      switch (item_type) {
        case "income":
          return $http.put(url_base_income + item.id + "/", item);
        case "fixed":
          return $http.put(url_base_fixed_costs + item.id + "/", item);
        case "variable":
          return $http.put(url_base_variable_costs + item.id + "/", item);
        case "general":
          return $http.put(url_base_general_costs + item.id + "/", item);
        default:
          return null;
      }
    }


    function destroyBudgetItem(item_type, id) {
      switch (item_type) {
        case "income":
          return $http.delete(url_base_income + id + "/");
        case "fixed":
          return $http.delete(url_base_fixed_costs + id + "/");
        case "variable":
          return $http.delete(url_base_variable_costs + id + "/");
        case "general":
          return $http.delete(url_base_general_costs + id + "/");
        default:
          return null;
      }
    }


    function retrieveStatesList() {
      return $http.get(url_base_states_list);
    }


    // FIXME: Whole Farm Budget should not return crop categories
    function retrieveBudgetCostCategories(enterprise_type, descriptor1) {
      var cost_categories = [];

      if (enterprise_type == "Crop") {
          return $http.get(url_base_crop_cost_categories);
      }
      else if (enterprise_type == "Nursery") {
        return $http.get(url_base_nursery_cost_categories);
      }
      else if (enterprise_type == "Livestock") {
        return $http.get(url_base_livestock_cost_categories)
        .then(function(livestock_cost_categories_response) {
          if (livestock_cost_categories_response !== undefined && livestock_cost_categories_response.data !== undefined) {
            cost_categories = livestock_cost_categories_response.data.filter(function(categories) {
              return categories.descriptor1 == descriptor1;
            })[0]['categories'];


            return $q.when({'data': cost_categories});
          }
        });
      }
      else if (enterprise_type == "Whole Farm") {
        return $http.get(url_base_crop_cost_categories);
      }
    }


    // FIXME: Whole Farm Budget should not return crop data
    function retrieveBudgetCostData(enterprise_type) {
      switch (enterprise_type) {
        case "Crop":
          return $http.get(url_base_crop_cost_data);
        case "Nursery":
          return $http.get(url_base_nursery_cost_data);
        case "Livestock":
          return $http.get(url_base_livestock_cost_data);
        case "Whole Farm":
          return $http.get(url_base_crop_cost_data);
        default:
          return null;
      }
    }

  }

})();

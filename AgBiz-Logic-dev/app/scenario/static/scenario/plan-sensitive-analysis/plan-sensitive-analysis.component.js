(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planSensitiveAnalysis", {
      templateUrl: "/static/scenario/plan-sensitive-analysis/plan-sensitive-analysis.component.html",
      controller: PlanSensitiveAnalysisComponentController,
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    PlanSensitiveAnalysisComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      'budgetService',
      "$uibModal"
    ];

    function PlanSensitiveAnalysisComponentController(
      $state,
      $filter,
      commonService,
      scenarioService,
      budgetService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/

      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.calculation = calculation;
      $ctrl.proceed = proceed;
      $ctrl.back = back;

      // Plan
      $ctrl.plan;

      // variable
      $ctrl.incomeItems = [];
      $ctrl.costItems = [];
      $ctrl.incomeItems_dic;
      $ctrl.costItems_dic;
      $ctrl.total_cost = '0';
      $ctrl.total_income = '0';
      $ctrl.radio_option = 'price';

      // chart
      $ctrl.outcome_chart_data = [];
      $ctrl.income_chart_data = [];
      $ctrl.outcome_chart_labels = [];
      $ctrl.income_chart_labels = [];
      $ctrl.chart_colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                      		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                      		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                      		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                      		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                      		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                      		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                      		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                      		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                            '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
      $ctrl.chart_options = {
        elements: {
          center: {
            text: 'Desktop',
            color: '#36A2EB',
            fontStyle: 'Helvetica',
            sidePadding: 20 //Default 20 (as a percentage)
          }
        }
      };


      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        var plan_id = $state.params['plan'];
        $ctrl.module = $state.params['module'];

        if (plan_id === undefined || plan_id < 1) {
          $state.go("planManager");
        }
        else {
          scenarioService.retrievePlan(plan_id, ["id", "scenario", "title", "notes", "plan_budgets"])
          .then(function(plan_response) {
            if (plan_response === undefined ||
                plan_response.data === undefined ||
                plan_response.data.id === undefined ||
                plan_response.data.id < 1) {
              $state.go("scenarioManager", {'module':$ctrl.module});
            }
            else {
              $ctrl.plan = plan_response.data;
              listUniqueItems();
            }
          });
        }
      }


      function calculation(type, item, adjustValue) {

        if (adjustValue !== undefined) {
          if (type === 'income' && $ctrl.radio_option === 'price') {
            var result = $ctrl.incomeItems_dic[item].price_per_sale_unit * (1.00+adjustValue/100.00) * $ctrl.incomeItems_dic[item].quantity;
            $ctrl.incomeItems_dic[item].adjusted_value = parseFloat(result).toFixed(2);

            var index = $ctrl.income_chart_labels.indexOf(item);
            $ctrl.total_income = (parseFloat($ctrl.total_income) - $ctrl.income_chart_data[index] + parseFloat(result)).toFixed(2);
            $ctrl.income_chart_data[index] = parseFloat($ctrl.incomeItems_dic[item].adjusted_value);
          }
          else if (type === 'income' && $ctrl.radio_option === 'quantity') {
            $ctrl.incomeItems_dic[item].adjusted_quantity = (parseFloat($ctrl.incomeItems_dic[item].quantity) * (1.00+adjustValue/100.00)).toFixed(2);
            var result = parseFloat($ctrl.incomeItems_dic[item].adjusted_quantity) * parseFloat($ctrl.incomeItems_dic[item].price_per_sale_unit);
            $ctrl.incomeItems_dic[item].adjusted_value = result.toFixed(2);

            var index = $ctrl.income_chart_labels.indexOf(item);
            $ctrl.total_income = (parseFloat($ctrl.total_income) - $ctrl.income_chart_data[index] + parseFloat(result) ).toFixed(2);
            $ctrl.income_chart_data[index] = parseFloat($ctrl.incomeItems_dic[item].adjusted_value);
          }
          else {
            var result = $ctrl.costItems_dic[item].cost_total * (1.00+adjustValue/100.00);
            $ctrl.costItems_dic[item].adjusted_value = parseFloat(result).toFixed(2);

            var index = $ctrl.outcome_chart_labels.indexOf(item);
            $ctrl.total_cost = (parseFloat($ctrl.total_cost) - $ctrl.outcome_chart_data[index] + parseFloat($ctrl.costItems_dic[item].adjusted_value)).toFixed(2);
            $ctrl.outcome_chart_data[index] = parseFloat($ctrl.costItems_dic[item].adjusted_value);
          }

        }
      }

      function proceed() {
        angular.forEach($ctrl.plan.plan_budgets, function(budget){
          budgetService.retrieveBudget(budget.budget).then(function(result) {

            angular.forEach(result.data.income_items, function(income_item) {
              if ($ctrl.radio_option === 'price') {
                income_item.return_total = (parseFloat(income_item.return_total) * (1+$ctrl.incomeItems_dic[income_item.name].adjustPersentage/100.00)).toFixed(2);
              } else {
                income_item.sale_unit_quantity = (parseFloat(income_item.sale_unit_quantity) * (1+$ctrl.incomeItems_dic[income_item.name].adjustPersentage/100.00)).toFixed(2);
              }
              budgetService.updateBudgetItem("income",income_item);
            });

            angular.forEach(result.data.cost_items, function(item) {
              var item_name = item.name;
              if (item.cost_type !== 'general') {
                item_name = item.parent_category;
              }
              //console.log($ctrl.costItems_dic[item_name]);
              item.cost_total = parseFloat(item.cost_total) * (1+$ctrl.costItems_dic[item_name].adjustPersentage/100.00);

              budgetService.updateBudgetItem(item.cost_type, item);
            });
          });

        });

        openSummaryModal();
      }

      function back() {
        if($ctrl.module === undefined){
           $ctrl.module = 'profit';
         }
         $state.go("scenarioManager", {'module':$ctrl.module});
      }




      /****************************************************************
                           Private Helper Functions
      ****************************************************************/
      /*FIxed and Variable Cost Item can be used in paid version*/

      function listUniqueItems() {
        var incomeItem = {};
        var costItem = {};

        angular.forEach($ctrl.plan.plan_budgets, function(budget){
            budgetService.retrieveBudget(budget.budget).then(function(result) {

              angular.forEach(result.data.income_items, function(item) {

                $ctrl.total_income = (parseFloat($ctrl.total_income) + parseFloat(item.return_total)).toFixed(2);

                if (item !== undefined) {
                  if ( !(item.name in incomeItem) ) {
                    incomeItem[item.name] = {
                      budget_id: [budget.budget],
                      price_per_sale_unit: item.price_per_sale_unit,
                      adjusted_value: item.return_total,// "after"
                      adjustPersentage: 0,
                      quantity: item.sale_unit_quantity,
                      unit: item.sale_unit,
                      adjusted_quantity: item.sale_unit_quantity
                    };

                    $ctrl.incomeItems.push(item.name);
                    $ctrl.income_chart_labels.push(item.name);
                    $ctrl.income_chart_data.push(parseFloat(item.return_total));
                  } else {
                    incomeItem[item.name].budget_id.push(budget.budget);
                    incomeItem[item.name].adjusted_value =
                      (parseFloat(incomeItem[item.name].adjusted_value)+parseFloat(item.return_total)).toFixed(2);
                    incomeItem[item.name].quantity =
                      (parseFloat(incomeItem[item.name].quantity) + parseFloat(item.sale_unit_quantity)).toFixed(2);
                    incomeItem[item.name].adjusted_quantity = incomeItem[item.name].quantity;
                    incomeItem[item.name].price_per_sale_unit =
                      (parseFloat(incomeItem[item.name].adjusted_value)/parseFloat(incomeItem[item.name].quantity)).toFixed(2);

                    var i = $ctrl.income_chart_labels.indexOf(item.name);
                    $ctrl.income_chart_data[i] = parseFloat(incomeItem[item.name].adjusted_value);
                  }
                }
              });

              /*iterate general item first because it might be listed after its variable/cost item*/
              angular.forEach(result.data.cost_items, function(item) {

                $ctrl.total_cost = (parseFloat($ctrl.total_cost) + parseFloat(item.cost_total)).toFixed(2);

                if (item !== undefined && item.cost_type === 'general') {
                  if ( !(item.name in costItem) ) {
                    costItem[item.name] = {
                      budget_id: [budget.budget],
                      cost_total: item.cost_total,
                      adjusted_value: item.cost_total,
                      adjustPersentage: 0,
                      fixed: {},
                      variable: {}
                    };
                    $ctrl.costItems.push(item.name);

                    $ctrl.outcome_chart_labels.push(item.name);
                    $ctrl.outcome_chart_data.push( parseFloat(item.cost_total) );
                  } else {
                    costItem[item.name].budget_id.push(budget.budget);
                    costItem[item.name].cost_total =
                      parseFloat((parseFloat(costItem[item.name].cost_total)+parseFloat(item.cost_total)).toFixed(2));
                    costItem[item.name].adjusted_value = costItem[item.name].cost_total;

                    var i = $ctrl.outcome_chart_labels.indexOf(item.name);
                    $ctrl.outcome_chart_data[i] = parseFloat(costItem[item.name].cost_total);
                  }
                }

                else if (item !== undefined && item.cost_type === 'fixed') {

                  if ( !(item.parent_category in costItem) ) {
                    costItem[item.parent_category] = {
                      budget_id: [budget.budget],
                      cost_total: 0,
                      adjusted_value: 0,
                      adjustPersentage: 0,
                      fixed: {},
                      variable: {}
                    }
                  }

                  if ( !(item.name in costItem[item.parent_category][fixed]) ) {
                    costItem[item.parent_category].fixed[item.name] = {
                      budget_id: [budget.budget],
                      cost_total: item.cost_total
                    };
                  } else {
                    costItem[item.parent_category].fixed[item.name].budget_id.push(budget.budget);
                    costItem[item.parent_category].fixed[item.name].cost_total =
                      (parseFloat(costItem[item.parent_category].fixed[item.name].cost_total)+parseFloat(item.cost_total)).toFixed(2);
                  }
                  //Add to general
                  costItem[item.parent_category].cost_total = (parseFloat(costItem[item.parent_category].cost_total) + parseFloat(item.cost_total)).toFixed(2);
                  costItem[item.parent_category].adjusted_value = costItem[item.parent_category].cost_total;

                }

                else if (item !== undefined && item.cost_type === 'variable') {

                  if ( !(item.parent_category in costItem) ) {
                    costItem[item.parent_category] = {
                      budget_id: [budget.budget],
                      cost_total: '0.00',
                      adjusted_value: '0.00',
                      adjustPersentage: 0,
                      fixed: {},
                      variable: {}
                    }
                  }

                  if ( !(item.name in costItem[item.parent_category]['variable']) ) {
                    costItem[item.parent_category].variable[item.name] = {
                      budget_id: [budget.budget],
                      cost_total: item.cost_total
                    };
                  } else {
                    costItem[item.parent_category].variable[item.name].budget_id.push(budget.budget);
                    costItem[item.parent_category].variable[item.name].cost_total =
                     (parseFloat(costItem[item.parent_category].variable[item.name].cost_total)+parseFloat(item.cost_total)).toFixed(2);
                  }

                  //Add to general
                  costItem[item.parent_category].cost_total = (parseFloat(costItem[item.parent_category].cost_total) + parseFloat(item.cost_total)).toFixed(2);
                  costItem[item.parent_category].adjusted_value = costItem[item.parent_category].cost_total;
                }
              });
            });
        });

        $ctrl.incomeItems_dic = incomeItem;
        $ctrl.costItems_dic = costItem;

        //console.log($ctrl.incomeItems_dic);
        //console.log($ctrl.costItems_dic);

      }

      function openSummaryModal() {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: '/static/scenario/plan-sensitivity-summary/plan-sensitivity-summary.component.html',
          controller: 'PlanSensitivitySummaryComponentController',
          controllerAs: '$ctrl',
          resolve: {
            incomeItems_dic: function() {
              return $ctrl.incomeItems_dic;
            },
            costItems_dic: function() {
              return $ctrl.costItems_dic;
            },
            plan_title: function() {
              return $ctrl.plan.title;
            }
          },
        });
      }
  }

}());

(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("financeIncomeStatment", {
      templateUrl: "/static/scenario/finance-income-statment/finance-income-statment.component.html",
      controller: FinanceIncomeStatmentComponentController,
    });

    app.filter('InitCase', function() {
      return function(str) {
        return str.toLowerCase().split(' ').map(function(word) {
          return word != 'and' && word != 'from' && word != 'than' ? word.replace(word[0], word[0].toUpperCase()) : word;
        }).join(' ');
      }
    });

    /****************************************************************
                         Controller
    ****************************************************************/

    FinanceIncomeStatmentComponentController.$inject = [
      '$state',
      '$filter',
      'commonService',
      'scenarioService',
      "$uibModal"
    ];

    function FinanceIncomeStatmentComponentController(
      $state,
      $filter,
      commonService,
      scenarioService,
      $uibModal) {
      var $ctrl = this;

      /****************************************************************
                           Bindable Members
      ****************************************************************/


      // Methods
      $ctrl.$onInit = $onInit;
      $ctrl.proceed = proceed;
      $ctrl.back = back;
      $ctrl.calapse_by_class = calapse_by_class;
      $ctrl.round = round;


      // Scenario
      $ctrl.module;
      $ctrl.finance_scenario_list = [];
      $ctrl.financeAnalysis;
      $ctrl.plans;
      $ctrl.scenario;
      $ctrl.max_plan;
      $ctrl.years = [];
      $ctrl.totals = [];
      $ctrl.from_scenario;
      $ctrl.cashflowitem_expense=[];
      $ctrl.cashflowitem_income=[];
      $ctrl.cashflowitem_expense_total=[];
      $ctrl.cashflowitem_income_total=[];
      $ctrl.revenue=[];
      $ctrl.gross_farm_revene=[];
      $ctrl.total_operating_expense=[];
      $ctrl.net_farm_income_from_operations=[];
      $ctrl.depreciation=[];
      $ctrl.steps_2=['Cash Flow Review','Balance Sheet Review', 'Income Statement Review','Financial Ratios Review']


      //balance_sheet_var
      $ctrl.balance_data;
      $ctrl.cash=[];
      $ctrl.supplies=[];
      $ctrl.short_asset=[];
      $ctrl.long_asset=[];
      $ctrl.account_receivable=[];
      $ctrl.accounts_payable=[];
      $ctrl.breeding_livestock=[];
      $ctrl.contracts_and_notes_receivable=[];
      $ctrl.deferred_taxes=[];
      $ctrl.employee_payroll_withholding=[];
      $ctrl.income_taxes=[];
      $ctrl.investment=[];
      $ctrl.investment_in_capital_leases=[];
      $ctrl.marketable_livestock=[];
      $ctrl.other_accured_expenses=[];
      $ctrl.other_assets=[];
      $ctrl.other_current_liabilites=[];
      $ctrl.other_noncurrent_assets=[];
      $ctrl.prepaid_expenses=[];
      $ctrl.purchased_feed=[];
      $ctrl.real_estate_land=[];
      $ctrl.stored_crops_and_feed=[];
      $ctrl.supplies=[];
      $ctrl.vehicles=[];
      $ctrl.cash_interest_paid=[]
      $ctrl.pdf_data={};

      $ctrl.balance_sum=[0,0,0,0,0,0,0,0,0,0,0];


      // Variables





      /****************************************************************
                           Methods
      ****************************************************************/

      function $onInit() {
        setupDatabases();
        var scenario_id = $state.params['scenario'];
        $ctrl.scenario=$state.params['scenario'];
        $ctrl.module = $state.params['module'];

        scenarioService.retrieveCashFlowItem(scenario_id)
          .then(function(cash_flow_reponse) {
            console.log(cash_flow_reponse.data)
            var output_expense = cash_flow_reponse.data.filter(function(obj) {
              return obj.type == "expense";
            })
            $ctrl.cashflowitem_expense = trans_year_to_item(output_expense)
            $ctrl.cashflowitem_expense=$ctrl.cashflowitem_expense.filter(function(el) { if (el.name!= "L-T asset replacement & section 179 expenses" && el.name!="Interest on Loans and Mortgages" && el.name!="Pension and Profit-sharing Plans" && el.name!="Employee Benefit Programs" && el.name!="Rent and Leases: Land and Animals")return el});
            console.log($ctrl.cashflowitem_expense)
            $ctrl.cashflowitem_expense_total=get_total($ctrl.cashflowitem_expense)

            var output_income = cash_flow_reponse.data.filter(function(obj) {
                return obj.type == "income";
              })
            $ctrl.cashflowitem_income = trans_year_to_item(output_income)
            $ctrl.cashflowitem_income_total=get_total($ctrl.cashflowitem_income)
            console.log($ctrl.cashflowitem_income_total)
            console.log($ctrl.revenue)
            for(var i = 0;i<=$ctrl.cashflowitem_expense_total.length-1;i++){
              $ctrl.revenue.push($ctrl.cashflowitem_income_total[i] - $ctrl.cashflowitem_expense_total[i]);
            }
            console.log($ctrl.revenue)
          })


          //balance_sheet
          commonService.retrieveCurrentUser()
          .then(function(user_response) {
            if(user_response !== undefined){
              $ctrl.user = user_response.data;
            }
            console.log($ctrl.user.username)
            scenarioService.retrieveBalanceSheet('?username=', $ctrl.user.username)
            .then(function(balancesheet_response) {
              console.log(balancesheet_response.data)


            });
            scenarioService.retrieveBalanceSheet('?username=', $ctrl.user.username)
            .then(function(balancesheet_response) {
            console.log(balancesheet_response.data)
            $ctrl.first_year = balancesheet_response.data[0];

            scenarioService.retrieveAccrualAdjustment('?scenario=',scenario_id).then(function(response){
              console.log(response)
              $ctrl.balance_data = response.data;
              //$ctrl.balance_data.push($ctrl.first_year)
              $ctrl.balance_data.sort(function (a, b) {
                return a.year - b.year
              });
              console.log("Balance Data:", $ctrl.balance_data)


              scenarioService.retrieveDepreciation(scenario_id)
              .then(function(depreciation_response){
                var data=depreciation_response.data
                data.sort(function (a, b) {
                    return a.year - b.year
                  });
                console.log($ctrl.depreciation)
                angular.forEach(data, function(items,index) {
                  $ctrl.depreciation.push(Number(items.depreciation))
                })
              console.log($ctrl.depreciation);
              console.log($ctrl.total_operating_expense);
              console.log("Balance Data:", $ctrl.balance_data);
              for (var i=0; i<10; i++){
                $ctrl.total_operating_expense.push(Number($ctrl.cashflowitem_expense_total[i])
                +Number($ctrl.balance_data[i].purchased_feed)
                +Number($ctrl.balance_data[i].accounts_payable)
                +Number($ctrl.balance_data[i].employee_payroll_withholding)
                +Number($ctrl.balance_data[i].other_accured_expenses)
                +Number($ctrl.balance_data[i].other_current_liabilites)
                +Number($ctrl.depreciation[i])
              )
            }
            console.log($ctrl.total_operating_expense)

              for (var i=0; i<10; i++){
                $ctrl.gross_farm_revene.push($ctrl.cashflowitem_income_total[i]
                +Number($ctrl.balance_data[i].account_receivable)
                +Number($ctrl.balance_data[i].prepaid_expenses)
                +Number($ctrl.balance_data[i].investment)
                +Number($ctrl.balance_data[i].supplies)
                +Number($ctrl.balance_data[i].other_assets)
              )
              console.log($ctrl.gross_farm_revene);
              }
              console.log("Balance Data:", $ctrl.balance_data);


              $ctrl.net_farm_income_from_operations=$ctrl.gross_farm_revene-$ctrl.total_operating_expense;

              $ctrl.net_farm_income_from_operations=$ctrl.gross_farm_revene.map(function(item, index) {
                  // In this case item correspond to currentValue of array a,
                  // using index to get value from array b
                  console.log(item)
                  console.log($ctrl.total_operating_expense[index])
                  return item - $ctrl.total_operating_expense[index];
                });
                createIncomeStatements($ctrl.net_farm_income_from_operations, $ctrl.gross_farm_revene, $ctrl.total_operating_expense);
                cal_cash_interest_paid()

              });


            })

          });




          });



      }

      function cal_cash_interest_paid(){
        scenarioService.retrieveBalanceSheetOutput($ctrl.scenario)
          .then(function(response) {
            console.log(response.data)
            if(response.data.length==0){
              $ctrl.check=false
            }
            scenarioService.retrieveBalanceSheetItemOutput(response.data[0].id)
            .then(function(response){
              console.log(response.data)
              var result=generatePdf_balance_sheet(response.data)
              $ctrl.cash_interest_paid=result.accrued_interest.slice(1)
              console.log($ctrl.cash_interest_paid)
              make_pdf_data()
            })
          })

      }


      function make_pdf_data(){
        $ctrl.pdf_data.scenario_id=$ctrl.scenario
        $ctrl.pdf_data.cashflowitem_income=  $ctrl.cashflowitem_income
        $ctrl.pdf_data.cashflowitem_income_total=$ctrl.cashflowitem_income_total
        $ctrl.pdf_data.balance_data=$ctrl.balance_data
        $ctrl.pdf_data.gross_farm_revene=$ctrl.gross_farm_revene
        $ctrl.pdf_data.cashflowitem_expense=$ctrl.cashflowitem_expense
        $ctrl.pdf_data.cashflowitem_expense_total=$ctrl.cashflowitem_expense_total
        $ctrl.pdf_data.depreciation= $ctrl.depreciation
        $ctrl.pdf_data.total_operating_expense= $ctrl.total_operating_expense
        $ctrl.pdf_data. total_operating_expense=$ctrl.total_operating_expense
        $ctrl.pdf_data.net_farm_income_from_operations=$ctrl.net_farm_income_from_operations
        $ctrl.pdf_data.cash_interest_paid=$ctrl.cash_interest_paid
        console.log($ctrl.balance_data)
        console.log($ctrl.pdf_data)

      }



      function calculate_short_long_asset (scenario_id,first_year,acc){
        scenarioService.retrieveDepreciation(scenario_id)
        .then(function(depreciation_response){
            //set existing data to the depreciation_list
            var depreciation_list = depreciation_response.data;
            depreciation_list.sort(function (a, b) {
              return a.year - b.year
            });
            acc.sort(function (a, b) {
              return a.year - b.year
            });
            console.log(first_year)
            $ctrl.short_asset[0]=parseFloat(first_year.machinery_equipment);
            $ctrl.long_asset[0]=parseFloat(first_year.buildings_and_improvements);
            console.log(acc)
            for (var i=0;i<10;i++){

              $ctrl.short_asset[i+1]=parseFloat(parseFloat(depreciation_list[i].depreciation)*(parseFloat(depreciation_list[i].depreciation_allocated_to_intermediate_assets)/100))
            }
            for (var i=0;i<10;i++){
              $ctrl.long_asset[i+1]=parseFloat(parseFloat(depreciation_list[i].depreciation)*(1-(parseFloat(depreciation_list[i].depreciation_allocated_to_intermediate_assets)/100)))
            }

            var asset=[];
            for (var i=1;i<11;i++){
               $ctrl.short_asset[i]=parseFloat($ctrl.short_asset[i-1])-parseFloat($ctrl.short_asset[i])
               $ctrl.long_asset[i]=parseFloat($ctrl.long_asset[i-1])-parseFloat($ctrl.long_asset[i])
            }

        });

      }

      function retrieve_net_return_for_year (scenario){
        var net_return=[0,0,0,0,0,0,0,0,0,0,0];
        var net_returns_with_inflation=[0,0,0,0,0,0,0,0,0,0,0];
        scenarioService.listPlansByScenario(scenario.id)
        .then(function (plan_response){
          console.log(net_returns_with_inflation)
          console.log(plan_response.data)
          for(let year=0;year<11;year++){
            console.log(plan_response.data.length)
            for (let i=0;i<plan_response.data.length;i++){
              net_return=sumObjectsByKey(net_return,plan_response.data[i].net_returns_over_time[year])
              console.log(year)
            }
            console.log(year)
            net_returns_with_inflation[year]=(net_return.return_with_inflation)
          }
          console.log(net_returns_with_inflation)

          });
          return net_returns_with_inflation
      }

      function createIncomeStatements(net_farm_income_from_operations, gross_farm, costs){
        //check if there are any income statments already for this scenario if there are, then delete them

        var scenario_id = $state.params['scenario'];
        var filteredIncomeStatementsList;
        scenarioService.retrieveIncomeStatement(scenario_id)
        .then(function(incomestatement_response){
          //console.log(net_farm_income_from_operations);

          if(incomestatement_response.data.length === 0){
            for(var i = 0; i < 10; i++){
              var NewIncomeStatement = {
                "scenario": scenario_id ,
                "year": i+1,
                "farm_ranch_gross_income": gross_farm[i],
                "farm_ranch_costs": costs[i],
                "annual_net_income": net_farm_income_from_operations[i],
                "accumulated_net_income": 0,
              };
              scenarioService.createIncomeStatement(NewIncomeStatement)
              .then(function(new_income_statment_response) {
                if (new_income_statment_response !== undefined &&
                    new_income_statment_response.data !== undefined &&
                    new_income_statment_response.data.id !== undefined) {
                      //console.log('IncomeStatement '+ i + 'created');
                }
              } );
            }
          }

        });
        //Create a for loop that runs the max plans length number of times and each time does one of the total years from the aclready calculated years array.
        //Years[i].year[Years[i].year.length-1]


      }

      function retrieveFinanceAnalysisAndSenario(id){
        scenarioService.retrieveFinanceAnalysis(id)
        .then(function(financeAnalysis_response) {
          if (financeAnalysis_response !== undefined &&
              financeAnalysis_response.data !== undefined) {
            $ctrl.financeAnalysis = financeAnalysis_response.data;
            $ctrl.finance_scenario_list =   $ctrl.financeAnalysis.scenarios;
            // console.log($ctrl.financeAnalysis);
            // console.log($ctrl.finance_scenario_list);
          }
        });
      }
      function get_total(cashflow){
        console.log(cashflow)
        var sum =[0,0,0,0,0,0,0,0,0,0]
        angular.forEach(cashflow, function(items,index) {
          console.log(items.year_1)
          sum[0]=sum[0]+Number(items.year_1)
          sum[1]=sum[1]+Number(items.year_2)
          sum[2]=sum[2]+Number(items.year_3)
          sum[3]=sum[3]+Number(items.year_4)
          sum[4]=sum[4]+Number(items.year_5)
          sum[5]=sum[5]+Number(items.year_6)
          sum[6]=sum[6]+Number(items.year_7)
          sum[7]=sum[7]+Number(items.year_8)
          sum[8]=sum[8]+Number(items.year_9)
          sum[9]=sum[9]+Number(items.year_10)
        })
        console.log(sum)
        return sum;
      }

      function get_total_balance(){
        console.log($ctrl.cash)
        for (var i=0; i<11; i++){
          console.log($ctrl.cash)
            $ctrl.balance_sum[i]=
            $ctrl.cash[i]+
            $ctrl.supplies[i]+
            $ctrl.account_receivable[i]+
            $ctrl.accounts_payable[i]+
            $ctrl.breeding_livestock[i]+
            $ctrl.contracts_and_notes_receivable[i]+
            $ctrl.deferred_taxes[i]+
            $ctrl.income_taxes[i]+
            $ctrl.investment[i]+
            $ctrl.investment_in_capital_leases[i]+
            $ctrl.marketable_livestock[i]+
            $ctrl.other_accured_expenses[i]+
            $ctrl.other_assets[i]+
            $ctrl.other_current_liabilites[i]+
            $ctrl.other_noncurrent_assets[i]+
            $ctrl.purchased_feed[i]+
            $ctrl.real_estate_land[i]+
            $ctrl.stored_crops_and_feed[i]+
            $ctrl.prepaid_expenses[i]+
            $ctrl.employee_payroll_withholding[i]
            console.log($ctrl.employee_payroll_withholding)
        }
        console.log($ctrl.balance_sum)
      }

      function trans_year_to_item(cashflow) {
        var tl = {
          name: "",
          year_1: 0,
          year_2: 0,
          year_3: 0,
          year_4: 0,
          year_5: 0,
          year_6: 0,
          year_7: 0,
          year_8: 0,
          year_9: 0,
          year_10: 0
        }
        var cashflow_by_item = [];
        var name = [];
        angular.forEach(cashflow, function(cashflow) {
          name.push(cashflow.name)
        })
        var unique_name = name.filter(onlyUnique);
        angular.forEach(unique_name, function(unique_name) {
          var tl = {
            name: unique_name,
            year_1: 0,
            year_2: 0,
            year_3: 0,
            year_4: 0,
            year_5: 0,
            year_6: 0,
            year_7: 0,
            year_8: 0,
            year_9: 0,
            year_10: 0
          }
          cashflow_by_item.push(tl);
        })
        angular.forEach(cashflow_by_item, function(cashflow_by_item) {
          for (var i = 0; i < cashflow.length; i++) {
            if (cashflow[i].name == cashflow_by_item.name) {
              switch (cashflow[i].year) {
                case "1.00":
                  cashflow_by_item.year_1 = cashflow[i].total;
                case "2.00":
                  cashflow_by_item.year_2 = cashflow[i].total;
                case "3.00":
                  cashflow_by_item.year_3 = cashflow[i].total;
                case "4.00":
                  cashflow_by_item.year_4 = cashflow[i].total;
                case "5.00":
                  cashflow_by_item.year_5 = cashflow[i].total;
                case "6.00":
                  cashflow_by_item.year_6 = cashflow[i].total;
                case "7.00":
                  cashflow_by_item.year_7 = cashflow[i].total;
                case "8.00":
                  cashflow_by_item.year_8 = cashflow[i].total;
                case "9.00":
                  cashflow_by_item.year_9 = cashflow[i].total;
                case "10.00":
                  cashflow_by_item.year_10 = cashflow[i].total;


              }
            }
          }
        })
        return (cashflow_by_item)
      }
      function setupDatabases(){
        $(document).ready(function() {
          $('#example').DataTable( {
              "scrollY": 200,
              "scrollX": true
          } );
        } );
      }

      function proceed() {
        scenarioService.retrieveIncomeStatementOutput($ctrl.scenario)
          .then(function(income_statement_response) {
            console.log(income_statement_response.data)
            if(income_statement_response.data.length==0){
              console.log(income_statement_response.data.length)
              scenarioService.createIncomeStatementOutput({"scenario":$ctrl.scenario})
                .then(function(response) {
                  create_income_statement_output_item(response.data.id)
                })
            }
            else{
              scenarioService.retrieveIncomeStatementOutput($ctrl.scenario)
                .then(function(response) {
                  console.log(response.data)
                  scenarioService.destroyIncomeStatementOutput(response.data[0].id)
                    .then(function(response) {
                    scenarioService.createIncomeStatementOutput({"scenario":$ctrl.scenario})
                      .then(function(response) {
                        create_income_statement_output_item(response.data.id)
                      })
                })
                })
            }
          })
        update_database();
        $state.go("financeRatios", {
          'scenario': $state.params['scenario'],
          'module':$ctrl.module,
          'from_scenario':$ctrl.from_scenario
        });
      }

      function create_income_statement_output_item(id){
          angular.forEach($ctrl.cashflowitem_income, function(row, key) {
            Object.keys(row).forEach(function (key, index) {
                if(index!==0){
                  scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":index, "item_name":row.name, "item_number": row[key],"type":"income"})
                }
              });
          })

          angular.forEach($ctrl.cashflowitem_expense, function(row, key) {
            Object.keys(row).forEach(function (key, index) {
                if(index!==0){
                  scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":index, "item_name":row.name, "item_number": row[key],"type":"expense"})
                }
              });
          })

          angular.forEach($ctrl.cashflowitem_income_total, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"cashflowitem_income_total", "item_number": value})
          })

          angular.forEach($ctrl.gross_farm_revene, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"gross_farm_revene", "item_number": value})
          })

          angular.forEach($ctrl.cashflowitem_expense_total, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"cashflowitem_expense_total", "item_number": value})
          })

          angular.forEach($ctrl.depreciation, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"depreciation", "item_number": value})
          })

          angular.forEach($ctrl.total_operating_expense, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"total_operating_expense", "item_number": value})
          })
          //  Total Operating Expense and Cash Interest Paid need to work in future

          // There are Total Farm Expense and Total Operating Expense share same variable, so only push one to database
          // angular.forEach($ctrl.total_operating_expense, function(value, key) {
          //     scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"total_operating_expense", "item_number": value})
          // })

          angular.forEach($ctrl.net_farm_income_from_operations, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"net_farm_income_from_operations", "item_number": value})
          })

          angular.forEach($ctrl.cash_interest_paid, function(value, key) {
              scenarioService.createIncomeStatementItemOutput({"income_statement":id, "year":key, "item_name":"cash_interest_paid", "item_number": value})
          })


      }



      function back() {
        $state.go("financeBalanceSheetYear", {
          'scenario': $state.params['scenario'],
          'module': $ctrl.module
        });
      }


      function update_database (){

      }

      function round(number){
        return number
      }
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      /****************************************************************
                           Private Helper Functions
      ****************************************************************/

      function generatePdf_balance_sheet(income_statement){
        var result={}
        result.cash=[]
        var cash=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash"});
        cash.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(cash, function(value, key) {
          result.cash.push(Number(value.item_number))
        });

        result.account_receivable=[]
        var account_receivable=income_statement.filter(function (income_statement) {return income_statement.item_name =="account_receivable"});
        account_receivable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(account_receivable, function(value, key) {
          result.account_receivable.push(Number(value.item_number))
        });

        result.prepaid_expenses=[]
        var prepaid_expenses=income_statement.filter(function (income_statement) {return income_statement.item_name =="prepaid_expenses"});
        prepaid_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(prepaid_expenses, function(value, key) {
          result.prepaid_expenses.push(Number(value.item_number))
        });

        result.investment=[]
        var investment=income_statement.filter(function (income_statement) {return income_statement.item_name =="investment"});
        investment.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(investment, function(value, key) {
          result.investment.push(Number(value.item_number))
        });

        result.marketable_livestock=[]
        var marketable_livestock=income_statement.filter(function (income_statement) {return income_statement.item_name =="marketable_livestock"});
        marketable_livestock.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(marketable_livestock, function(value, key) {
          result.marketable_livestock.push(Number(value.item_number))
        });

        result.stored_crops_and_feed=[]
        var stored_crops_and_feed=income_statement.filter(function (income_statement) {return income_statement.item_name =="stored_crops_and_feed"});
        stored_crops_and_feed.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(stored_crops_and_feed, function(value, key) {
          result.stored_crops_and_feed.push(Number(value.item_number))
        });

        result.purchased_feed=[]
        var purchased_feed=income_statement.filter(function (income_statement) {return income_statement.item_name =="purchased_feed"});
        purchased_feed.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(purchased_feed, function(value, key) {
          result.purchased_feed.push(Number(value.item_number))
        });

        result.supplies=[]
        var supplies=income_statement.filter(function (income_statement) {return income_statement.item_name =="supplies"});
        supplies.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(supplies, function(value, key) {
          result.supplies.push(Number(value.item_number))
        });

        result.short_asset=[]
        var short_asset=income_statement.filter(function (income_statement) {return income_statement.item_name =="short_asset"});
        short_asset.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(short_asset, function(value, key) {
          result.short_asset.push(Number(value.item_number))
        });

        result.contracts_and_notes_receivable=[]
        var contracts_and_notes_receivable=income_statement.filter(function (income_statement) {return income_statement.item_name =="contracts_and_notes_receivable"});
        contracts_and_notes_receivable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(contracts_and_notes_receivable, function(value, key) {
          result.contracts_and_notes_receivable.push(Number(value.item_number))
        });

        result.other_assets=[]
        var other_assets=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_assets"});
        other_assets.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_assets, function(value, key) {
          result.other_assets.push(Number(value.item_number))
        });

        result.investing_in_cooperatives=[]
        var investing_in_cooperatives=income_statement.filter(function (income_statement) {return income_statement.item_name =="investing_in_cooperatives"});
        investing_in_cooperatives.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(investing_in_cooperatives, function(value, key) {
          result.investing_in_cooperatives.push(Number(value.item_number))
        });

        result.real_estate_land=[]
        var real_estate_land=income_statement.filter(function (income_statement) {return income_statement.item_name =="real_estate_land"});
        real_estate_land.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_estate_land, function(value, key) {
          result.real_estate_land.push(Number(value.item_number))
        });

        result.long_asset=[]
        var long_asset=income_statement.filter(function (income_statement) {return income_statement.item_name =="long_asset"});
        long_asset.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(long_asset, function(value, key) {
          result.long_asset.push(Number(value.item_number))
        });

        result.total_assets=[]
        var total_assets=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_assets"});
        total_assets.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_assets, function(value, key) {
          result.total_assets.push(Number(value.item_number))
        });

        result.accounts_payable=[]
        var accounts_payable=income_statement.filter(function (income_statement) {return income_statement.item_name =="accounts_payable"});
        accounts_payable.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(accounts_payable, function(value, key) {
          result.accounts_payable.push(Number(value.item_number))
        });

        result.operating_loans=[]
        var operating_loans=income_statement.filter(function (income_statement) {return income_statement.item_name =="operating_loans"});
        operating_loans.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(operating_loans, function(value, key) {
          result.operating_loans.push(Number(value.item_number))
        });

        result.accrued_interest=[]
        var accrued_interest=income_statement.filter(function (income_statement) {return income_statement.item_name =="accrued_interest"});
        accrued_interest.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(accrued_interest, function(value, key) {
          result.accrued_interest.push(Number(value.item_number))
        });

        result.ad_valorem_taxes=[]
        var ad_valorem_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="ad_valorem_taxes"});
        ad_valorem_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(ad_valorem_taxes, function(value, key) {
          result.ad_valorem_taxes.push(Number(value.item_number))
        });

        result.employee_payroll_withholding=[]
        var employee_payroll_withholding=income_statement.filter(function (income_statement) {return income_statement.item_name =="cash"});
        employee_payroll_withholding.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(employee_payroll_withholding, function(value, key) {
          result.employee_payroll_withholding.push(Number(value.item_number))
        });

        result.income_taxes=[]
        var income_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="income_taxes"});
        income_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(income_taxes, function(value, key) {
          result.income_taxes.push(Number(value.item_number))
        });

        result.deferred_taxes=[]
        var deferred_taxes=income_statement.filter(function (income_statement) {return income_statement.item_name =="deferred_taxes"});
        deferred_taxes.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(deferred_taxes, function(value, key) {
          result.deferred_taxes.push(Number(value.item_number))
        });

        result.other_accured_expenses=[]
        var other_accured_expenses=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_accured_expenses"});
        other_accured_expenses.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_accured_expenses, function(value, key) {
          result.other_accured_expenses.push(Number(value.item_number))
        });

        result.capital_leases_current=[]
        var capital_leases_current=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_leases_current"});
        capital_leases_current.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_leases_current, function(value, key) {
          result.capital_leases_current.push(Number(value.item_number))
        });

        result.other_current_liabilites=[]
        var other_current_liabilites=income_statement.filter(function (income_statement) {return income_statement.item_name =="other_current_liabilites"});
        other_current_liabilites.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(other_current_liabilites, function(value, key) {
          result.other_current_liabilites.push(Number(value.item_number))
        });

        result.capital_leases_non_current=[]
        var capital_leases_non_current=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_leases_non_current"});
        capital_leases_non_current.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_leases_non_current, function(value, key) {
          result.capital_leases_non_current.push(Number(value.item_number))
        });

        result.real_borrowing_table=[]
        var real_borrowing_table=income_statement.filter(function (income_statement) {return income_statement.item_name =="real_borrowing_table"});
        real_borrowing_table.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(real_borrowing_table, function(value, key) {
          result.real_borrowing_table.push(Number(value.item_number))
        });

        result.capital_purchase=[]
        var capital_purchase=income_statement.filter(function (income_statement) {return income_statement.item_name =="capital_purchase"});
        capital_purchase.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(capital_purchase, function(value, key) {
          result.capital_purchase.push(Number(value.item_number))
        });

        result.total_liabilities=[]
        var total_liabilities=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_liabilities"});
        total_liabilities.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_liabilities, function(value, key) {
          result.total_liabilities.push(Number(value.item_number))
        });

        result.total_equity=[]
        var total_equity=income_statement.filter(function (income_statement) {return income_statement.item_name =="total_equity"});
        total_equity.sort(function(a,b) {return a.year - b.year;});
        angular.forEach(total_equity, function(value, key) {
          result.total_equity.push(Number(value.item_number))
        });

        result.scenario_id= $ctrl.scenario.id

        // result.cash=[]
        // var cash=income_statement.filter(income_statement => income_statement.item_name =="cash");
        // cash.sort(function(a,b) {return a.year - b.year;});
        // angular.forEach(cash, function(value, key) {
        //   result.cash.push(Number(value.item_number))
        // });
        //
        // result.cash=[]
        // var cash=income_statement.filter(income_statement => income_statement.item_name =="cash");
        // cash.sort(function(a,b) {return a.year - b.year;});
        // angular.forEach(cash, function(value, key) {
        //   result.cash.push(Number(value.item_number))
        // });



        console.log(result)
        return result
      }

      function max_plan_array(){
        var max_length = 0;
        var x;
        angular.forEach($ctrl.plans, function(plan) {
          if(plan.net_returns_over_time.length > max_length){
              max_length = plan.net_returns_over_time.length;
          }
        });
        return max_length;
      }

      function calapse_by_class(findclass) {
        var element = document.getElementsByClassName(findclass);
        // console.log(element);
        for(var i = 0; i < element.length; i++) {
          element[i].classList.toggle("collapse");
        }
      }
      function sumObjectsByKey(...objs) {
        return objs.reduce((a, b) => {
          for (let k in b) {
            if (b.hasOwnProperty(k))
              a[k] = (a[k] || 0) + b[k];
          }
          return a;
        }, {});
      }



    }
}());

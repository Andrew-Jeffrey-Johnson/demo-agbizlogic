(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("financeRatiosPdf", {
      templateUrl: "/static/common/finance-ratios-pdf/finance-ratios-pdf.component.html",
      controller: financeRatiosPdfController,
      bindings: {
        'statements': "<",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  financeRatiosPdfController.$inject = [
    "budgetService",
    "scenarioService"
  ];

  function financeRatiosPdfController(
      budgetService,
      scenarioService
    ) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.printBudget = printBudget;
    $ctrl.generatePdf = generatePdf;

    // Inputs
    $ctrl.statements;
    $ctrl.error=null;
    //
    $ctrl.created_date

    /****************************************************************
                         Methods
    ****************************************************************/

    function printBudget() {
      console.log($ctrl.statements);
      scenarioService.retrieveScenario($ctrl.statements.scenario_id)
      .then(function(scenarioResponse){
        $ctrl.created_date=scenarioResponse.data.created_date
        generatePdf(scenarioResponse.data);

      })
      // $ctrl.budget = budgetService.retrieveBudget($ctrl.budget.id)
      // .then(function (budgetResponse) {
      //   console.log("After getting budget:",budgetResponse);
      //   $ctrl.budget = budgetResponse.data;
      //   if(angular.isArray($ctrl.budget)) {
      //     angular.forEach($ctrl.budget, function(budget){
      //       generatePdf(budget);
      //     });
      //   }
      //   else {
      //     generatePdf($ctrl.budget);
      //   }
      // });
    }

    function generatePdf(budget) {
      // var t = budget.created_date.split("T");
      // var date = t[0].split('-');
      var current_date = new Date().getFullYear()
      var income_name="";
      var income_sale="";
      var income_sale_livestock="";
      var income_weight="";
      var income_price="";
      var income_total="";
      //var sort_IncomeItem = budget.income_items.sort(compare);
    //   var sort_IncomeItem = budget.income_items;
    //   sort_IncomeItem.sort(function(a, b){
    //     var x = a.name.toLowerCase();
    //     var y = b.name.toLowerCase();
    //     if (x < y) {return -1;}
    //     if (x > y) {return 1;}
    //     return 0;
    // });
      // for(var i=0; i< budget.income_items.length ;i++){
      //   if(sort_IncomeItem[i].name.length > 25){
      //     income_name = income_name + "\n" + sort_IncomeItem[i].name.substring(0,25) + '...';
      //   }else {
      //     income_name = income_name + "\n" + sort_IncomeItem[i].name;
      //   }
      //   income_weight = income_weight + "\n" + sort_IncomeItem[i].weight + " " + sort_IncomeItem[i].sale_unit;
      //   income_sale_livestock = income_sale_livestock + "\n" + sort_IncomeItem[i].sale_unit_quantity;
      //   income_sale = income_sale + "\n" + sort_IncomeItem[i].sale_unit_quantity + " " + sort_IncomeItem[i].sale_unit;
      //   income_price = income_price + "\n" + formatCurrency(sort_IncomeItem[i].price_per_sale_unit);
      //   income_total = income_total + "\n" +  formatCurrency(sort_IncomeItem[i].return_total);
      // }

      var general_name="";
      var general_sold="";
      var general_price="";
      var general_total="";
      // var sort_CostItem = budget.cost_items.sort(compare);
      // for (var j=0; j<budget.cost_items.length; j++){
      //   if(budget.cost_items[j].cost_type == 'general'){
      //     if(sort_CostItem[j].name.length > 25){
      //       general_name = general_name + "\n" + sort_CostItem[j].name.substring(0,26) + '...';
      //     }else {
      //       general_name = general_name + "\n" + sort_CostItem[j].name;
      //     }
      //     general_sold = general_sold + "\n" + sort_CostItem[j].farm_unit_quantity + " " + sort_CostItem[j].farm_unit;
      //     general_price = general_price + "\n" +  formatCurrency(sort_CostItem[j].cost_per_unit);
      //     general_total = general_total + "\n" +  formatCurrency(sort_CostItem[j].cost_total);
      //   }
      // }

      var fixed_name ="";
      var fixed_sold ="";
      var fixed_price="";
      var fixed_total="";
      // for (var k=0; k<budget.cost_items.length; k++){
      //   if (budget.cost_items[k].cost_type == 'fixed'){
      //     if(sort_CostItem[k].name.length > 25){
      //       fixed_name = fixed_name + "\n" + sort_CostItem[k].name.substring(0,26) + '...';
      //     }else {
      //       fixed_name = fixed_name + "\n" + sort_CostItem[k].name;
      //     }
      //     fixed_sold = fixed_sold + "\n" + sort_CostItem[k].unit_quantity + " " + sort_CostItem[k].unit;
      //     fixed_price = fixed_price + "\n" + formatCurrency(sort_CostItem[k].cost_per_unit);
      //     fixed_total = fixed_total + "\n" + formatCurrency(sort_CostItem[k].cost_total);
      //   }
      //  }

      var variable_name ="";
      var variable_sold ="";
      var variable_price="";
      var variable_total="";

      var undefined_total_gross_returns=0
      var undefined_total_costs=0
      var undefined_total_net_returns=0

      // for (var e=0; e<budget.cost_items.length; e++){
      //   if (budget.cost_items[e].cost_type == 'variable'){
      //     if(sort_CostItem[e].name.length > 25){
      //       variable_name = variable_name + "\n" + sort_CostItem[e].name.substring(0,26) + '...';
      //     }else {
      //       variable_name = variable_name + "\n" + sort_CostItem[e].name;
      //     }
      //     variable_sold = variable_sold + "\n" + sort_CostItem[e].unit_quantity + " " + sort_CostItem[e].unit;
      //     variable_price = variable_price + "\n" + formatCurrency(sort_CostItem[e].cost_per_unit);
      //     variable_total = variable_total + "\n" + formatCurrency(sort_CostItem[e].cost_total);
      //   }
      // }


    //   if (budget.total_gross_returns == undefined){
    //     angular.forEach(budget.income_items, function(value){
    //         undefined_total_gross_returns = parseFloat(undefined_total_gross_returns) + parseFloat(value.return_total)
    //
    //       });
    //       budget.total_gross_returns=undefined_total_gross_returns
    //     }
    //
    //     if (budget.total_costs == undefined){
    //       angular.forEach(budget.cost_items, function(value){
    //           undefined_total_costs = parseFloat(undefined_total_costs) + parseFloat(value.cost_total)
    //         });
    //         budget.total_costs=undefined_total_costs
    //   }
    //
    //   if (budget.profit == undefined){
    //     budget.profit = parseFloat(budget.total_gross_returns) -parseFloat(budget.total_costs);
    // }

      var t = $ctrl.created_date.split("T");
      var date = t[0].split('-');
      var current_date = new Date().getFullYear()
      var doc_definition = {
          pageSize: 'A4',
          footer:function(page, pages) {
             return {
               columns: [

                 {
                   alignment:'left',
                   text: [
                     {text:"Copyright © " + current_date + " AgBiz Logic. All Rights Reserved. ", italics:true },

                   ]
                 },
                 {
                   alignment:'right',
                   text: [
                     {text: date[1]+"/"+date[2]+"/"+date[0] + "\t" + " " + " " + " " + " " + " " + " " + " " + " "
                   + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
                 + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
                },
                     { text: page.toString(), italics: true },
                     ' of ',
                     { text: pages.toString(), italics: true }

                   ]

                 }

               ],
               margin: [10, 0]
             };
           },
          content: [
            { text:budget.title.replace("*Draft*",""),  style:'header'},


            {
              text:[

                {text:'Notes:' , bold:true},
                {text: " " + budget.notes, style:"space"},
              ]
            },

            {text:"Liquidity", style:"table_head"},
          ],

            styles: {
              header: {
                fontSize: 18,
                bold: true,
                italics:true,
                lineHeight:1.5,
                decoration: 'underline',
                alignment : 'center',
              },

              table_head:{
                bold:true,
                lineHeight:1.5,
                decoration: 'underline',
                fontSize:14.5,

              },

              space:{
                lineHeight:1.5,
              },

              total:{
                bold:true,
                lineHeight:1.5,
              },

              table_heading:{
                bold:true,
              },

              foot:{
                alignment:'right',
                italics:true,
              }
            },

            // footer:function(page, pages) {
            //   return {
            //     columns: [
            //
            //       {
            //         alignment:'left',
            //         text: [
            //           {text:"Copyright © " + current_date + " AgBiz Logic. All Rights Reserved. ", italics:true },
            //
            //         ]
            //       },
            //       {
            //         alignment:'right',
            //         text: [
            //           {text: date[1]+"/"+date[2]+"/"+date[0] + "\t" + " " + " " + " " + " " + " " + " " + " " + " "
            //         + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
            //       + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
            //      },
            //           { text: page.toString(), italics: true },
            //           ' of ',
            //           { text: pages.toString(), italics: true }
            //
            //         ]
            //
            //       }
            //
            //     ],
            //     margin: [10, 0]
            //   };
            // },
          };

      if(budget.enterprise !== 'Livestock'){
        var crop_income = {
          table: {
            headerRows: 1,
            widths: ['15%', '28%', '28%', '28%'],

            body: [
              [
                {text:'Year' , style:"table_heading"},
                {text:'Current Ratio' , style:"table_heading", alignment: "right"},
                {text:'Working Capital' , style:"table_heading", alignment: "right"},
                {text:'Working Capital to Gross Revenues' , style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'1', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[0], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[0], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[0], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'2', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[1], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[1], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[1], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'3', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[2], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'4', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[3], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'5', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[4], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[4], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[4], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'6', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[5], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[5], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[5], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'7', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[6], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[6], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[6], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'8', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[7], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[7], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[7], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'9', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[8], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[8], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[8], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'10', style:"table_heading"},
                 {text:''+$ctrl.statements.current_ratio[9], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_capital[9], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.working_to_rev[9], style:"table_heading", alignment: "right"},
              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };


        var solvency_text = {
          text:"Solvency", style:"table_head"
        };

        var solvency = {
          table: {
            headerRows: 1,
            widths: ['15%', '28%', '28%', '28%'],

            body: [
              [
                {text:'Year' , style:"table_heading"},
                {text:'Debt/Asset Ratio' , style:"table_heading", alignment: "right"},
                {text:'Equity/Asset Ratio' , style:"table_heading", alignment: "right"},
                {text:'Debt/Equity Ratio' , style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'1', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[0], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[0], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[0], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'2', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[1], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[1], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[1], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'3', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[2], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'4', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[3], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'5', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[4], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[4], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[4], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'6', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[5], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[5], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[5], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'7', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[6], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[6], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[6], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'8', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[7], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[7], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[7], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'9', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[8], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[8], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[8], style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'10', style:"table_heading"},
                 {text:''+$ctrl.statements.debt_asset[9], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.equity_assest[9], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.debt_asset[9], style:"table_heading", alignment: "right"},
              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };


        var profitability_text = {
          text:"Profitability", style:"table_head"
        };

        var profitability = {
          table: {
            headerRows: 1,
            widths: ['15%', '17%', '17%', '17%', '17%', '17%'],

            body: [
              [
               {text:'Year' , style:"table_heading"},
               {text:'Rate of Return on Assets' , style:"table_heading", alignment: "right"},
               {text:'Rate of Return on Equity' , style:"table_heading", alignment: "right"},
               {text:'Operating Profit Margin' , style:"table_heading", alignment: "right"},
               {text:'Net Income' , style:"table_heading", alignment: "right"},
               {text:'EBITDA' , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'1', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[0], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[0] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'2', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[1], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[1] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'3', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[2], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[2] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'4', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[3], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[3] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'5', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[4], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[4] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'6', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[5], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[5] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'7', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[6], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[6] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'8', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[7], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[7] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'9', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[8], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[8] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'10', style:"table_heading"},
               {text: $ctrl.statements.rate_return_asset[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.rate_return_equity[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_profit_margin[9], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_income[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.ebitda[9] , style:"table_heading", alignment: "right"},
              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };

        var repayment_text = {
          text:"Repayment", style:"table_head"
        };

        var repayment = {
          table: {
            headerRows: 1,
            widths: ['15%', '17%', '17%', '17%', '17%', '17%'],

            body: [
              [
               {text:'Year' , style:"table_heading"},
               {text:'Capital Debt Repayment Capacity' , style:"table_heading", alignment: "right"},
               {text:'Capital Debt Repayment Margin' , style:"table_heading", alignment: "right"},
               {text:'Replacement Margin' , style:"table_heading", alignment: "right"},
               {text:'Term Debt & Capital Lease Coverage Ratio' , style:"table_heading", alignment: "right"},
               {text:'Replacement Margin Coverage Ratio' , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'1', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[0] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[0], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[0] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'2', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[1] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[1], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[1] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'3', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[2] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[2], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[2] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'4', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[3] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[3], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[3] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'5', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[4] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[4], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[4] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'6', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[5] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[5], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[5] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'7', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[6] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[6], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[6] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'8', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[7] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[7], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[7] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'9', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[8] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[8], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[8] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'10', style:"table_heading"},
               {text: $ctrl.statements.debt_capacity[9] , style:"table_heading", alignment: "right"},
               {text: "" , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin[9], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.term_debt_ratio[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.replacement_margin_ratio[9] , style:"table_heading", alignment: "right"},
              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };

        var efficiency_text = {
          text:"Efficiency", style:"table_head"
        };

        var efficiency = {
          table: {
            headerRows: 1,
            widths: ['15%', '17%', '17%', '17%', '17%', '17%'],

            body: [
              [
               {text:'Year' , style:"table_heading"},
               {text:'Asset Turnover Ratio' , style:"table_heading", alignment: "right"},
               {text:'Operating Expense Ratio' , style:"table_heading", alignment: "right"},
               {text:'Depreciation Expense Ratio' , style:"table_heading", alignment: "right"},
               {text:'Interest Expense Ratio' , style:"table_heading", alignment: "right"},
               {text:'Net Income from Operations Ratio' , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'1', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[0], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[0] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[0] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'2', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[1], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[1] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[1] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'3', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[2], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[2] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[2] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'4', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[3], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[3] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[3] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'5', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[4], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[4] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[4] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'6', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[5], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[5] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[5] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'7', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[6], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[6] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[6] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'8', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[7], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[7] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[7] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'9', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[8], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[8] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[8] , style:"table_heading", alignment: "right"},
              ],

              [
               {text:'10', style:"table_heading"},
               {text: $ctrl.statements.asset_turnover[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.operating_expense_ratio[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.depreciation_expense_ratio[9], style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.interest_expense_ratio[9] , style:"table_heading", alignment: "right"},
               {text: $ctrl.statements.net_farm_ratio[9] , style:"table_heading", alignment: "right"},
              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };

        doc_definition.content.push(crop_income);
        doc_definition.content.push('\n\n');
        doc_definition.content.push(solvency_text);
        doc_definition.content.push(solvency);
        doc_definition.content.push('\n\n');
        doc_definition.content.push(profitability_text);
        doc_definition.content.push(profitability);
        doc_definition.content.push('\n\n');
        doc_definition.content.push(repayment_text);
        doc_definition.content.push(repayment);
        doc_definition.content.push('\n\n');
        doc_definition.content.push(efficiency_text);
        doc_definition.content.push(efficiency);
      }




      //Total

      var file_name = budget.title + ".pdf";
      pdfMake.createPdf(doc_definition).download(file_name);
    }

    function formatCurrency(n) {
      if (n>=null){
      return '$' + " " + parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }
      else{
          return '-$' + " " + parseFloat(-n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }


    }

    function numberWithCommas(x) {
      return parseFloat(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }

    function compare(a,b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }


  }
})();

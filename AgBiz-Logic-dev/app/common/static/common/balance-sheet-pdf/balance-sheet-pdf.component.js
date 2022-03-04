(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("balanceSheetPdf", {
      templateUrl: "/static/common/balance-sheet-pdf/balance-sheet-pdf.component.html",
      controller: balanceSheetPdfController,
      bindings: {
        'statements': "<",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  balanceSheetPdfController.$inject = [
    "budgetService",
    "scenarioService"
  ];

  function balanceSheetPdfController(
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
    $ctrl.created_date;

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
      console.log(budget)
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
            {text:"Current Assets", style:"table_head"},
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
                fontSize:12,

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
                fontSize:7,
              },

              foot:{
                alignment:'right',
                italics:true,
              }
            },

          };

      if(budget.enterprise !== 'Livestock'){
        var table_1 = {
          table: {
            headerRows: 1,
            widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],

            body: [
              [{text:'' , style:"table_heading"},
               {text:'Year 0' , style:"table_heading", alignment: "right",},
               {text:'Year 1' , style:"table_heading", alignment: "right",},
               {text:'Year 2' , style:"table_heading", alignment: "right"},
               {text:'Year 3' , style:"table_heading", alignment: "right"},
               {text:'Year 4' , style:"table_heading", alignment: "right"},
               {text:'Year 5' , style:"table_heading", alignment: "right"},
               {text:'Year 6' , style:"table_heading", alignment: "right"},
               {text:'Year 7' , style:"table_heading", alignment: "right"},
               {text:'Year 8' , style:"table_heading", alignment: "right"},
               {text:'Year 9' , style:"table_heading", alignment: "right"},
               {text:'Year 10' , style:"table_heading", alignment: "right"},
              ],

              [
                 {text:'Cash & Checking', style:"table_heading"},
                 {text:''+$ctrl.statements.cash[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.cash[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Accounts Receivable', style:"table_heading"},
                 {text:''+$ctrl.statements.account_receivable[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.account_receivable[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Prepaid Expenses', style:"table_heading"},
                 {text:''+$ctrl.statements.prepaid_expenses[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.prepaid_expenses[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Cash Investments', style:"table_heading"},
                 {text:''+$ctrl.statements.investment[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investment[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Marketable Livestock', style:"table_heading"},
                 {text:''+$ctrl.statements.marketable_livestock[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.marketable_livestock[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Stored Crops and Feed', style:"table_heading"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.stored_crops_and_feed[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Purchased Feed', style:"table_heading"},
                 {text:''+$ctrl.statements.purchased_feed[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.purchased_feed[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Supplies', style:"table_heading"},
                 {text:''+$ctrl.statements.supplies[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.supplies[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Other Current Assets', style:"table_heading"},
                 {text:''+$ctrl.statements.other_assets[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_assets[10] , style:"table_heading", alignment: "right"},

              ],




            ]
          },
          layout: 'lightHorizontalLines'
        };



        var title_2= {
          text:"Intermediate Assets", style:"table_head"
        };

        var table_2 = {
          table: {
            headerRows: 1,
            widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],

            body: [
              [{text:'' , style:"table_heading"},
               {text:'Year 0' , style:"table_heading", alignment: "right"},
               {text:'Year 1' , style:"table_heading", alignment: "right"},
               {text:'Year 2' , style:"table_heading", alignment: "right"},
               {text:'Year 3' , style:"table_heading", alignment: "right"},
               {text:'Year 4' , style:"table_heading", alignment: "right"},
               {text:'Year 5' , style:"table_heading", alignment: "right"},
               {text:'Year 6' , style:"table_heading", alignment: "right"},
               {text:'Year 7' , style:"table_heading", alignment: "right"},
               {text:'Year 8' , style:"table_heading", alignment: "right"},
               {text:'Year 9' , style:"table_heading", alignment: "right"},
               {text:'Year 10' , style:"table_heading", alignment: "right"},
              ],

              [
                {text:'Vehicles, Machinery, Equipment, and Breeding Livestock', style:"table_heading"},
                 {text:''+$ctrl.statements.short_asset[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_asset[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Contracts & Notes Receivable', style:"table_heading"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contracts_and_notes_receivable[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Investment in Cooperatives', style:"table_heading"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.investing_in_cooperatives[10] , style:"table_heading", alignment: "right"},

              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };


        var title_3= {
          text:"Long Term Assets", style:"table_head"
        };

        var table_3 = {
          table: {
            headerRows: 1,
            widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],

            body: [
              [{text:'' , style:"table_heading"},
               {text:'Year 0' , style:"table_heading", alignment: "right"},
               {text:'Year 1' , style:"table_heading", alignment: "right"},
               {text:'Year 2' , style:"table_heading", alignment: "right"},
               {text:'Year 3' , style:"table_heading", alignment: "right"},
               {text:'Year 4' , style:"table_heading", alignment: "right"},
               {text:'Year 5' , style:"table_heading", alignment: "right"},
               {text:'Year 6' , style:"table_heading", alignment: "right"},
               {text:'Year 7' , style:"table_heading", alignment: "right"},
               {text:'Year 8' , style:"table_heading", alignment: "right"},
               {text:'Year 9' , style:"table_heading", alignment: "right"},
               {text:'Year 10' , style:"table_heading", alignment: "right"},
              ],

              [
                {text:'Real Estate, Land', style:"table_heading"},
                 {text:''+$ctrl.statements.real_estate_land[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_land[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Buildings & Improvements', style:"table_heading"},
                 {text:''+$ctrl.statements.long_asset[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_asset[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Total Assets', style:"table_heading"},
                 {text:''+$ctrl.statements.total_assets[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_assets[10] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };


        var title_4= {
          text:"Current Liabilities", style:"table_head"
        };

        var table_4 = {
          table: {
            headerRows: 1,
            widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],

            body: [
              [{text:'' , style:"table_heading"},
               {text:'Year 0' , style:"table_heading", alignment: "right"},
               {text:'Year 1' , style:"table_heading", alignment: "right"},
               {text:'Year 2' , style:"table_heading", alignment: "right"},
               {text:'Year 3' , style:"table_heading", alignment: "right"},
               {text:'Year 4' , style:"table_heading", alignment: "right"},
               {text:'Year 5' , style:"table_heading", alignment: "right"},
               {text:'Year 6' , style:"table_heading", alignment: "right"},
               {text:'Year 7' , style:"table_heading", alignment: "right"},
               {text:'Year 8' , style:"table_heading", alignment: "right"},
               {text:'Year 9' , style:"table_heading", alignment: "right"},
               {text:'Year 10' , style:"table_heading", alignment: "right"},
              ],

              [
                {text:'Accounts Payable', style:"table_heading"},
                 {text:''+$ctrl.statements.accounts_payable[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accounts_payable[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Operating Loans', style:"table_heading"},
                 {text:''+$ctrl.statements.operating_loans[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.operating_loans[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Accrued Interest', style:"table_heading"},
                 {text:''+$ctrl.statements.accrued_interest[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.accrued_interest[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Ad Valorem Taxes', style:"table_heading"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ad_valorem_taxes[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Employee Payroll Withholding', style:"table_heading"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.employee_payroll_withholding[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Income Taxes', style:"table_heading"},
                 {text:''+$ctrl.statements.income_taxes[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_taxes[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Deferred Taxes', style:"table_heading"},
                 {text:''+$ctrl.statements.deferred_taxes[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.deferred_taxes[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Other Accrued Expenses', style:"table_heading"},
                 {text:''+$ctrl.statements.other_accured_expenses[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_accured_expenses[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Capital Leases current', style:"table_heading"},
                 {text:''+$ctrl.statements.capital_leases_current[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_current[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Other Current Liabilities', style:"table_heading"},
                 {text:''+$ctrl.statements.other_current_liabilites[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.other_current_liabilites[10] , style:"table_heading", alignment: "right"},

              ],

            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_5= {
          text:"NonCurrent Liabilities", style:"table_head"
        };

        var table_5 = {
          table: {
            headerRows: 1,
            widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],

            body: [
              [{text:'' , style:"table_heading"},
               {text:'Year 0' , style:"table_heading", alignment: "right"},
               {text:'Year 1' , style:"table_heading", alignment: "right"},
               {text:'Year 2' , style:"table_heading", alignment: "right"},
               {text:'Year 3' , style:"table_heading", alignment: "right"},
               {text:'Year 4' , style:"table_heading", alignment: "right"},
               {text:'Year 5' , style:"table_heading", alignment: "right"},
               {text:'Year 6' , style:"table_heading", alignment: "right"},
               {text:'Year 7' , style:"table_heading", alignment: "right"},
               {text:'Year 8' , style:"table_heading", alignment: "right"},
               {text:'Year 9' , style:"table_heading", alignment: "right"},
               {text:'Year 10' , style:"table_heading", alignment: "right"},
              ],

              [
                {text:'Capital Leases non current', style:"table_heading"},
                 {text:''+$ctrl.statements.capital_leases_non_current[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_leases_non_current[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Notes Payable Real Estate', style:"table_heading"},
                 {text:''+$ctrl.statements.real_borrowing_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_borrowing_table[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Capital Purchases', style:"table_heading"},
                 {text:''+$ctrl.statements.capital_purchase[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.capital_purchase[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Total Liabilities', style:"table_heading"},
                 {text:''+$ctrl.statements.total_liabilities[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_liabilities[10] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Total Owners Equity', style:"table_heading"},
                 {text:''+$ctrl.statements.total_equity[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[9] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_equity[10] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };
        //
        // var title_6= {
        //   text:"Scheduled Loan Payments Short Term", style:"table_head"
        // };
        //
        // var table_6 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Interest', style:"table_heading"},
        //          {text:''+$ctrl.statements.short_interest_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_interest_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Principal', style:"table_heading"},
        //          {text:''+$ctrl.statements.short_principal_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_principal_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };
        //
        // var title_7= {
        //   text:"Intermediate Assets", style:"table_head"
        // };
        //
        // var table_7 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Interest', style:"table_heading"},
        //          {text:''+$ctrl.statements.int_interest_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_interest_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Principal', style:"table_heading"},
        //          {text:''+$ctrl.statements.int_principal_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_principal_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };
        //
        // var title_8= {
        //   text:"Facilities and Other Improvements", style:"table_head"
        // };
        //
        // var table_9 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Interest', style:"table_heading"},
        //          {text:''+$ctrl.statements.improvement_interest_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_interest_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Principal', style:"table_heading"},
        //          {text:''+$ctrl.statements.improvement_principal_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvement_principal_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };
        //
        //
        // var title_9= {
        //   text:"Real Estate", style:"table_head"
        // };
        //
        // var table_9 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Interest', style:"table_heading"},
        //          {text:''+$ctrl.statements.real_interest_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_interest_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Principal', style:"table_heading"},
        //          {text:''+$ctrl.statements.real_principal_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_principal_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Total Cash Outflows', style:"table_heading"},
        //          {text:''+$ctrl.statements.total_cash_outflows[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_cash_outflows[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };
        //
        // var title_10= {
        //   text:"New Borrowing", style:"table_head"
        // };
        //
        // var table_10 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Short Term', style:"table_heading"},
        //          {text:''+$ctrl.statements.short_borrowing_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.short_borrowing_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Intermediate Assets', style:"table_heading"},
        //          {text:''+$ctrl.statements.int_borrowing_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.int_borrowing_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Facilities and Other Improvements', style:"table_heading"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.improvements_borrowing_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Real Estate', style:"table_heading"},
        //          {text:''+$ctrl.statements.real_borrowing_table[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.real_borrowing_table[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };
        //
        // var title_11= {
        //   text:"Cash Flow Summary", style:"table_head"
        // };
        //
        // var table_11 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Beginning Cash Balance', style:"table_heading"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.beginning_cash_balance[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Inflows - Outflows', style:"table_heading"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.inflows_minus_outflows[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Ending Cash Balance', style:"table_heading"},
        //          {text:''+$ctrl.statements.ending_cash_balance[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.ending_cash_balance[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };
        //
        // var title_12= {
        //   text:"Outstanding Loan Balances", style:"table_head"
        // };
        //
        // var table_12 = {
        //   table: {
        //     headerRows: 1,
        //     widths: ['15%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%', '7.9%'],
        //
        //     body: [
        //       [{text:'' , style:"table_heading"},
        //        {text:'Year 1' , style:"table_heading", alignment: "right"},
        //        {text:'Year 2' , style:"table_heading", alignment: "right"},
        //        {text:'Year 3' , style:"table_heading", alignment: "right"},
        //        {text:'Year 4' , style:"table_heading", alignment: "right"},
        //        {text:'Year 5' , style:"table_heading", alignment: "right"},
        //        {text:'Year 6' , style:"table_heading", alignment: "right"},
        //        {text:'Year 7' , style:"table_heading", alignment: "right"},
        //        {text:'Year 8' , style:"table_heading", alignment: "right"},
        //        {text:'Year 9' , style:"table_heading", alignment: "right"},
        //        {text:'Year 10' , style:"table_heading", alignment: "right"},
        //       ],
        //
        //       [
        //         {text:'Outstanding Credit Line Loans', style:"table_heading"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_credit_line[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Outstanding Short Term Loans', style:"table_heading"},
        //          {text:''+$ctrl.statements.outstanding_short[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_short[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Outstanding Non-R.E. Loans', style:"table_heading"},
        //          {text:''+$ctrl.statements.outstanding_nonre[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_nonre[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Outstanding Real Estate Loans', style:"table_heading"},
        //          {text:''+$ctrl.statements.outstanding_real[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.outstanding_real[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //       [
        //         {text:'Total Outstanding Loans', style:"table_heading"},
        //          {text:''+$ctrl.statements.total_outstanding[0] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[1] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[2], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[3], style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[4] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[5] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[6] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[7] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[8] , style:"table_heading", alignment: "right"},
        //          {text:''+$ctrl.statements.total_outstanding[9] , style:"table_heading", alignment: "right"},
        //
        //       ],
        //
        //
        //     ]
        //   },
        //   layout: 'lightHorizontalLines'
        // };






        doc_definition.content.push(table_1);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_2);
        doc_definition.content.push(table_2);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_3);
        doc_definition.content.push(table_3);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_4);
        doc_definition.content.push(table_4);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_5);
        doc_definition.content.push(table_5);

        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_6);
        // doc_definition.content.push(table_6);
        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_7);
        // doc_definition.content.push(table_7);
        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_8);
        // doc_definition.content.push(table_9);
        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_9);
        // doc_definition.content.push(table_9);
        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_10);
        // doc_definition.content.push(table_10);
        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_11);
        // doc_definition.content.push(table_11);
        // doc_definition.content.push('\n');
        // doc_definition.content.push(title_12);
        // doc_definition.content.push(table_12);
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

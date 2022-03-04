(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("incomeStatementPdf", {
      templateUrl: "/static/common/income-statement-pdf/income-statement-pdf.component.html",
      controller: incomeStatementPdfController,
      bindings: {
        'statements': "<",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  incomeStatementPdfController.$inject = [
    "budgetService",
    "scenarioService"
  ];

  function incomeStatementPdfController(
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

            {text:"Revenues", style:"table_head"},
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
          var rows_income = [];
          rows_income.push([{text:'' , style:"table_heading"},
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
         ])
          angular.forEach($ctrl.statements.cashflowitem_income, function(value, key) {
            rows_income.push(
            [{text:''+value.name, style:"table_heading"},
            {text:''+value.year_1 , style:"table_heading", alignment: "right"},{text:''+value.year_2 , style:"table_heading", alignment: "right"},
            {text:''+value.year_3 , style:"table_heading", alignment: "right"},{text:''+value.year_4 , style:"table_heading", alignment: "right"},
            {text:''+value.year_5 , style:"table_heading", alignment: "right"},{text:''+value.year_6 , style:"table_heading", alignment: "right"},
            {text:''+value.year_7 , style:"table_heading", alignment: "right"},{text:''+value.year_8 , style:"table_heading", alignment: "right"},
            {text:''+value.year_9 , style:"table_heading", alignment: "right"},{text:''+value.year_10 , style:"table_heading", alignment: "right"}]
          )
          });
          rows_income.push([
            {text:'Revenues from Products', style:"table_heading"},
             {text:''+$ctrl.statements.cashflowitem_income_total[0] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[1] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[2], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[3], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[4] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[5] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[6] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[7] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[8] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.cashflowitem_income_total[9] , style:"table_heading", alignment: "right"},

          ])
          rows_income.push([
            {text:'Accounts Receivable', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].account_receivable, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].account_receivable, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].account_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].account_receivable , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'Prepaid Expenses', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].prepaid_expenses, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].prepaid_expenses, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].prepaid_expenses , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].prepaid_expenses , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'Cash Investments', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].investment, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].investment, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].investment , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].investment , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'Supplies', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].supplies, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].supplies, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].supplies , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].supplies , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'Other Current Assets', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].other_assets, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].other_assets, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].other_assets , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].other_assets , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'Notes Receivable', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].contracts_and_notes_receivable, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].contracts_and_notes_receivable, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].contracts_and_notes_receivable , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'investment in cooperatives', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].investing_in_cooperatives, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].investing_in_cooperatives, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].investing_in_cooperatives , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'investment in cooperatives', style:"table_heading"},
             {text:''+$ctrl.statements.balance_data[0].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[1].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[2].investing_in_cooperatives, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[3].investing_in_cooperatives, style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[4].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[5].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[6].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[7].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[8].investing_in_cooperatives , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.balance_data[9].investing_in_cooperatives , style:"table_heading", alignment: "right"},
          ])
          rows_income.push([
            {text:'Gross Farm Revenue', style:"table_heading"},
             {text:''+$ctrl.statements.gross_farm_revene[0] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[1] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[2], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[3], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[4] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[5], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[6] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[7] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[8] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.gross_farm_revene[9] , style:"table_heading", alignment: "right"},
          ])


      if(budget.enterprise !== 'Livestock'){
        var crop_income = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: rows_income
          },
          layout: 'lightHorizontalLines'
        };
        var crop_text = {
          text:"Expenses", style:"table_head"
        };
        var rows_expense = [];
        rows_expense.push([{text:'' , style:"table_heading"},
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
       ])
        angular.forEach($ctrl.statements.cashflowitem_expense, function(value, key) {
          rows_expense.push(
          [{text:''+value.name, style:"table_heading"},
          {text:''+value.year_1 , style:"table_heading", alignment: "right"},{text:''+value.year_2 , style:"table_heading", alignment: "right"},
          {text:''+value.year_3 , style:"table_heading", alignment: "right"},{text:''+value.year_4 , style:"table_heading", alignment: "right"},
          {text:''+value.year_5 , style:"table_heading", alignment: "right"},{text:''+value.year_6 , style:"table_heading", alignment: "right"},
          {text:''+value.year_7 , style:"table_heading", alignment: "right"},{text:''+value.year_8 , style:"table_heading", alignment: "right"},
          {text:''+value.year_9 , style:"table_heading", alignment: "right"},{text:''+value.year_10 , style:"table_heading", alignment: "right"}]
        )
        });
        rows_expense.push([
          {text:'Total', style:"table_heading"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[0] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[1] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[2], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[3], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[4] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[5], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[6] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[7] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[8] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cashflowitem_expense_total[9] , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push([
          {text:'Purchased Feed', style:"table_heading"},
           {text:''+$ctrl.statements.balance_data[0].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[1].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[2].purchased_feed, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[3].purchased_feed, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[4].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[5].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[6].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[7].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[8].purchased_feed , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[9].purchased_feed , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push([
          {text:'Accounts Payable', style:"table_heading"},
           {text:''+$ctrl.statements.balance_data[0].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[1].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[2].accounts_payable, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[3].accounts_payable, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[4].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[5].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[6].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[7].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[8].accounts_payable , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[9].accounts_payable , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push([
          {text:'Valorem Taxes', style:"table_heading"},
           {text:''+$ctrl.statements.balance_data[0].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[1].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[2].valorem_taxes, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[3].valorem_taxes, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[4].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[5].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[6].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[7].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[8].valorem_taxes , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[9].valorem_taxes , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push([
          {text:'Employee Payroll Withholding', style:"table_heading"},
           {text:''+$ctrl.statements.balance_data[0].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[1].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[2].employee_payroll_withholding, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[3].employee_payroll_withholding, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[4].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[5].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[6].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[7].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[8].employee_payroll_withholding , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[9].employee_payroll_withholding , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push([
          {text:'Other Accrued Expenses', style:"table_heading"},
           {text:''+$ctrl.statements.balance_data[0].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[1].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[2].other_accured_expenses, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[3].other_accured_expenses, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[4].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[5].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[6].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[7].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[8].other_accured_expenses , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[9].other_accured_expenses , style:"table_heading", alignment: "right"},
        ])

        rows_expense.push([
          {text:'Other Current Liabilities', style:"table_heading"},
           {text:''+$ctrl.statements.balance_data[0].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[1].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[2].other_current_liabilites, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[3].other_current_liabilites, style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[4].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[5].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[6].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[7].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[8].other_current_liabilites , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.balance_data[9].other_current_liabilites , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push([
          {text:'depreciation expense', style:"table_heading"},
           {text:''+$ctrl.statements.depreciation[0] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[1] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[2], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[3], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[4] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[5], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[6] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[7] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[8] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.depreciation[9] , style:"table_heading", alignment: "right"},
        ])
        rows_expense.push(  [
            {text:'Total Operating Expense', style:"table_heading"},
             {text:''+$ctrl.statements.total_operating_expense[0] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[1] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[2], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[3], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[4] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[5], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[6] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[7] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[8] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[9] , style:"table_heading", alignment: "right"},
          ])

          rows_expense.push(  [
              {text:'Cash Interest Paid', style:"table_heading"},
               {text:''+$ctrl.statements.cash_interest_paid[0] , style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[1] , style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[2], style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[3], style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[4] , style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[5], style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[6] , style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[7] , style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[8] , style:"table_heading", alignment: "right"},
               {text:''+$ctrl.statements.cash_interest_paid[9] , style:"table_heading", alignment: "right"},
            ])

        rows_expense.push(  [
            {text:'Total Farm Expense', style:"table_heading"},
             {text:''+$ctrl.statements.total_operating_expense[0] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[1] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[2], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[3], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[4] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[5], style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[6] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[7] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[8] , style:"table_heading", alignment: "right"},
             {text:''+$ctrl.statements.total_operating_expense[9] , style:"table_heading", alignment: "right"},
          ])
        rows_expense.push(
                      [
                        {text:'Net Farm Income From Operations', style:"table_heading"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[0] , style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[1] , style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[2], style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[3], style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[4] , style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[5], style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[6] , style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[7] , style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[8] , style:"table_heading", alignment: "right"},
                         {text:''+$ctrl.statements.net_farm_income_from_operations[9] , style:"table_heading", alignment: "right"},
                      ])

        var crop_costs = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: rows_expense
          },
          layout: 'lightHorizontalLines'
        };

        doc_definition.content.push(crop_income);
        doc_definition.content.push('\n');
        doc_definition.content.push(crop_text);
        doc_definition.content.push(crop_costs);
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

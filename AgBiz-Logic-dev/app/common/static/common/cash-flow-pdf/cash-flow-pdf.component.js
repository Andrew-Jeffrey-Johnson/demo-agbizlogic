(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("cashFlowPdf", {
      templateUrl: "/static/common/income-statement-pdf/income-statement-pdf.component.html",
      controller: cashFlowPdfController,
      bindings: {
        'statements': "<",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  cashFlowPdfController.$inject = [
    "budgetService",
    "scenarioService"
  ];

  function cashFlowPdfController(
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
            {text:"Cash received from operations", style:"table_head"},
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
          {text:'Total Cash Received From Operations', style:"table_heading"},
           {text:''+$ctrl.statements.total_cash_operations[0] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[1] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[2], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[3], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[4] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[5] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[6] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[7] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[8] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_operations[9] , style:"table_heading", alignment: "right"},

        ])

        var crop_income = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],
            body:rows_income
          },
          layout: 'lightHorizontalLines'
        };



        var title_2= {
          text:"Cash Received From Capital Sales", style:"table_head"
        };

        var Cash_Received_From_Capital_Sales = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Intermediate Assets', style:"table_heading"},
                 {text:''+$ctrl.statements.intermediate_sale_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_sale_table[9] , style:"table_heading", alignment: "right"},

              ],
              [
                {text:'Facilities and Other Improvements', style:"table_heading"},
                 {text:''+$ctrl.statements.facilities_sale_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.facilities_sale_table[9] , style:"table_heading", alignment: "right"},

              ],
              [
                {text:'Real Estate', style:"table_heading"},
                 {text:''+$ctrl.statements.real_estate_sale_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_estate_sale_table[9] , style:"table_heading", alignment: "right"},

              ],
              [
                {text:'Total Cash Inflows', style:"table_heading"},
                 {text:''+$ctrl.statements.total_cash_inflows[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_inflows[9] , style:"table_heading", alignment: "right"},

              ],
            ]
          },
          layout: 'lightHorizontalLines'
        };


        var title_3= {
          text:"Operating Expenses", style:"table_head"
        };
        var rows_expense=[]
        rows_expense.push([{text:'' , style:"table_heading"},
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
          {text:'Rent and Leases: Land and Animals', style:"table_heading"},
           {text:''+$ctrl.statements.rent_leases_table[0] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[1] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[2], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[3], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[4] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[5] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[6] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[7] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[8] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.rent_leases_table[9] , style:"table_heading", alignment: "right"},

        ])
        rows_expense.push([
          {text:'Capital Leases', style:"table_heading"},
           {text:''+$ctrl.statements.cap_leases_table[0] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[1] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[2], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[3], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[4] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[5] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[6] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[7] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[8] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.cap_leases_table[9] , style:"table_heading", alignment: "right"},

        ])
        rows_expense.push([
          {text:'Total Cash Expenses', style:"table_heading"},
           {text:''+$ctrl.statements.total_cash_expenses[0] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[1] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[2], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[3], style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[4] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[5] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[6] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[7] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[8] , style:"table_heading", alignment: "right"},
           {text:''+$ctrl.statements.total_cash_expenses[9] , style:"table_heading", alignment: "right"},

        ])

        console.log(rows_expense)
        var Operating_Expenses = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],
            body: rows_expense
          },
          layout: 'lightHorizontalLines'
        };


        var title_4= {
          text:"Capital Expenses", style:"table_head"
        };

        var Capital_Expenses = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Intermediate Assets', style:"table_heading"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.intermediate_cap_ex_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Long Term Assets', style:"table_heading"},
                 {text:''+$ctrl.statements.long_cap_ex_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.long_cap_ex_table[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_5= {
          text:"Other Outflows", style:"table_head"
        };

        var Other_Outflows = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Wages', style:"table_heading"},
                 {text:''+$ctrl.statements.wages_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.wages_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Salaries', style:"table_heading"},
                 {text:''+$ctrl.statements.salaries_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.salaries_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Family Withdrawls', style:"table_heading"},
                 {text:''+$ctrl.statements.family_withdrawls_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.family_withdrawls_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Contributions', style:"table_heading"},
                 {text:''+$ctrl.statements.contributions_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.contributions_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Income Tax', style:"table_heading"},
                 {text:''+$ctrl.statements.income_tax_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.income_tax_table[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_6= {
          text:"Scheduled Loan Payments Short Term", style:"table_head"
        };

        var Scheduled_Loan_Payments = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Interest', style:"table_heading"},
                 {text:''+$ctrl.statements.short_interest_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_interest_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Principal', style:"table_heading"},
                 {text:''+$ctrl.statements.short_principal_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_principal_table[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_7= {
          text:"Intermediate Assets", style:"table_head"
        };

        var Intermediate_Assets = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Interest', style:"table_heading"},
                 {text:''+$ctrl.statements.int_interest_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_interest_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Principal', style:"table_heading"},
                 {text:''+$ctrl.statements.int_principal_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_principal_table[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_8= {
          text:"Facilities and Other Improvements", style:"table_head"
        };

        var Facilities_and_Other_Improvements = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Interest', style:"table_heading"},
                 {text:''+$ctrl.statements.improvement_interest_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_interest_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Principal', style:"table_heading"},
                 {text:''+$ctrl.statements.improvement_principal_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvement_principal_table[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };


        var title_9= {
          text:"Real Estate", style:"table_head"
        };

        var Real_Estate = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Interest', style:"table_heading"},
                 {text:''+$ctrl.statements.real_interest_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_interest_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Principal', style:"table_heading"},
                 {text:''+$ctrl.statements.real_principal_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.real_principal_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Total Cash Outflows', style:"table_heading"},
                 {text:''+$ctrl.statements.total_cash_outflows[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_cash_outflows[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_10= {
          text:"New Borrowing", style:"table_head"
        };

        var New_Borrowing = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Short Term', style:"table_heading"},
                 {text:''+$ctrl.statements.short_borrowing_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.short_borrowing_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Intermediate Assets', style:"table_heading"},
                 {text:''+$ctrl.statements.int_borrowing_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.int_borrowing_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Facilities and Other Improvements', style:"table_heading"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.improvements_borrowing_table[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Real Estate', style:"table_heading"},
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

              ],



            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_11= {
          text:"Cash Flow Summary", style:"table_head"
        };

        var Cash_Flow_Summary = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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
                {text:'Beginning Cash Balance', style:"table_heading"},
                 {text:''+$ctrl.statements.beginning_cash_balance[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.beginning_cash_balance[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Inflows - Outflows', style:"table_heading"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.inflows_minus_outflows[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Ending Cash Balance', style:"table_heading"},
                 {text:''+$ctrl.statements.ending_cash_balance[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.ending_cash_balance[9] , style:"table_heading", alignment: "right"},

              ],



            ]
          },
          layout: 'lightHorizontalLines'
        };

        var title_12= {
          text:"Outstanding Loan Balances", style:"table_head"
        };

        var Outstanding_Loan_Balances = {
          table: {
            headerRows: 1,
            widths: ['20%', '8%', '8%', '8%','8%','8%','8%','8%','8%','8%','8%'],

            body: [
              [{text:'' , style:"table_heading"},
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

              // [
              //   {text:'Outstanding Credit Line Loans', style:"table_heading"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[0] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[1] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[2], style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[3], style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[4] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[5] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[6] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[7] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[8] , style:"table_heading", alignment: "right"},
              //    {text:''+$ctrl.statements.outstanding_credit_line[9] , style:"table_heading", alignment: "right"},
              //
              // ],

              [
                {text:'Outstanding Short Term Loans', style:"table_heading"},
                 {text:''+$ctrl.statements.outstanding_short[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_short[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Outstanding Non-R.E. Loans', style:"table_heading"},
                 {text:''+$ctrl.statements.outstanding_nonre[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_nonre[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Outstanding Real Estate Loans', style:"table_heading"},
                 {text:''+$ctrl.statements.outstanding_real[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.outstanding_real[9] , style:"table_heading", alignment: "right"},

              ],

              [
                {text:'Total Outstanding Loans', style:"table_heading"},
                 {text:''+$ctrl.statements.total_outstanding[0] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[1] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[2], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[3], style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[4] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[5] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[6] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[7] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[8] , style:"table_heading", alignment: "right"},
                 {text:''+$ctrl.statements.total_outstanding[9] , style:"table_heading", alignment: "right"},

              ],


            ]
          },
          layout: 'lightHorizontalLines'
        };






        doc_definition.content.push(crop_income);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_2);
        doc_definition.content.push(Cash_Received_From_Capital_Sales);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_3);
        doc_definition.content.push(Operating_Expenses);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_4);
        doc_definition.content.push(Capital_Expenses);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_5);
        doc_definition.content.push(Other_Outflows);
        doc_definition.content.push(title_6);
        doc_definition.content.push(Scheduled_Loan_Payments);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_7);
        doc_definition.content.push(Intermediate_Assets);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_8);
        doc_definition.content.push(Facilities_and_Other_Improvements);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_9);
        doc_definition.content.push(Real_Estate);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_10);
        doc_definition.content.push(New_Borrowing);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_11);
        doc_definition.content.push(Cash_Flow_Summary);
        doc_definition.content.push('\n');
        doc_definition.content.push(title_12);
        doc_definition.content.push(Outstanding_Loan_Balances);
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

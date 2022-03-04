(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("budgetPdf", {
      templateUrl: "/static/common/budget-pdf/budget-pdf.component.html",
      controller: BudgetPdfController,
      bindings: {
        'budget': "<",
      }
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  BudgetPdfController.$inject = [
    "budgetService",
  ];

  function BudgetPdfController(
      budgetService
    ) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.printBudget = printBudget;
    $ctrl.generatePdf = generatePdf;

    // Inputs
    $ctrl.budget;
    $ctrl.error=null;

    /****************************************************************
                         Methods
    ****************************************************************/

    function printBudget() {
      console.log($ctrl.budget);

      $ctrl.budget = budgetService.retrieveBudget($ctrl.budget.id)
      .then(function (budgetResponse) {
        console.log("After getting budget:",budgetResponse);
        $ctrl.budget = budgetResponse.data;
        if(angular.isArray($ctrl.budget)) {
          angular.forEach($ctrl.budget, function(budget){
            generatePdf(budget);
          });
        }
        else {
          generatePdf($ctrl.budget);
        }
      });
    }

    function generatePdf(budget) {
      var t = budget.created_date.split("T");
      var date = t[0].split('-');
      var current_date = new Date().getFullYear()
      var income_name="";
      var income_sale="";
      var income_sale_livestock="";
      var income_weight="";
      var income_price="";
      var income_total="";
      //var sort_IncomeItem = budget.income_items.sort(compare);
      var sort_IncomeItem = budget.income_items;
      sort_IncomeItem.sort(function(a, b){
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
      for(var i=0; i< budget.income_items.length ;i++){
        if(sort_IncomeItem[i].name.length > 25){
          income_name = income_name + "\n" + sort_IncomeItem[i].name.substring(0,25) + '...';
        }else {
          income_name = income_name + "\n" + sort_IncomeItem[i].name;
        }
        income_weight = income_weight + "\n" + sort_IncomeItem[i].weight + " " + sort_IncomeItem[i].sale_unit;
        income_sale_livestock = income_sale_livestock + "\n" + sort_IncomeItem[i].sale_unit_quantity;
        income_sale = income_sale + "\n" + sort_IncomeItem[i].sale_unit_quantity + " " + sort_IncomeItem[i].sale_unit;
        income_price = income_price + "\n" + formatCurrency(sort_IncomeItem[i].price_per_sale_unit);
        income_total = income_total + "\n" +  formatCurrency(sort_IncomeItem[i].return_total);
      }

      var general_name="";
      var general_sold="";
      var general_price="";
      var general_total="";
      var sort_CostItem = budget.cost_items.sort(compare);
      for (var j=0; j<budget.cost_items.length; j++){
        if(budget.cost_items[j].cost_type == 'general'){
          if(sort_CostItem[j].name.length > 25){
            general_name = general_name + "\n" + sort_CostItem[j].name.substring(0,26) + '...';
          }else {
            general_name = general_name + "\n" + sort_CostItem[j].name;
          }
          //console.log("THIS ONE RIGHT HERE--> 1:",general_sold, "2:",sort_CostItem[j], "3:",sort_CostItem[j].farm_unit);
          general_sold = general_sold + "\n" + sort_CostItem[j].unit_quantity + " " + sort_CostItem[j].farm_unit;
          general_price = general_price + "\n" +  formatCurrency(sort_CostItem[j].cost_per_unit);
          general_total = general_total + "\n" +  formatCurrency(sort_CostItem[j].cost_total);
        }
      }

      var fixed_name ="";
      var fixed_sold ="";
      var fixed_price="";
      var fixed_total="";
      for (var k=0; k<budget.cost_items.length; k++){
        if (budget.cost_items[k].cost_type == 'fixed'){
          if(sort_CostItem[k].name.length > 25){
            fixed_name = fixed_name + "\n" + sort_CostItem[k].name.substring(0,26) + '...';
          }else {
            fixed_name = fixed_name + "\n" + sort_CostItem[k].name;
          }
          fixed_sold = fixed_sold + "\n" + sort_CostItem[k].unit_quantity + " " + sort_CostItem[k].unit;
          fixed_price = fixed_price + "\n" + formatCurrency(sort_CostItem[k].cost_per_unit);
          fixed_total = fixed_total + "\n" + formatCurrency(sort_CostItem[k].cost_total);
        }
       }

      var variable_name ="";
      var variable_sold ="";
      var variable_price="";
      var variable_total="";

      var undefined_total_gross_returns=0
      var undefined_total_costs=0
      var undefined_total_net_returns=0

      for (var e=0; e<budget.cost_items.length; e++){
        if (budget.cost_items[e].cost_type == 'variable'){
          if(sort_CostItem[e].name.length > 25){
            variable_name = variable_name + "\n" + sort_CostItem[e].name.substring(0,26) + '...';
          }else {
            variable_name = variable_name + "\n" + sort_CostItem[e].name;
          }
          variable_sold = variable_sold + "\n" + sort_CostItem[e].unit_quantity + " " + sort_CostItem[e].unit;
          variable_price = variable_price + "\n" + formatCurrency(sort_CostItem[e].cost_per_unit);
          variable_total = variable_total + "\n" + formatCurrency(sort_CostItem[e].cost_total);
        }
      }


      if (budget.total_gross_returns == undefined){
        angular.forEach(budget.income_items, function(value){
            undefined_total_gross_returns = parseFloat(undefined_total_gross_returns) + parseFloat(value.return_total)

          });
          budget.total_gross_returns=undefined_total_gross_returns
        }

        if (budget.total_costs == undefined){
          angular.forEach(budget.cost_items, function(value){
              undefined_total_costs = parseFloat(undefined_total_costs) + parseFloat(value.cost_total)
            });
            budget.total_costs=undefined_total_costs
      }

      if (budget.profit == undefined){
        budget.profit = parseFloat(budget.total_gross_returns) -parseFloat(budget.total_costs);
    }


      var doc_definition = {
          pageSize: 'A4',
          content: [
            { text:budget.title.replace("*Draft*",""),  style:'header'},

            {
              text:[
                {text:'State:' , bold:true},
                {text:" " + budget.state, style:'space'},
              ]
            },

            {
              text:[
                {text:'County:' , bold:true},
                {text:" " + budget.region,style:'space'},
              ]
            },

            {
              text:[
                {text:'Budget Unit: ', bold:true},
                {text:" " + budget.farm_unit_quantity + " " + budget.farm_unit, style:'space'},
              ]
            },

            {
              text:[
                {text:'Market: ', bold:true},
                {text:" " + budget.market, style:'space'},
              ]
            },

            {
              text:[
                {text: 'Length of Time for this Budget:', bold:true},
                {text:" " + budget.time_unit, style:'space'},

              ]
            },

            {
              text:[

                {text:'Time Period for this Budget:' , bold:true},
                {text: " " + budget.time_value, style:"space"},
              ]
            },


            {
              text:[

                {text:'Notes:' , bold:true},
                {text: " " + budget.notes, style:"space"},
              ]
            },

            {text:"Income", style:"table_head"},
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
          };

      if(budget.enterprise !== 'Livestock'){
        var crop_income = {
          table: {
            headerRows: 1,
            widths: ['40%', '20%', '20%', '20%'],

            body: [
              [{text:'Name' , style:"table_heading"},
               {text:'Quantity Sold' , style:"table_heading", alignment: "right"},
               {text:'Price' , style:"table_heading", alignment: "right"},
               {text:'Total Value' , style:"table_heading", alignment: "right"},
              ],

              [income_name,
               {text:""+income_sale, alignment: "right"},
               {text:""+income_price, alignment: "right"},
               {text:""+income_total, alignment: "right"}
              ],

              ['Gross Total Returns',
               '',
               '',
               {text:formatCurrency(budget.total_gross_returns), alignment:"right"}
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        };
        var crop_text = {
          text:"General Cash Costs", style:"table_head"
        };

        var crop_costs = {
          table: {
            headerRows: 1,
            widths: ['40%', '20%', '20%', '20%'],

            body: [
              [{text:'Name' , style:"table_heading"},
               {text:'Quantity' , style:"table_heading", alignment: "right"},
               {text:'Price per Unit' , style:"table_heading", alignment: "right"},
               {text:'Total Cost' , style:"table_heading", alignment: "right"},
              ],

              [general_name,
               {text:""+general_sold, alignment: "right"},
               {text:""+general_price, alignment: "right"},
               {text:""+general_total, alignment: "right"}
              ],

              ['Total General Cash Costs',
               '',
               $ctrl.error,
               {text:formatCurrency(budget.total_costs-Number(budget.total_variable_costs)), alignment:"right"}//
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        };

        doc_definition.content.push(crop_income);
        doc_definition.content.push('\n');
        doc_definition.content.push(crop_text);
        doc_definition.content.push(crop_costs);
      } else {
        var livestock_income = {
          table: {
            headerRows: 1,
            widths: ['35%', '18%', '13%', '17%', '17%'],

            body: [
              [{text:'Name' , style:"table_heading"},
               {text:'Weight' , style:"table_heading", alignment: "right"},
               {text:'Quantity Sold' , style:"table_heading", alignment: "right"},
               {text:'Price' , style:"table_heading", alignment: "right"},
               {text:'Total Value' , style:"table_heading", alignment: "right"},
              ],

              [income_name,
               {text:""+income_weight, alignment: "right"},
               {text:""+income_sale_livestock, alignment: "right"},
               {text:""+income_price, alignment: "right"},
               {text:""+income_total, alignment: "right"}
              ],

              ['Gross Total Returns',
               '',
               '',
               '',
               {text:formatCurrency(budget.total_gross_returns), alignment:"right"}
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        };

        var livestock_text = {
          text:"General Cash Costs", style:"table_head"
        };

        var livestock_costs = {
          table: {
            headerRows: 1,
            widths: ['40%', '20%', '20%', '20%'],

            body: [
              [{text:'Name' , style:"table_heading"},
               {text:'Quantity' , style:"table_heading", alignment: "right"},
               {text:'Price per Unit' , style:"table_heading", alignment: "right"},
               {text:'Total Cost' , style:"table_heading", alignment: "right"},
              ],

              [general_name,
               {text:""+general_sold, alignment: "right"},
               {text:""+general_price, alignment: "right"},
               {text:""+general_total, alignment: "right"}
              ],

              ['Total General Costs',
               '',
               '',
               {text:formatCurrency(budget.total_general_costs), alignment:"right"}
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        };

        doc_definition.content.push(livestock_income);
        doc_definition.content.push('\n');
        doc_definition.content.push(livestock_text);
        doc_definition.content.push(livestock_costs);

      }

      if (variable_name !=""){
        var variable = {
              table: {
                  headerRows: 2,
                  widths: ['40%', '20%', '20%', '20%'],

                  body: [
                    [{text:'Variable Costs' , style:"table_head"}, '', '', ''],
                    [{text:'Name' , style:"table_heading"},
                     {text:'Quantity' , style:"table_heading"},
                     {text:'Price per Unit' , style:"table_heading", alignment:"right"},
                     {text:'Total Cost', style:"table_heading", alignment:"right"},
                    ],

                    [variable_name, variable_sold, {text:variable_price, alignment:"right"}, {text:variable_total, alignment:"right"}],
                    ['Total Variable Costs', '', '', {text:formatCurrency(budget.total_variable_costs), alignment:"right"}]
                  ]
              },
            layout: 'lightHorizontalLines'
        };
        doc_definition.content.push('\n');
        doc_definition.content.push(variable);
      }

      if (fixed_name !=""){
        var fixed = {
              table: {
                headerRows: 2,
                widths: ['40%', '20%', '20%', '20%'],

                body: [
                  [{text:'Fixed Cash Costs' , style:"table_head"}, '', '', ''],
                  [{text:'Name' , style:"table_heading"},
                   {text:'Quantity' , style:"table_heading"},
                   {text:'Price per Unit' , style:"table_heading", alignment:"right"},
                   {text:'Total Cost' , style:"table_heading", alignment:"right"},
                  ],

                  [fixed_name, fixed_sold, {text:fixed_price, alignment:"right"}, {text:fixed_total, alignment:"right"}],
                  ['Total Fixed Cash Costs', '', '', {text:formatCurrency(budget.total_fixed_costs), alignment:"right"}]
                ]
              },
            layout: 'lightHorizontalLines'
        };
        doc_definition.content.push('\n');
        doc_definition.content.push(fixed);

      }
      //Total
      var total = {
            table: {
                headerRows: 1,
                widths: ['50%', '50%'],

                body: [
                  [{text:'Totals' , style:"table_head"}, ''],
                  ['Total Gross Returns', {text:formatCurrency(budget.total_gross_returns), alignment:"right"}],
                  ['Total Costs', {text:formatCurrency(budget.total_costs), alignment:"right"}],//2
                  ['Net Returns (income minus costs)', {text:formatCurrency(budget.profit), alignment:"right"}],
                ]
            },
          layout: 'lightHorizontalLines'
      };
      doc_definition.content.push('\n');
      doc_definition.content.push(total);
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

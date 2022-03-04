(function() {
  "use strict";

  angular
    .module("commonModule")
    .component("profitPdf", {
      templateUrl: "static/common/profit-pdf/profit-pdf.component.html",
      controller: ProfitPdfController,
      bindings : {
          "scenario" : "<",
          "plans" : "<"
      }
    });

    ProfitPdfController.$inject = [] ;

    function ProfitPdfController() {
      var $ctrl = this;

      $ctrl.generateProfitPdf = generateProfitPdf;
      $ctrl.scenario;
      $ctrl.plans;
      $ctrl.chartDataURL;
      $ctrl.longestTotalPeriod = -1;

      function generateProfitPdf(scenario) {

        var net_returns_present = document.getElementById("net_present_value").toDataURL('image/png',1.0);
        var internal_rate_of_return = document.getElementById("internal_rate_of_return").toDataURL('image/png',1.0);
        var cash_flow_breakeven = document.getElementById("cash_flow_breakeven").toDataURL('image/png', 1.0);
        var net_returns_graph = document.getElementById("net_returns").toDataURL('image/png', 1.0);

        var t = scenario.created_date.split("T");
        var date = t[0].split("-");

        var dt = scenario.modified_date.split("T");
        var date_modified = dt[0].split("-");




        var columns_1=[{text:"Year", alignment : 'center'}];
        var widths=["20%"];

        var currency_width=[];
        //var currency_plan_header=[""];
        var currency_column_header=[];
        //var currency_column_data=[];

        var Difference_value = "";
        var annual_comparitor=0;

        /*Table Header*/
        var plan_info = [[{text:'Plan', style:"table_heading"},
                           {text:'Discount Rate', style:"table_heading", alignment: "right"},
                           {text:'Beginning Investment Value', style:"table_heading", alignment: "right"},
                           {text:'Ending Investment Value', style:"table_heading", alignment: "right"},
                           {text:'Included in Cash Flow Analysis?' , style:"table_heading", alignment: "right"}]];

        var net_returns_present_table=[[{text:"Plan", style:"table_heading", alignment:"left"},
                                        {text:"Net \nReturns", style:"table_heading", alignment:"left"},
                                        {text:"Net Present \nValue", style:"table_heading", alignment:"left"},
                                        {text:"Equivalent \n Annual Annuity", style:"table_heading", alignment:"left"}]];

        var irr_table = [[{text:"Plan", style:"table_heading",alignment:"left"},
                          {text:"Internal Rate of Return", style:"table_heading", alignment:"right"}]];

        var cash_flow_breakeven_table = [[{border:[false,false,false,false], text:""},
                                          {colSpan: 2,
                                           text: "Year returns are greater than", alignment:"center", bold:"true", fontSize:13},
                                          {}],
                                          [{border:[false,false,false,true], text:"Plan",alignment:"left",style:"table_heading"},
                                           {text:"Annual\n Costs",alignment:"right",style:"table_heading"},
                                           {text:"Total Cost of\n Previous Years",alignment:"right",style:"table_heading"}
                                        /*{ text:"Total Cost to Implement",alignment:"right",style:"table_heading"}*/]];

        var net_returns_table = [];
        var net_returns_table_width = ["*"];

        var budget_tables=[];


        /*list all plans*/
        ListPlans(plan_info, budget_tables, net_returns_present_table, irr_table, cash_flow_breakeven_table, net_returns_table, net_returns_table_width);

        NetReturnsTable(net_returns_table);

        // what's this for? It need three dfferences (in NetReturnsPresentTable)
        // Difference_value = "" + "\n" + net_returns_with_inflation_difference + "\n" + net_present_value_difference + "\n" + equivalent_annual_annuity_difference + "\n" + "\n" + "-" + "\n" + "-" + "\n" + "-";

        var doc_definition = {
          pageSize: 'A4',
          /*header:{
            margin:[40,20,40],
              columns:[
              {
                table:{
                  headerRows: 1,
                  widths: [ '*'],
                  body: [
                    [{  text:[
                          {text: 'Scenario Title:', bold:true},
                          {text:" " + scenario.title, style:'space'},
                          "\n",
                          {text: 'Scenario Created Date:', bold:true},
                          {text:" " + date[1]+ "/" + date[2]+ "/" +date[0], style:'space'},

                          {text: " " + " " + " " + " " + " " + " " + " " + " "
                                + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
                                + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " "
                                + " " + " " + " " + " " + " " + " " + " " + " "
                                + " " + " " + " " + 'Scenario Modified Date:', bold:true},
                          {text:" " + date_modified[1]+ "/" + date_modified[2]+ "/" +date_modified[0], style:'space', alignment:"right"},
                        ]
                    }]
                 ]
               },
               layout: 'lightHorizontalLines'
             },

            ],

          },*/
          content : [
            {text:"Scenario: "+scenario.title,  style:'header'},
            '\n',
            {text: "Created Date: " + date[1] + '/' + date[2] + '/' + date[0], style: 'space'},
            {text: "Modified Date: " + date_modified[1]+ "/" + date_modified[2]+ "/" + date_modified[0], style: 'space'},
            {text: 'Notes:' , bold:true, style: 'space'},
            {text: scenario.notes, style: 'space'},

            /*Plans in Scenario*/
            {text: "Plans in Scenario", style: 'subheader'},
            '\n',
            {table: {headerRows: 1,
                     widths: ["27%","*","23%","23%","23%"],
                     body: plan_info},
             layout: 'lightHorizontalLines'},
            {text:"", pageBreak:'after'},

            /*Net Present Value Chart and Table*/
            {text: "Net Returns, Net Present Value and Equivalent Annual Annuity", style:'subheader'},
            '\n\n',
            {image: net_returns_present, fit: [500, 500], alignment: 'center'},
            '\n\n',
            {table: {headerRows: 1,
                     widths: ["40%","auto","auto","auto"],
                     body: net_returns_present_table},
             layout: 'lightHorizontalLines'},
            {text:"", pageBreak:'after'},

            /*IRR Chart and Table*/
            {text: "Internal Rate of Return", style:'subheader'},
            '\n\n',
            {image: internal_rate_of_return, width: 400, alignment: 'center'},
            '\n\n',
            {table: {headerRows: 1,
                     widths: ["65%","35%"],
                     alignment : 'center',
                     body: irr_table},
             layout: 'lightHorizontalLines'},
            {text:"", pageBreak:'after'},

            /*Cash Flow Breakeven Chart and Table*/
            {text: "Cash Flow Breakeven", style:'subheader'},
            '\n\n',
            {image: cash_flow_breakeven, width: 400, alignment: 'center'},
            '\n\n',

            '\n',
            {table: {headerRows: 1,
                     widths: ['auto', '*', '*'],
                     body: cash_flow_breakeven_table},
                     layout: {
                       hLineWidth: function (i, node) {
              				   if(i === 0 || i === node.table.body.length) return 0;
              				   if(i === 2) return 2;
              				   else return 1;
              				 },
              				 vLineWidth: function (i, node) {
              					 return 0;
              				 },
              				 hLineColor: function (i, node) {
              				   if(i === 1 || i === 2) return 'black';
              				   else return 'grey';
              				 },
              				 vLineColor: function (i, node) {
              					 return 'white'
              				 },
              			}
            },
            {text:"", pageBreak:'after'},

            /*Net Return Chart*/
            {text: "Net Returns for Plans by Period", style:'table_head'},
            '\n\n',
            {image: net_returns_graph, width: 400, alignment: 'center'},
            '\n\n',
            {table: {headerRows: 1,
                     widths: net_returns_table_width,
                     body: net_returns_table},
             layout: 'lightHorizontalLines'},
            {text:"", pageBreak:'after'},

            /*List budget details*/
            budget_tables,
          ],
          pageMargins: [40,80,40,40],

          footer: function(page, pages) {
             return { alignment:'center',
                      text: [{text: page.toString(), italics: true},
                              ' of ',
                             {text: pages.toString(), italics: true}]};
           },

          styles: {
            header: {
              fontSize: 18,
              bold: true,
              italics:true,
              lineHeight:1.5,
              decoration: 'underline',
              alignment : 'center',
            },
            subheader: {
        			fontSize: 16,
        			bold: true,
        			margin: [0, 10, 0, 5],
              decoration: 'underline',
        		},
            space:{
              lineHeight:1.5,
            },
            table_heading:{
              bold:true,
              fontSize:13,
            },
            table_head:{
              bold:true,
              lineHeight:1.5,
              decoration: 'underline',
              fontSize:14.5,

            },
          }
        };
        pdfMake.createPdf(doc_definition).download(scenario.title+'.pdf');
        a=0;
        b=0;
        c=0;
       p=0;
      }

      function ListPlans(plan_info, budget_tables, net_returns_present_table, irr_table, cash_flow_breakeven_table, net_returns_table, net_returns_table_width) {

          var plan_info_table_width = "";
          var margin_table1 = [];
          var width_set_table2 = "";
          var margin_table2 = [];
          var plan_title = "";

          // var annual_comparitor=0;

          var columns_1=[{text:"Year", alignment : 'center'}];
          var widths=["20%"];
          var currency_width=[];
          var currency_column_header=[];

          var compare_year=1;
          var year = 1;
          var net_returns_table_header = [{text: "Period", alignment:"left"}];
          var p=0
          angular.forEach($ctrl.plans, function(plan, index){

            /*set table margin and width
            if(plan.title.length > 18){
              plan_info_table_width = ["40%","auto","auto","auto","auto"];
              margin_table1 = [280,0,0,5];

              width_set_table2=["40%","auto","auto","auto"];
              margin_table2=[107,0,0,5];

            }else{
              if (plan_info_table_width[0] != "40%" && width_set_table2[0] != "40%"){
                plan_info_table_width=["30%","*","*","*","*"];
                margin_table1 = [290,0,0,5];

                width_set_table2=["30%","auto","auto","auto"];
                margin_table2=[50,0,0,5];
              }
            }*/

            /*irr (Internal Rate of Return)*/
            c=c+1;
            irr_table.push([{text:"Plan"+c+": "+plan.title, alignment:"left"},
                            {text:plan.internal_rate_of_return + "%", alignment:"right"}]);

            /*plan info*/
            plan_info.push(PlanInfo(plan));


            // what is this for?
            /*
            columns_1.push({text:plan.title,alignment:'left'});
            widths.push("*");

            currency_width.push("5%","8%","8%","8%","10%","17.5%");

            currency_column_header.push([{text:"Period", alignment : 'center'},
                                        {text:"Annual Returns", alignment : 'center'},
                                        {text:"Annual Cost", alignment : 'center'},
                                        {text:"Annual Net Returns", alignment : 'center'},
                                        {text:"Present Value", alignment : 'center'},
                                        {text:"Accumulated Net Returns", alignment : 'center'}]);
            */

            /* List All Budgets in This Plan*/

            ListPlanBudgets(budget_tables, plan, year,p);
            p++;

            /*Net Returns Present Table*/
            net_returns_present_table.push( NetReturnsPresentTable(plan) );


            // What's this for?
            /*if (compare_year < year){
                budget_year = budget_year;
                compare_budget_year=budget_year;
                budget_year="";
            }

            compare_year = year;*/


            /*Cash Flow Breakeven Table*/
            cash_flow_breakeven_table.push([{text: "Plan"+(index+1)+": "+plan.title, alignment:"left"},
                                            {text: plan.cash_flow_total_breakeven, alignment:"right"},
                                            {text: plan.cash_flow_breakeven, alignment:"right"}]);
            // for Net Returns Table
            net_returns_table_header.push({text: "Plan "+(index+1), alignment:"left"});
            net_returns_table_width.push('*');
            $ctrl.longestTotalPeriod = Math.max($ctrl.longestTotalPeriod, plan.net_returns_over_time.length);

            // what are these for?
            /*budget_tables.pop();
            budget_tables.pop();
            budget_tables.pop();*/

            // reset variables
            year = 1;

          });
          p=0;

          net_returns_table.push(net_returns_table_header);

      }
      var a =0;
      var b =0;
      var c =0;
      var p=0;
      function PlanInfo(plan) {

        var included_cash_flow, plan_beginning_investment_value, plan_end_investment_value, plan_discount_rate;

        if(plan.use_investment_values == true) {
          included_cash_flow = "Yes\n";
        } else {
          included_cash_flow = "No\n";
        }

        if(plan.beginning_investment<0) {
          plan_beginning_investment_value = "-$" + Math.abs(plan.beginning_investment);
        } else {
          plan_beginning_investment_value = "$" + plan.beginning_investment;
        }

        if(plan.ending_investment<0) {
          plan_end_investment_value = "-$" + Math.abs(plan.ending_investment);
        } else {
          plan_end_investment_value = "$" + plan.ending_investment;
        }

        plan_discount_rate = plan.discount_rate + "%";

        a=a+1;
        return [{text:"Plan"+a+": "+plan.title, alignment:"left"},
                {text:plan_discount_rate,alignment:"right"},
                {text:numberWithSpaces(plan_beginning_investment_value), alignment:"right"},
                {text:numberWithSpaces(plan_end_investment_value),alignment:'right'},
                {text:included_cash_flow,alignment:'left'}];

      }
      function numberWithSpaces(x) {
                  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }


      function NetReturnsPresentTable(plan) {

        var net_returns, net_present_value, equivalent_annual_annuity;

        if(plan.net_returns_with_inflation < 0) {
          net_returns = "-$" + Math.abs(plan.net_returns_with_inflation.toFixed(2));
        } else {
          net_returns = "$" + plan.net_returns_with_inflation.toFixed(2);
        }
        if(plan.net_present_value < 0) {
          net_present_value = "-$" + Math.abs(plan.net_present_value.toFixed(2));
        } else {
          net_present_value = "$" + plan.net_present_value.toFixed(2);
        }
        if(plan.equivalent_annual_annuity < 0) {
          equivalent_annual_annuity = "-$" + Math.abs(plan.equivalent_annual_annuity.toFixed(2));
        } else {
          equivalent_annual_annuity = "$" +  plan.equivalent_annual_annuity.toFixed(2);
        }

        /*
        if(net_returns_with_inflation_difference == 0 && net_present_value_difference == 0 && equivalent_annual_annuity_difference == 0){
          net_returns_with_inflation_difference = plan.net_returns_with_inflation.toFixed(2);
          net_present_value_difference = plan.net_present_value.toFixed(2);
          equivalent_annual_annuity_difference = plan.equivalent_annual_annuity.toFixed(2);
        }else {
          net_returns_with_inflation_difference = net_returns_with_inflation_difference - plan.net_returns_with_inflation.toFixed(2);
          net_present_value_difference = net_present_value_difference - plan.net_present_value.toFixed(2);
          equivalent_annual_annuity_difference = equivalent_annual_annuity_difference - plan.equivalent_annual_annuity.toFixed(2);
          net_present_value_difference=net_present_value_difference.toFixed(2);
        }*/
        b=b+1;
        return [{text:"Plan"+b+": "+plan.title, alignment:"left"},
                {text:numberWithSpaces(net_returns), alignment:"right"},
                {text:numberWithSpaces(net_present_value), alignment:"right"},
                {text:numberWithSpaces(equivalent_annual_annuity), alignment:"right"}];
      }

      function NetReturnsTable(net_returns_table) {
        var plan_len = $ctrl.plans.length;
        var period, i;

        for(period = 0; period < $ctrl.longestTotalPeriod; period++){

          var row = [];
          row.push({text: "Period "+period, alignment:"left"});

          for(i = 0; i < plan_len; i++) {
            if($ctrl.plans[i].net_returns_over_time[period] != undefined && $ctrl.plans[i].net_returns_over_time[period].net_return.toFixed(2) > 0) {
              row.push({text: numberWithCommas($ctrl.plans[i].net_returns_over_time[period].net_return.toFixed(2)), alignment:"right"});
            } else if ($ctrl.plans[i].net_returns_over_time[period] != undefined && $ctrl.plans[i].net_returns_over_time[period].net_return.toFixed(2) < 0) {
              row.push({text: ("-$" + Math.abs($ctrl.plans[i].net_returns_over_time[period].net_return.toFixed(2))), alignment:"right"});
            }else {
              row.push({text: "$0.00", alignment:"right"});
            }
          }

          net_returns_table.push(row);
        }
      }

      function ListPlanBudgets(budget_tables, plan, year,p) {

        var annual_returns="";
        var annual_cost = "";
        var accumulated_net_returns = 0;
        var accumulated_net_returns_value="";
        var budget_year="";
        var budget_period="";
        var budget_names="";
        var budget_unit ="";
        var budget_length_time ="";
        var budget_time_period ="";
        var budget_space_allocation ="";
        var compare_budget_year;
        var net_value="";
        var plan_budgets="";
        var present_value="";

        var budgets_info = [[{text:"Budget Name", alignment: 'left',style:"table_heading"},
                             {text:"Unit", alignment: 'left',style:"table_heading"},
                             {text:"Length of time", alignment: 'left',style:"table_heading"},
                             {text:"Time Period", alignment: 'left',style:"table_heading"},
                             {text:"Space Allocation", alignment: 'left',style:"table_heading"}]];

        var budgets_money = [[{text:"Year", alignment: 'left',style:"table_heading"},
                              {text:"Annual Returns", alignment: 'left',style:"table_heading"},
                              {text:"Annual Cost", alignment: 'left',style:"table_heading"},
                              {text:"Annual Net Returns", alignment: 'left',style:"table_heading"},
                              {text:"Present Value", alignment: 'left',style:"table_heading"},
                              {text:"Accumulated Net Returns", alignment: 'left',style:"table_heading"}]];

        plan.plan_budgets.sort (function(a, b){return a.position - b.position});
        angular.forEach(plan.plan_budgets, function(budget, $index) {
          console.log(budget)
          budget_period = year;
          year = year + 1;

          budget_names = budget.title;
          budget_unit = budget.space_units;
          budget_length_time = budget.time_unit;
          budget_time_period = budget.time_period_position;
          budget_space_allocation = budget.total_space_used +"  "+ budget.space_units;

          if(accumulated_net_returns==0){
            accumulated_net_returns = parseFloat(budget.net_returns_with_inflation.toFixed(2));
          }else{
            accumulated_net_returns = parseFloat(accumulated_net_returns) + parseFloat(budget.net_returns_with_inflation.toFixed(2));
          }

          if(budget.net_returns_with_inflation.toFixed(2) < 0){
            net_value = numberWithCommas(budget.net_returns_with_inflation.toFixed(2));
          }else{
            net_value = numberWithCommas(budget.net_returns_with_inflation.toFixed(2));
          }

          if(budget.present_value.toFixed(2)<0){
            present_value = numberWithCommas(budget.present_value.toFixed(2));
          }else{
            present_value = numberWithCommas(budget.present_value.toFixed(2));
          }

          if(budget.return_total_with_inflation.toFixed(2)<0){
            annual_returns = numberWithCommas(budget.return_total_with_inflation.toFixed(2));
          }else{
            annual_returns = numberWithCommas(budget.return_total_with_inflation.toFixed(2));
          }

          if(budget.cost_total_with_inflation.toFixed(2)<0){
            annual_cost = numberWithCommas(budget.cost_total_with_inflation.toFixed(2));
          }else{
            annual_cost = numberWithCommas(budget.cost_total_with_inflation.toFixed(2));
          }

          if(accumulated_net_returns.toFixed(2)<0){
            accumulated_net_returns_value = numberWithCommas(accumulated_net_returns.toFixed(2));
          }else{
            accumulated_net_returns_value = numberWithCommas(accumulated_net_returns.toFixed(2));
          }

          budgets_info.push([{text:budget_names, alignment: 'left'},
                             {text:budget_unit, alignment: 'left'},
                             {text:budget_length_time, alignment: 'left'},
                             {text:budget_time_period, alignment: 'right'},
                             {text:budget_space_allocation, alignment : 'right'}]);

          budgets_money.push([{text:budget_period, alignment: 'left'},
                                {text:annual_returns, alignment: 'left'},
                                {text:annual_cost, alignment: 'right'},
                                {text:net_value, alignment: 'right'},
                                {text:present_value, alignment: 'right'},
                                {text:accumulated_net_returns_value, alignment: 'right'}]);

        });

        console.log($ctrl.plans)
        console.log(plan.title)

        budget_tables.push({text:"Plan "+(p+1)+": "+ plan.title, style:'subheader'},
                           "\n"
                         );

          budget_tables.push({text:"Discount rate used in this plan to calculate present values = " + plan.discount_rate+"%"});


      budget_tables.push({text:"Budgets Used:",style:'subheader'},
                                            "\n"
                                          );
        budget_tables.push({
          table:{
            widths: ["40%","10%","*","*","*"],
            headerRows: 1,
            body: budgets_info,
          },
          layout: 'lightHorizontalLines'
        });

        budget_tables.push("\n\n",
                           {text:"Net Returns and Present Value by Years",style:"subheader"},
                           "\n",
                           {text:"Plan: " + plan.title, style:'table_head'},
                           "\n");

        budget_tables.push({
          table:{
            widths: ["auto","auto","auto","auto","auto","auto"],
            headerRows: 1,
            body: budgets_money
          },
          layout: 'lightHorizontalLines'

        });
        budget_tables.push({text:"", pageBreak:'after'});



      }

      function numberWithCommas(x) {
        if(x >= null) {
          return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return '-$' + Math.abs(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    }
  })();

$( document ).ready(function() {



 

$('.delete_all').click(function (e) {
    $(this).closest('table').find('td input:checkbox').prop('checked', this.checked);
});

    enterprise = JSON.parse(localStorage.getItem('current_university_enterprise'));
//gross income table
      //put this in a function
 
      removeItem = "--";
      new_enterprise = jQuery.grep(enterprise, function(value) {
        return value != removeItem;
      });

    
      
$("#gross_income tr:last td:eq(0)").text(new_enterprise.slice(2,new_enterprise.length).join(' - '));
$("#enterprise").text("Enterprise: "+enterprise[0] +" - " + enterprise[1]);

  //repopulate the tables by retreiving it from session variable


    var variable_table = JSON.parse(localStorage.getItem("variable_table"));
    var general_table = JSON.parse(localStorage.getItem("general_table"))

     if (general_table){

          var general_total_cost = JSON.parse(localStorage.getItem("general_total_cost"));
          $("#general_total_cost").val(accounting.formatMoney(general_total_cost));
         

          var general_breakeven_yield = JSON.parse(localStorage.getItem("general_breakeven_yield"));
          $("#general_breakeven_yield").val(general_breakeven_yield.toFixed(2));

          

          var general_breakeven_price = JSON.parse(localStorage.getItem("general_breakeven_price"));
          $("#general_breakeven_price").val(accounting.formatMoney(general_breakeven_price));
       
  

 
          var net_return = JSON.parse(localStorage.getItem("general_net_return"));

          $("#general_net_return").val(accounting.formatMoney(net_return));
     


              var general_table = JSON.parse(localStorage.getItem("general_table"));
              $(general_table).each(function(index , value) {

             

                var table_row = ""; 



                
                table_row = "<tr><td>"+value[0]+"</td> <td>"+value[1]+"</td> <td style='text-align:right'>"+value[2]+"</td><td>"+value[3]+"</td><td style='text-align:right'>"+value[4]+"</td><td style='text-align:right'>"+value[5]+"</td></tr>";

                //append table rows to respective table
                $('#general_cost_table tbody:last').append(table_row);
          


              });

     }
        
        

      if (variable_table || fixed_table){

              $(variable_table).each(function(index , value) {

             

                var table_row = ""; 

                table_row = "<tr><td>"+value[0]+"</td> <td>"+value[1]+"</td> <td>"+value[2]+"</td><td>"+value[3]+"</td><td style='text-align:right'>"+value[4]+"</td><td>"+value[5]+"</td><td style='text-align:right'>"+value[6]+"</td><td style='text-align:right'>"+value[7]+"</td></tr>";

                //append table rows to respective table
                $('#variable_table tbody:last').append(table_row);
          


              });

              var fixed_table = JSON.parse(localStorage.getItem("fixed_table"));
              $(fixed_table).each(function(index , value) {

             

                var table_row = ""; 



                
                table_row = "<tr><td>"+value[0]+"</td> <td>"+value[1]+"</td> <td style='text-align:right'>"+value[2]+"</td><td style='text-align:right'>"+value[3]+"</td><td style='text-align:right'>"+value[4]+"</td><td style='text-align:right'>"+value[5]+"</td></tr>";

                //append table rows to respective table
                $('#fixed_table tbody:last').append(table_row);
          


              });


           

              var total_variable_cost = JSON.parse(localStorage.getItem("total_variable_cost"));
              $("#total_variable_cash_cost").val(accounting.formatMoney(total_variable_cost));
             

              var net_return_above_total = JSON.parse(localStorage.getItem("net_return_above_total"));
              $("#net_return_above_total").val(accounting.formatMoney(net_return_above_total));
          

              var total_fixed_cash_cost = JSON.parse(localStorage.getItem("total_fixed_cash_cost"));
              $("#total_fixed_cash_cost").val(accounting.formatMoney(total_fixed_cash_cost));
            

              var total_var_and_fixed = JSON.parse(localStorage.getItem("total_var_and_fixed"));
              $("#total_var_and_fixed").val(accounting.formatMoney(total_var_and_fixed));
         

              var total_var_and_fixed_after_return =  JSON.parse(localStorage.getItem("total_var_and_fixed_after_return"));
              $("#total_var_and_fixed_after_return").val(accounting.formatMoney(total_var_and_fixed_after_return));
             
            
              var breakeven_yield = JSON.parse(localStorage.getItem("breakeven_yield"));
              $("#breakeven_yield").val(breakeven_yield.toFixed(2));
      
            
              var breakeven_price = JSON.parse(localStorage.getItem("breakeven_price"));
              $("#breakeven_price").val(accounting.formatMoney(breakeven_price));
            

      }


function update_variable_price() {

   
       //var variety = $(this).attr("data-variety");
       var breakeven_price = 0;
       var breakeven_yield = 0;
       var final_return_cost = 0; //return after var and fixed cost calculated
       var total_fixed_and_var = 0;
       var fixed_total = 0;
       var var_total = 0; //total for "Total Variable Cost" 
       var TableData = []; //array to add the table rows for session variable
       var total = (parseFloat(quantity) * parseFloat(price)).toFixed(2); //convert to float and format them to 2 decimal places
       var yield = Number($("#gross_income tr:last td:eq(1)").text());
       console.log(yield);
       var price_per_unit = Number($("#gross_income tr:last td:eq(3)").text().replace(/[^0-9\.]+/g,"")); //gettting price per unit from gross income table


  


         
        //put this in a function
        $('#variable_table tr').each(function(row, tr) {

            var number = Number($(tr).find('td:eq(7)').text().replace(/[^0-9\.]+/g,"")); //remove dollar signs and decimal and convert num
            var_total += number;  //iterate though the table add all of the total for each line

            TableData.push([$(tr).find('td:eq(0)').html(),$(tr).find('td:eq(1)').text(), $(tr).find('td:eq(2)').text(), $(tr).find('td:eq(3)').text(), $(tr).find('td:eq(4)').text(), $(tr).find('td:eq(5)').text(), $(tr).find('td:eq(6)').text(), $(tr).find('td:eq(7)').text()]);

        
        });

        $("#total_variable_cash_cost").val(accounting.formatMoney(var_total));
      
        var net_return = Number(localStorage.getItem("general_net_return"));

        var gross_income = Number($("#gross_income tr:last td:eq(4)").text().replace(/[^0-9\.]+/g,""));
        var adjusted_gross_income = gross_income - var_total;
        $("#net_return_above_total").val(accounting.formatMoney(adjusted_gross_income));
      

        //delete the first table row which is blank for some reason
        TableData.shift();


        //fixed_total = Number($("#total_fixed_cash_cost").html().replace(/[^0-9\.]+/g,"")); //get fixed total and convert to num
       fixed_total= Number(JSON.parse(localStorage.getItem("total_fixed_cash_cost")));

        //save info to session var


        localStorage.setItem("variable_table", JSON.stringify(TableData));
        localStorage.setItem("total_variable_cost", JSON.stringify(var_total));
        localStorage.setItem("net_return_above_total", JSON.stringify(adjusted_gross_income));

        //update total var and fixed cost field
        total_fixed_and_var = fixed_total + var_total; //total
        console.log(total_fixed_and_var);
        $("#total_var_and_fixed").val(accounting.formatMoney(total_fixed_and_var));
    

        localStorage.setItem("total_var_and_fixed", JSON.stringify(total_fixed_and_var));

        final_return_cost = gross_income - total_fixed_and_var;
        $("#total_var_and_fixed_after_return").val(accounting.formatMoney(final_return_cost));


        localStorage.setItem("total_var_and_fixed_after_return", JSON.stringify(final_return_cost));

        breakeven_yield = final_return_cost / price_per_unit;

        if (!breakeven_yield) {  // Matches +0, -0, NaN
          throw new Error('Invalid dividend ' + breakeven_yield);
        }
        $("#breakeven_yield").val(breakeven_yield.toFixed(2));
        localStorage.setItem("breakeven_yield", JSON.stringify(breakeven_yield));

        breakeven_price = final_return_cost / yield;


        
        $("#breakeven_price").val(accounting.formatMoney(breakeven_price));

         if (!breakeven_price) {  // Matches +0, -0, NaN
          throw new Error('Invalid dividend ' + breakeven_price);
        }
      
        localStorage.setItem("breakeven_price", JSON.stringify(breakeven_price));


  }

function update_fixed_price(){

        var final_return_cost = 0; //return after var and fixed cost calculated
        var total_fixed_and_var = 0;
        var var_total = 0;
        var fixed_total = 0; //total for "Total Variable Cost" 
        var TableData = [];
    
        var breakeven_price = 0;
        var breakeven_yield = 0;
        var yield = Number($("#gross_income tr:last td:eq(1)").text());
        var price_per_unit = Number($("#gross_income tr:last td:eq(3)").text().replace(/[^0-9\.]+/g,"")); //gettting price per unit from gross income table


     
        //updating the breakeven cost and yield also session var
         $("#fixed_table tr").each(function(row, tr) {
        
            TableData.push([$(tr).find('td:eq(0)').html(),$(tr).find('td:eq(1)').text(), $(tr).find('td:eq(2)').text(), $(tr).find('td:eq(3)').text(), $(tr).find('td:eq(4)').text(), $(tr).find('td:eq(5)').text()]);

            var number = Number($(tr).find('td:eq(5)').text().replace(/[^0-9\.]+/g,"")); //remove dollar signs and decimal and convert num
            fixed_total += number; 



          });



        



        
          $("#total_fixed_cash_cost").val(accounting.formatMoney(fixed_total));
         


          var_total = Number(JSON.parse(localStorage.getItem("total_variable_cost")));

        

          //delete the first table row which is blank for some reason
          TableData.shift();
           localStorage.setItem("fixed_table", JSON.stringify(TableData));

          //localStorage.setItem("fixed_table", JSON.stringify(TableData));
          localStorage.setItem("total_fixed_cash_cost", JSON.stringify(fixed_total));

          total_fixed_and_var = fixed_total + var_total;
          
          var gross_income = Number($("#gross_income tr:last td:eq(4)").text().replace(/[^0-9\.]+/g,""));
          final_return_cost = gross_income - Number(total_fixed_and_var);


          $("#total_var_and_fixed").val(accounting.formatMoney(total_fixed_and_var));
      

          localStorage.setItem("total_var_and_fixed", JSON.stringify(total_fixed_and_var));


          $("#total_var_and_fixed_after_return").val(accounting.formatMoney(final_return_cost));
          
    
       
          localStorage.setItem("total_var_and_fixed_after_return", JSON.stringify(final_return_cost));

          breakeven_yield = final_return_cost / price_per_unit;
          $("#breakeven_yield").val(breakeven_yield.toFixed(2));
          localStorage.setItem("breakeven_yield", JSON.stringify(breakeven_yield));

          breakeven_price = final_return_cost / yield;

          $("#breakeven_price").val(accounting.formatMoney(breakeven_price));
  
          localStorage.setItem("breakeven_price", JSON.stringify(breakeven_price));


  }

function update_general_price(){

     
        var general_total = 0; //total for "Total Variable Cost" 
        var TableData = [];
    
        var breakeven_price = 0;
        var breakeven_yield = 0;
        var yield = Number($("#gross_income tr:last td:eq(1)").text());
        var price_per_unit = Number($("#gross_income tr:last td:eq(3)").text().replace(/[^0-9\.]+/g,"")); //gettting price per unit from gross income table


     
        //updating the breakeven cost and yield also session var
         $("#general_cost_table tr").each(function(row, tr) {
        
            TableData.push([$(tr).find('td:eq(0)').html(),$(tr).find('td:eq(1)').text(), $(tr).find('td:eq(2)').text(), $(tr).find('td:eq(3)').text(), $(tr).find('td:eq(4)').text(), $(tr).find('td:eq(5)').text()]);

            var number = Number($(tr).find('td:eq(5)').text().replace(/[^0-9\.]+/g,"")); //remove dollar signs and decimal and convert num
            general_total += number; 

          });
          TableData.shift();
          localStorage.setItem("general_table", JSON.stringify(TableData));

        
          $("#general_total_cost").val(accounting.formatMoney(general_total));


        
    


          localStorage.setItem("general_total_cost", JSON.stringify(general_total));

          var gross_income = Number($("#gross_income tr:last td:eq(4)").text().replace(/[^0-9\.]+/g,""));
          var net_return = gross_income - general_total;

          localStorage.setItem("general_net_return", JSON.stringify(net_return));
          console.log(net_return);
          
          breakeven_yield = net_return / price_per_unit;

          if ($.isNumeric(breakeven_yield) == false) {  
            breakeven_yield = 0;
          }

          $("#general_breakeven_yield").val(breakeven_yield.toFixed(2));
          localStorage.setItem("general_breakeven_yield", JSON.stringify(breakeven_yield));

          breakeven_price = net_return / yield;

          if ($.isNumeric(breakeven_price) == false) {  
            breakeven_price = 0;
          }
          $("#general_breakeven_price").val(accounting.formatMoney(breakeven_price));
   
          localStorage.setItem("general_breakeven_price", JSON.stringify(breakeven_price));

            $("#general_net_return").val(accounting.formatMoney(net_return));
        


  }


  //event where to get add button inside fixed cost modal pop up
  $(document).on("click", ".add_fixed_dialog", function() {


       
    
        var category = $("#fixed_category").val();
        var quantity = $("#fixed_quantity").val(); 
        var price = $("#fixed_price").val(); 
        var unit = $("#fixed_unit").val(); 
        var total = (parseFloat(quantity) * parseFloat(price)).toFixed(2);
       



        $('#fixed_table > tbody:last').append('<tr> <td><input type="checkbox" class="delete"></td> <td>'+category+'</td> <td style="text-align:right">'+parseFloat(quantity).toFixed(2)+'</td> <td>'+unit+'</td> <td style="text-align:right">'+accounting.formatMoney(price)+'</td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td></tr>');

        update_fixed_price();

    
  });

        //event where to get add button inside fixed cost modal pop up
    $(document).on("click", ".gold_standard_dialog", function() {


           
        
        var category = $("#gold_standard option:selected").text();
        var quantity = $("#gold_standard_quantity").val(); 
        var price = $("#gold_standard_price").val(); 
        var unit = $("#gold_standard_unit").val(); 
        var total = (parseFloat(quantity) * parseFloat(price)).toFixed(2);
       



        $('#general_cost_table > tbody:last').append('<tr> <td><input type="checkbox" class="delete"></td> <td>'+category+'</td> <td style="text-align:right">'+parseFloat(quantity).toFixed(2)+'</td> <td style="text-align:right">'+unit+'</td> <td style="text-align:right">'+accounting.formatMoney(price)+'</td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td></tr>');

            update_general_price();

    
    });



  //event where to get add button inside fixed cost modal pop up
  $(document).on("click", ".add_var_dialog", function() {


    
   var category = $("#category").val();
     var sub_category = $("#sub_category").val(); 
     var item = $("#item").val(); 
     var quantity = $("#quantity").val(); 
     var price = $("#price").val(); 
     var unit = $("#unit").val(); 
     var total = (parseFloat(quantity) * parseFloat(price)).toFixed(2); //convert to float and format them to 2 decimal places
 

      $('#variable_table > tbody:last').append('<tr> <td><input type="checkbox" class="delete"></td> <td>'+category+'</td><td>'+sub_category+'</td><td>'+item+'</td> <td style="text-align:right">'+parseFloat(quantity).toFixed(2)+'</td> <td style="text-align:right">'+unit+'</td> <td style="text-align:right">'+accounting.formatMoney(price)+'</td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td></tr>');


       update_variable_price();
  
  });


//ajax for getting sub items like fertilizers
$("#item").remoteChained({parents : "#sub_category",url : "/get_item/"});

//function to delete items from the checkboxes
 $(".delete_fixed_cost").on("click", function() {
    $('#fixed_table tr').has('input[class="delete"]:checked').remove();
     update_fixed_price();

    });

 $(".delete_variable_cost").on("click", function() {
    $('#variable_table tr').has('input[class="delete"]:checked').remove();
     update_variable_price();

    });

  $(".delete_general_cost").on("click", function() {
    $('#general_cost_table tr').has('input[class="delete"]:checked').remove();
     update_general_price();

    });

}); //end doc ready

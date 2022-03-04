$(function() {

    retrieve_from_local_storage();

    $(document).on('click', "a.show-panel", function() {
     $("#category").val($(this).data("name")).trigger("change");
 });

    // This is where you can add new fields
    var income_names = [
    "Sales of livestock, produce, grains and other products",
    'Cooperative distributions received',
    'Agricultural program payments',
    'Commodity Credit Corporation',
    'Crop insurance proceeds & federal crop disaster payments',
    'Specified custom hire (machine work) income',
    'Other income'
    ];

    // This is where you can add new fields
    var expense_names = [
    'Cost of goods sold',
    'Car and truck expenses',
    'Chemicals',
    'Conservation expenses',
    'Custom hire (machine work)',
    'L-T asset replacement and section 179 expense',
    'Employee benefit programs',
    'Feed',
    'Fertilizers and lime',
    'Freight and trucking',
    'Gasoline, fuel, and oil',
    'Insurance (other than health)',
    'Interest on loans and mortgages',
    'Labor hired (less employment credits)',
    'Pension and profit-sharing plans',
    'Rent and leases: Machinery, equipment and  vehicles',
    'Rent and leases: Land and animals',
    'Repairs and maintenance',
    'Seeds and plants',
    'Storage and warehousing',
    'Supplies',
    'Property taxes',
    'Utilities',
    'Veterinary, breeding, and medicine',
    'Other expenses'
    ];

    // "#income-panel-5"
    var panel_names = [];
    // {"#income-panel-5-total": 'Crop insurance proceeds & federal crop disaster payments'}
    var label = {};
    // {"#income-panel-5-total": "income-5"}
    var select = {};
    // add incomes
    for (var i = 1; i <= income_names.length; i++){
        panel_names.push("#income-panel-" + i);
        label["#income-panel-" + i + "-total"] = income_names[i-1]; //array is 0 indexed
        select["#income-panel-" + i + "-total"] = "income-" + i;
    }
    // add expenses
    for (var i = 1; i <= expense_names.length; i++){
        panel_names.push("#expense-panel-" + i);
        label["#expense-panel-" + i + "-total"] = expense_names[i-1]; //array is 0 indexed
        select["#expense-panel-" + i + "-total"] = "expense-" + i;
    }

    // "income-panel-5-total"
    var total_panel_names = $.map(panel_names, function(panel_name){
        return panel_name + "-total";
    });


    $.each(total_panel_names, function(i, val) {

        total = $(val).data('total');

        if (total > 0){
          $("#running_total tbody").append('<tr> <td><a class="show-panel" href="#" data-name='+select[val]+'>'+label[val]+'</a></td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td> </tr>');
          $("#expense_total tbody").append('<tr> <td><a class="show-panel" href="#" data-name='+select[val]+'>'+label[val]+'</a></td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td> </tr>');

      }
  });


  function retrieve_from_local_storage(){

  var total_body = ["#income-panel-1", "#income-panel-2", "#income-panel-3", "#income-panel-4", "#income-panel-5", "#income-panel-6", "#income-panel-7", "#expense-panel-1", "#expense-panel-2", "#expense-panel-3", "#expense-panel-4", "#expense-panel-5", "#expense-panel-6", "#expense-panel-7", "#expense-panel-8", "#expense-panel-9", "#expense-panel-10", "#expense-panel-11", "#expense-panel-12", "#expense-panel-13", "#expense-panel-14", "#expense-panel-15", "#expense-panel-16", "#expense-panel-17", "#expense-panel-18", "#expense-panel-19", "#expense-panel-20", "#expense-panel-21", "#expense-panel-22", "#expense-panel-23", "#expense-panel-24"]

  var total_panel = ["#income-panel-1-total", "#income-panel-2-total", "#income-panel-3-total", "#income-panel-4-total", "#income-panel-5-total", "#income-panel-6-total", "#income-panel-7-total", "#expense-panel-1-total", "#expense-panel-2-total", "#expense-panel-3-total", "#expense-panel-4-total", "#expense-panel-5-total", "#expense-panel-6-total", "#expense-panel-7-total", "#expense-panel-8-total", "#expense-panel-9-total", "#expense-panel-10-total", "#expense-panel-11-total", "#expense-panel-12-total", "#expense-panel-13-total", "#expense-panel-14-total", "#expense-panel-15-total", "#expense-panel-16-total", "#expense-panel-17-total", "#expense-panel-18-total", "#expense-panel-19-total", "#expense-panel-20-total", "#expense-panel-21-total", "#expense-panel-22-total", "#expense-panel-23-total", "#expense-panel-24-total"]


      //repopulating panel current list of items
      $(total_body).each(function(i, j) {

         if(localStorage.getItem(j) == '""' || !localStorage.getItem(j)){

          $(j).html("<li class='placeholder'>Drag your cost items above or below here.</li>");

         }else{


              $(j).html(JSON.parse(localStorage.getItem(j)));

      }

      });

    //repopulating panel running total
    $(total_panel).each(function(i, j) {

       if(!localStorage.getItem(j) || JSON.parse(localStorage.getItem(j)) == 0){

          $(j).html("Total: $0");

         }else{

              $(j).data('total', JSON.parse(localStorage.getItem(j)));
              $(j).html("Total: $"+$(j).data('total'));

            $("#items tr").remove();


      }

      });


  //repopulating left tables of draggables
  if (localStorage.getItem("item")){
        table = JSON.parse(localStorage.getItem("item"));

       $("#items tr").remove();


      $(table).each(function(row, tr) {


       $('#items tbody').append(tr);


      });


      }

}

    function save_to_storage(){
        var items = [];
        var income_total = 0
        var expense_total = 0

        $.each(total_panel_names, function(i, val) {
            localStorage.setItem(val, JSON.stringify($(val).data('total')));
            var str = val
            var is_inc = str.match(/income/g);
            var is_exp = str.match(/expense/g);
            if(is_inc){
              income_total += +$(val).data('total')
            }
            if(is_exp){
              expense_total += +$(val).data('total')
            }
            localStorage.setItem("income_total", income_total)
            localStorage.setItem("expense_total", expense_total)

        });


        $("#items tr").each(function(row, tr) {
            items.push([$(tr)[0].outerHTML]);
        });

        localStorage.setItem("item",JSON.stringify(items));

        $(panel_names).each(function(i, j) {
            localStorage.setItem(j,JSON.stringify($(j).html()));

        });

        //panelbody
    }

    function running_total(){

        //This feels like a bandaid, subject for cleanup in the future.
        $("#running_total > tbody > tr").remove();
        $("#expense_total > tbody > tr").remove();

        $.each(total_panel_names, function(i, val) {

            total = $(val).data('total');

            if (total > 0){
                var str = val
                var is_inc = str.match(/income/g);
                var is_exp = str.match(/expense/g);

                //Append new items to corresponding table
                if(is_inc){
                  $("#running_total tbody").append('<tr> <td><a class="show-panel" href="#" data-name='+select[val]+'>'+label[val]+'</a></td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td> </tr>');
                }
                if(is_exp){
                  $("#expense_total tbody").append('<tr> <td><a class="show-panel" href="#" data-name='+select[val]+'>'+label[val]+'</a></td> <td style="text-align:right">'+accounting.formatMoney(total)+'</td> </tr>');
                }

                //Update totals on corresponding tables
                document.getElementById('income_sum').innerHTML = accounting.formatMoney(localStorage.getItem("income_total"));
                document.getElementById('expense_sum').innerHTML = accounting.formatMoney(localStorage.getItem("expense_total"));
            }
        });

    }

    //hide all panel first
    $("#category option").each(function(){
        var option = $(this).val();
        $('#'+option).hide();
        // Add $(this).val() to your list
    });

    $("#category").change(function() {

        var selected = $('option:selected', this).val()
        $('#'+selected).show();


        var not_selected = $('option:not(:selected)', this);

        not_selected.each(function() {

            $('#'+$(this).val()).hide();

        });
    });



    var panel = panel_names.join(", ");

    $("#items tbody").sortable({connectWith:panel, items: 'tr.success'});


    for (var i in panel_names){
        $(panel_names[i]).sortable({connectWith: "#items tbody",  update: function( event, ui ) {
            $( this ).find( ".placeholder" ).remove();
            // figure out which panel this is
            var panel_name = "#" + $( this ).attr("id");
            var listItems = $(panel_name + " tr");
            var total = 0;
            listItems.each(function() {
                total = total + parseFloat(Math.abs($(this).attr("data-amount").replace(/[^0-9\.]+/g,"")));
                // and the rest of your code
            });

            $(panel_name + "-total").html("Total: "+accounting.formatMoney(total));
            $(panel_name + "-total").data('total', total.toFixed(2));
            save_to_storage();

            running_total();
        }});
    }

});

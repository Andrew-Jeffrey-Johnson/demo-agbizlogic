$(document).ready(function() {

repopulate_table_from_local();

check_table();

$("#add_crop").prop('disabled', true);
var list_of_enterprises = JSON.parse(localStorage.getItem("current_livestock_enterprise"));

try {

    var len = list_of_enterprises.length;
    if (len > 0){

        $("#next").prop('disabled', false);


      }else{

          $("#next").prop('disabled', true);
      }
}
catch(err) {

    $("#next").prop('disabled', true);
    

}

$("form").submit(function (e) {

    

    enterprise = JSON.parse(localStorage.getItem("current_livestock_enterprise"));
    cleaned_enterprise = []


    $(enterprise).each(function(index , value) {

       value.shift(); //remove the checkbox
       cleaned_enterprise.push(value);


    });

 
  
  
    var formId = this.id;  // "this" is a reference to the submitted form
     $.ajaxSetup({ 
             beforeSend: function(xhr, settings) {
                 function getCookie(name) {
                     var cookieValue = null;
                     if (document.cookie && document.cookie != '') {
                         var cookies = document.cookie.split(';');
                         for (var i = 0; i < cookies.length; i++) {
                             var cookie = jQuery.trim(cookies[i]);
                             // Does this cookie string begin with the name we want?
                         if (cookie.substring(0, name.length + 1) == (name + '=')) {
                             cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                             break;
                         }
                     }
                 }
                 return cookieValue;
                 }
                 if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                     // Only send the token to relative URLs i.e. locally.
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                 }
             } 
            })



            $.ajax({



            url: "/save_livestock_enterprise/",
            type: "POST",
            data: {enterprise:JSON.stringify(enterprise)},
            dataType: 'json',
            success: function(data) {

              console.log("Success!")

            } //function    

            }); //ajax

  
});


function check_table(){




  if($('#current_livestock_enterprise > tbody > tr').length == 0){

    $('#current_enterprise').hide();
     $('#current_enterprise_button').hide();

  }else{

     $('#current_enterprise').show();
    $('#current_enterprise_button').show();
  }

}


//retrieve table from session variable
function repopulate_table_from_local(){
        
      var table = JSON.parse(localStorage.getItem("current_livestock_enterprise"));
      $(table).each(function(index , value) {

        var table_row = ""; 

        //iterate through each td for a row break, wrap each array index in td since var and fixed have different length
        $(value).each(function(i,j) {

          table_row += "<td>"+j+"</td>";

        });

        table_row = "<tr>"+table_row+"</tr>";

        //append table rows to respective table
        $('#current_livestock_enterprise > tbody:last').append(table_row);
    


      });


}

//function to delete items from the checkboxes
 $("#delete_item").on("click", function() {
 
      $('#current_livestock_enterprise tr').has('input[class="delete"]:checked').remove();
      save_enterprise();

    });


//save enterprise to a session variable
function save_enterprise(){
        
        variable = [];


        $("#current_livestock_enterprise tr").each(function(row, tr) {

          if ($(tr).find('td:eq(6)').text() != ""){

               variable.push([$(tr).find('td:eq(0)').html(),$(tr).find('td:eq(1)').text(), $(tr).find('td:eq(2)').text(), $(tr).find('td:eq(3)').text(), $(tr).find('td:eq(4)').text(), $(tr).find('td:eq(5)').text(), $(tr).find('td:eq(6)').text()]);

          }else{

               variable.push([$(tr).find('td:eq(0)').html(),$(tr).find('td:eq(1)').text(), $(tr).find('td:eq(2)').text(), $(tr).find('td:eq(3)').text(), $(tr).find('td:eq(4)').text(), $(tr).find('td:eq(5)').text()]);

          }

         

      
        });



        variable.shift();

 
        localStorage.setItem("current_livestock_enterprise", JSON.stringify(variable));
        location.reload();
        


}
// delay for showing drop down
var delay = 0;

//Jquery select chained drop down functionality


 $("#id_step6-select_Livestock_1").remoteChained({parents : "#id_step6-select_Livestock_0",url : "/select/"});
 $("#id_step6-select_Livestock_2").remoteChained({parents : "#id_step6-select_Livestock_1",url : "/select/"});
 $("#id_step6-select_Livestock_3").remoteChained({parents : "#id_step6-select_Livestock_2",url : "/select/"});
 $("#id_step6-select_Livestock_4").remoteChained({parents : "#id_step6-select_Livestock_2",url : "/select/"});
 $("#id_step6-select_Livestock_5").remoteChained({parents : "#id_step6-select_Livestock_3",url : "/select/"});


$("#div_id_step6-select_Livestock_1").hide();
$("#div_id_step6-select_Livestock_2").hide();
$("#div_id_step6-select_Livestock_3").hide();
$("#div_id_step6-select_Livestock_4").hide();
$("#div_id_step6-select_Livestock_5").hide();
$("#div_id_step6-select_Livestock_6").hide();
$("#add_livestock").hide();
//initializing select2 drop down library
$(".livestock-0-basic-single").select2({width: '50%', placeholder: '-Select-'});
// $(".livestock-0-basic-single").prepend("<option value='first' disabled selected>Select your option</option");
$(".livestock-0-basic-single").select2("val", "");
$(".livestock-1-basic-single").select2({width: '50%', placeholder: '-Select-'});
$(".livestock-2-basic-single").select2({width: '50%', placeholder: '-Select-'});
$(".livestock-3-basic-single").select2({width: '50%', placeholder: '-Select-'});
$(".livestock-4-basic-single").select2({width: '50%', placeholder: '-Select-'});
$(".livestock-5-basic-single").select2({width: '50%', placeholder: '-Select-'});
$(".livestock-market").select2({width: '50%'});

$('#id_step6-select_Livestock_0').change(function() {

  $("#div_id_step6-select_Livestock_1").show(delay);
  $("#div_id_step6-select_Livestock_2").show(delay);
  $("#div_id_step6-select_Livestock_3").show(delay);
  $("#div_id_step6-select_Livestock_4").hide(delay);
  $("#div_id_step6-select_Livestock_5").hide(delay);
  $("#div_id_step6-select_Livestock_6").show(delay);
  $("#add_livestock").show();

});

  //event where to get add button inside fixed cost modal pop up

 $(document).on("click", "#add_livestock", function() {

  if ($(".livestock-0-basic-single").val() == "Beef Cattle" ){

          enterprise = "Livestock"

          cls = $(".livestock-0-basic-single").val();
          type = $(".livestock-1-basic-single").val();
          breed = $(".livestock-2-basic-single").val();
          market = $(".livestock-3-basic-single").val();
          retail_market = $(".livestock-market").val();
          $(retail_market).each(function(index,value){

          $('#current_livestock_enterprise tr:last').after('<tr> <td><input type="checkbox" class="delete"></td>   <td>'+enterprise+'</td> <td>'+cls+'</td> <td>'+type+'</td> <td>'+value+'</td></tr>');
    
            
          });

          save_enterprise();
          $(".livestock-0-basic-single").select2("val", "--");

          $('.alert').show().delay(3000).fadeOut();
        
    

    }else if ($(".livestock-0-basic-single").val() == "Goats"){


          enterprise = "Livestock"

          cls = $(".livestock-0-basic-single").val();
          type = $(".livestock-1-basic-single").val();
          breed = $(".livestock-2-basic-single").val();
          market = $(".livestock-3-basic-single").val();
          sub_market = $(".livestock-5-basic-single").val();
          retail_market = $(".livestock-market").val();
          $(retail_market).each(function(index,value){

          $('#current_livestock_enterprise tr:last').after('<tr> <td><input type="checkbox" class="delete"></td>   <td>'+enterprise+'</td> <td>'+cls+'</td> <td>'+breed+'</td> <td>'+market+'</td>  <td>'+sub_market+'</td> <td>'+value+'</td></tr>');
    
            
          });

          save_enterprise();
          $(".livestock-0-basic-single").select2("val", "--");

          $('.alert').show().delay(3000).fadeOut();
        

   }
   
       
});
    
  });


   

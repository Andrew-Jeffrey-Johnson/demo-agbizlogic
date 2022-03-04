$(document).ready(function() {

repopulate_table_from_local();

check_table();

$("form").submit(function (e) {

    

    enterprise = JSON.parse(localStorage.getItem("current_crop_enterprise"));
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



            url: "/save_crop_enterprise/",
            type: "POST",
            data: {enterprise:JSON.stringify(enterprise)},
            dataType: 'json',
            success: function(data) {

              console.log("Success!")

            } //function    

            }); //ajax

  
});


function check_table(){




  if($('#current_crop_enterprise > tbody > tr').length == 0){

    $('#current_enterprise').hide();
    $('#current_enterprise_button').hide();

  }else{

     $('#current_enterprise').show();
    $('#current_enterprise_button').show();
  }

}


//retrieve table from session variable
function repopulate_table_from_local(){
        
      var table = JSON.parse(localStorage.getItem("current_crop_enterprise"));
      $(table).each(function(index , value) {

        var table_row = ""; 

        //iterate through each td for a row break, wrap each array index in td since var and fixed have different length
        $(value).each(function(i,j) {

          table_row += "<td>"+j+"</td>";

        });

        table_row = "<tr>"+table_row+"</tr>";

        //append table rows to respective table
        $('#current_crop_enterprise > tbody:last').append(table_row);
    


      });


}

//function to delete items from the checkboxes
 $("#delete_item").on("click", function() {
 
      $('#current_crop_enterprise tr').has('input[class="delete"]:checked').remove();
      save_enterprise();
        location.reload();

    });


//save enterprise to a session variable
function save_enterprise(){
        
        variable = [];


        $("#current_crop_enterprise tr").each(function(row, tr) {

       

               variable.push([$(tr).find('td:eq(0)').html(),$(tr).find('td:eq(1)').text(), $(tr).find('td:eq(2)').text(), $(tr).find('td:eq(3)').text(), $(tr).find('td:eq(4)').text(), $(tr).find('td:eq(5)').text()]);

          

         });



        variable.shift();

 
        localStorage.setItem("current_crop_enterprise", JSON.stringify(variable));
        location.reload();
        


}
// delay for showing drop down
var delay = 0;

//Jquery select chained drop down functionality

 $("#id_step5-select_1").remoteChained({parents : "#id_step5-select_0",url : "/select/"});
 $("#id_step5-select_2").remoteChained({parents : "#id_step5-select_1",url : "/select/"});




$("#div_id_step5-select_1").hide();
$("#div_id_step5-select_2").hide();
$("#div_id_step5-select_3").hide();
$("#div_id_step5-select_4").hide();


$("#add_crop").prop('disabled', true);




var list_of_enterprises = JSON.parse(localStorage.getItem("current_crop_enterprise"));

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



//initializing select2 drop down library


// $(".select_0").prepend("<option></option>");
$(".select_0").select2({width: '50%', placeholder: "-Select-"});
$(".select_0").select2("val", ""); 
$(".select_1").select2({width: '50%', placeholder: "-Select-"});
$(".select_2").select2({width: '50%', placeholder: "-Select-"});
$(".select_3").select2({width: '50%', placeholder: "-Select-"});




$('#id_step5-select_0').change(function() {

 
     
      $("#div_id_step5-select_1").show(delay);
      $("#div_id_step5-select_2").show(delay);
      $("#div_id_step5-select_3").show(delay);

      $("#add_crop").prop('disabled', false);

    
     
 
});

// If a type of crop is selected that doesn't have a class, hide the class dropdown
$('#id_step5-select_2').change(function() {
    //check if any options are shown
    if ($("#id_step5-select_2 > option[value!='']").length > 0){
        $('#div_id_step5-select_2').show();
    }else{
        $('#div_id_step5-select_2').hide();
    }
});




  //event where to get add button inside fixed cost modal pop up
  $(document).on("click", "#add_crop", function() {


      enterprise = "Crop"
      cls = $(".select_2").val();
      type = $(".select_0").val()
      commodity = $(".select_1").val();
      market = $(".select_3").val();

          if (!market){

                  alert("Please select a market!");


          }else{


                $(market).each(function(index,value){

                  $('#current_crop_enterprise tr:last').after('<tr> <td><input type="checkbox" class="delete"></td>  <td>'+enterprise+'</td> <td>'+type+'</td> <td>'+commodity+'</td> <td>'+cls+'</td>  <td>'+value+'</td></tr>');
          
                  
                });

                save_enterprise();
                $(".select_0").select2("val", "--");
        
                $('.alert').show().delay(3000).fadeOut();
        }
     

   

      });

 

    
  });


   

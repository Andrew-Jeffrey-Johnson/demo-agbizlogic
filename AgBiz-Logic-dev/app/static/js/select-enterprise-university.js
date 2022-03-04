$(document).ready(function() {


  


$("form").submit(function (e) {

    variable = []
    
  

      enterprise = "Crop";
      cls = $(".select_0").val();
      type = $(".select_1").val()
      commodity = $(".select_2").val();
      market = $(".select_3").val();


      variable = [enterprise, cls, type, commodity, market];

        localStorage.setItem("current_university_enterprise", JSON.stringify(variable));
        //JSON.stringify(variable)

   
  
});

// delay for showing drop down
var delay = 0;

//Jquery select chained drop down functionality

 $("#id_step1-select_Crop_1").remoteChained({parents : "#id_step1-select_Crop_0",url : "/select/", loading : "Loading..." });
 $("#id_step1-select_Crop_2").remoteChained({parents : "#id_step1-select_Crop_1",url : "/select/", loading : "Loading..."});
 




$("#div_id_step1-select_Crop_1").hide();
$("#div_id_step1-select_Crop_2").hide();
$("#div_id_step1-select_Crop_3").hide();



//initializing select2 drop down library


$(".select_0").select2({width: '50%'});
$(".select_0").prepend("<option value='first' disabled selected>Select your option</option");
$(".select_0").select2("val", "first");
$(".select_1").select2({width: '50%'});
$(".select_2").select2({width: '50%'});
$(".select_3").select2({width: '50%'});


  $('#id_step1-select_Crop_0').change(function() {
       $("#div_id_step1-select_Crop_1").show(delay);
       $("#div_id_step1-select_Crop_2").show(delay);
       $("#div_id_step1-select_Crop_3").show(delay);
  });


    
  


        //$("#div_id_step1-select_Crop_4").show(delay);
   







}); //end of document




  


   
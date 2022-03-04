$(document).ready(function(){


  CheckAllocatedValue('line_1_b', 'whole_farm_37', 'unit_37');
  CheckAllocatedValue('line_10', 'whole_farm_7', 'unit_7');
  CheckAllocatedValue('line_11', 'whole_farm_8', 'unit_8');
  CheckAllocatedValue('line_12', 'whole_farm_9', 'unit_9');
  CheckAllocatedValue('line_13', 'whole_farm_10', 'unit_10');
    CheckAllocatedValue('line_14', 'whole_farm_11', 'unit_11');
  CheckAllocatedValue('line_15', 'whole_farm_12', 'unit_12');
    CheckAllocatedValue('line_16', 'whole_farm_13', 'unit_13'); 
  CheckAllocatedValue('line_17', 'whole_farm_14', 'unit_14');
  CheckAllocatedValue('line_18', 'whole_farm_15', 'unit_15');
  CheckAllocatedValue('line_19', 'whole_farm_16', 'unit_16');
  CheckAllocatedValue('line_20', 'whole_farm_17', 'unit_17');
    CheckAllocatedValue('line_21_a', 'whole_farm_18', 'unit_18');
    CheckAllocatedValue('line_22', 'whole_farm_20', 'unit_20');
  CheckAllocatedValue('line_23', 'whole_farm_21', 'unit_21');
  CheckAllocatedValue('line_24_a', 'whole_farm_22', 'unit_22');
  CheckAllocatedValue('line_24_b', 'whole_farm_23', 'unit_23');
  CheckAllocatedValue('line_25', 'whole_farm_24', 'unit_24');
    CheckAllocatedValue('line_26', 'whole_farm_25', 'unit_25');
  CheckAllocatedValue('line_27', 'whole_farm_26', 'unit_26');
    CheckAllocatedValue('line_28', 'whole_farm_27', 'unit_27');   
  CheckAllocatedValue('line_29', 'whole_farm_28', 'unit_28');
  CheckAllocatedValue('line_30', 'whole_farm_29', 'unit_29');
  CheckAllocatedValue('line_31', 'whole_farm_30', 'unit_30');
  CheckAllocatedValue('line_32_a', 'whole_farm_31', 'unit_31');
    CheckAllocatedValue('line_32_b', 'whole_farm_32', 'unit_32');
  CheckAllocatedValue('line_32_c', 'whole_farm_33', 'unit_33');
    CheckAllocatedValue('line_32_d', 'whole_farm_34', 'unit_34');    
  CheckAllocatedValue('line_32_e', 'whole_farm_35', 'unit_35');
  CheckAllocatedValue('line_32_f', 'whole_farm_36', 'unit_36');
  

  function CheckAllocatedValue(str, farm, unit){

    //str is the textbox with the line already

    var list = [];
    var select_list = [];
    var line_value = 0;
    var whole_farm;
    var selected_unit;
    var name;
    name = str + "_";
    
    var regexString = '(step\\d+\\-' + str +'$)'; //regex string for line html name
    var regex = new RegExp(regexString);

    var farmString = '(step\\d+\\-' + farm + '$)'; //get the Whole Farm field
    var farmRegex = new RegExp(farmString);

    var unitString = '(step\\d+\\-' + unit + '$)'; //get the Unit dropdown
    var unitRegex = new RegExp(unitString);

    var inputs = document.getElementsByTagName("input");
    var select = document.getElementsByTagName("select");

    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].name.indexOf(name) > -1) {
        //get the field associated with enterprise 
        //step2-line_1_c_Crops: Food, Feed, Seed, Fiber and Oil

        //list to keep track of all the enterprises associated witn line
      list.push(document.getElementById(inputs[i].id));
      

        }

        if (inputs[i].name.match(regex)){

      //get the schedule_f line dollar value (step2-line_1_c)

      line_value = inputs[i].value.replace(/\,/g,'');
    
    
        }

    

        if (inputs[i].name.match(farmRegex)){

      //get the whole farm html object

      whole_farm = inputs[i];
        }
    }

    //get the unit drop down and find the corresponding one
    for (var i = 0; i < select.length; i++){
      if (select[i].name.match(unitRegex)){

        //get select object
        
        select_list = document.getElementById(select[i].id);
        
        selected_unit = select[i].value; //get inital selected value
      
        select_list.addEventListener("change", function() {
    
          //if changed reread the select value
          selected_unit = select_list.value;

          for(var i = 0; i < inputs.length; i++) {

            if(inputs[i].name.match(farmRegex)){

              whole_farm.value = commaSeparateNumber(line_value);
            }
          
             if(inputs[i].name.indexOf(name) > -1) {
              inputs[i].value = "";

             }  



          }


        }); //end eventlistener

    
        

      } //end if


    } //end for


    
    //get new value if user selects a new unit
  

    
    
  


    for (var i = 0; i < list.length; i++){

      list[i].addEventListener("keyup", function(){

        
            var total = 0;

            if (selected_unit == "A"){
              for (var i = 0; i < list.length; i++){

            
  
            if (list[i].value == ""){
    
              total = total + 0;
            }else{

                  total = total + parseInt(list[i].value.replace(/\,/g,''));
                  
                  if (total > line_value){
           
                    
                  $('#myModal').find('.modal-body').text("You have over allocated this particular income item.");
                $('#myModal').modal('show'); 
                  }
                  
      
            }
              }
           

          
            if (whole_farm){
              whole_farm.value = commaSeparateNumber(line_value - total);
            }
              
          
            }else if (selected_unit == "B"){
            
                

            for (var i = 0; i < list.length; i++){
  
              if (list[i].value == ""){
    
      
                total = total + 0;
              }else{
  
                    total = total + parseInt(list[i].value.replace(/\,/g,''));
                    
      
              }
                }
             
          
                if (total > 100){
  
              $('#myModal').find('.modal-body').text("You have over allocated this particular income item. Make sure your total percent is equal to or under 100 percent.");
              $('#myModal').modal('show'); 
    
                }
          
          

            if (whole_farm){
              whole_farm.value = commaSeparateNumber(Math.trunc(line_value - (line_value * (total / 100)))) ;
            }
          
          }
      
        });
    }//end for

            
  }//function end


  //thousand separated function

  function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }


   
    
  
  
      
  
  

  
});


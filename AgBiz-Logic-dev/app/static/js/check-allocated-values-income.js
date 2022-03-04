$(document).ready(function(){



  CheckAllocatedValue('line_1_c', 'whole_farm_0', 'unit_0');
  CheckAllocatedValue('line_3_b', 'whole_farm_2' , 'unit_2');
  CheckAllocatedValue('line_4_a', 'whole_farm_3', 'unit_3');
  CheckAllocatedValue('line_5_a', 'whole_farm_1', 'unit_1');
  CheckAllocatedValue('line_6_a', 'whole_farm_4', 'unit_4');
  CheckAllocatedValue('line_7', 'whole_farm_5', 'unit_5');
  CheckAllocatedValue('line_8', 'whole_farm_6', 'unit_6');


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

    //get new value if user selects a new unit




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

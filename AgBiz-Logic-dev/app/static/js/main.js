$('.alert').hide();



/*
var barData = {
  labels : ["Plan 1","Plan 2","Plan 3","Plan 4","Plan 5","Plan 6"],
  datasets : [
    {
      fillColor : "#48A497",
      strokeColor : "#48A4D1",
      data : [12456,10479,15324,11300,11400,16350]
    },


  ]
}

var context = document.getElementById('myChart').getContext('2d');
var skillsChart = new Chart(context).Bar(barData);
*/
// hiding and showing primary businesses


var duration = 500;

$('#id_step2-secondary_business_0').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_1').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_2').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_3').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_4').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_5').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_6').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_7').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_8').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_9').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_10').parents('li').hide(); //hide the first checkbox
$('#id_step2-secondary_business_11').parents('li').hide(); //hide the first checkbox
$('label[for="id_step2-secondary_business"]').css('visibility', 'hidden');


$('#id_step2-primary_business').change(function() {
    document.getElementsByClassName('multiple-checkbox')[0].style.visibility='visible';
    var opt = this.options[this.selectedIndex];
    $('li input[type="checkbox"]').prop('disabled', false).filter(function(){
        return opt.value === this.value;
    }).prop({
        'disabled' : true,
        'checked' : false
    });
      $('label[for="id_step2-secondary_business"]').css('visibility', 'visible');
      $('#id_step2-secondary_business_1').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_2').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_3').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_4').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_5').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_6').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_7').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_8').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_9').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_10').parents('li').show(duration); //hide the first checkbox
      $('#id_step2-secondary_business_11').parents('li').show(duration); //hide the first checkbox


});




//function to catch "Enter" and make it return nothing
function stopRKey(evt) {
  var evt = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if ((evt.keyCode == 13 || evt.which == 13) && (node.type=="text"))  {return false;}
}

document.onkeypress = stopRKey;

$( document ).ready(calculateExpenses);
$( document ).ready(calculateIncome);



//form 1040 calculation
function calculateExpenses(){

var $total = $('#id_step3-total_expenses'),
$value = $('.form-control').not("#id_step3-total_expenses");
$value.on('input', function(e) {
        var total = 0;
        $value.each(function(index, elem) {
                if(!Number.isNaN(parseInt(this.value, 10)))
          if(isNaN(this.value)){
        total = total + parseInt(removeCommas(this.value), 10);

          }else{
        total = total + parseInt(this.value, 10);

          }


        });
        $total.val(commaSeparateNumber(total));
    });
}

function calculateIncome(){

  var $total = $('#id_step2-gross_income');
  $value = $('.form-control').not("#id_step2-gross_income, #id_step2-line_1_a, #id_step2-line_1_b, #id_step2-line_3_a, #id_step2-line_4_a, #id_step2-line_5_b, #id_step2-line_6_a");

  $value.on('input', function(e) {
    var total = 0;
    $value.each(function(index, elem) {

      if(!Number.isNaN(parseInt(this.value, 10)))
          if(isNaN(this.value)){
        total = total + parseInt(removeCommas(this.value), 10);

          }else{
        total = total + parseInt(this.value, 10);

          }


    });

    $total.val(commaSeparateNumber(total));
  });

}

function calculateLine(){
   var $total = $('#id_step2-line_1_c');
  $value = $('.form-control').not("#id_step2-gross_income, #id_step2-line_1_c, #id_step2-line_2, #id_step2-line_3_a, #id_step2-line_3_b, #id_step2-line_4_a, #id_step2-line_4_b, #id_step2-line_5_a, #id_step2-line_5_b, #id_step2-line_5_c, #id_step2-line_6_a, #id_step2-line_6_b, #id_step2-line_6_d, #id_step2-line_7, #id_step2-line_8");

 $value.bind('click keyup', function(event) {

          var line_1_a = 0;
          var line_1_b = 0;
          var amount = 0;

         if(!Number.isNaN(parseInt($("#id_step2-line_1_a").val()))){

          line_1_a = parseInt(removeCommas($("#id_step2-line_1_a").val()), 10);
          console.log(line_1_a);

         }else{

          $total.val(0);

         }

        if(!Number.isNaN(parseInt($("#id_step2-line_1_b").val()))){

          line_1_b = parseInt(removeCommas($("#id_step2-line_1_b").val()), 10);
          console.log(line_1_b);

         }else{

         $total.val(0);

      }

      amount = line_1_a - line_1_b;

      $total.val(commaSeparateNumber(amount));

  });

 }



function removeCommas(str) {
    return(str.replace(/,/g,''));
}

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

/* Terms of Service show/hide */

// Toggle on click
$("#terms-link").on("click", function() {

  $("#terms-of-service").toggle();
});
// Close button
$("#close-terms").on("click", function() {

  $("#terms-of-service").toggle();
});

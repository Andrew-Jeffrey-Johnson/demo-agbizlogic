$(document).ready(function(){

  /* Clears field if value is zero */
  $("input[type='number']").focus(function() {
    if ($(this).val() == 0) {
      $(this).val('');
    }
  });

  /* Resets the field to 0 if nothing was entered */
  $("input[type='number']").blur(function() {
    if ($(this).val() == '') {
      $(this).val(0);
    }
  });

  // Live update Whole Farm on allocate field input
  $(".form-control").keyup(function() {

    var allocate_field = $(this).html();
    

    /* Calculate Whole Farm Budget in Allocate */

    var $whole_farm_fields = $(".whole_farm");
    var $schedulef_fields = $(".schedulef");

    $whole_farm_fields.each(function() {

      var $whole_farm_item = $(this);


      $whole_farm_item.html(new_total);

      // console.log($(this).html());
    })

  
  });





  $("input[type='text']").keyup(function(event){
      // skip for arrow keys
      if(event.which >= 37 && event.which <= 40){
          event.preventDefault();
      }
      var $this = $(this);
      var num = $this.val().replace(/,/gi, "").split("").reverse().join("");
      
      var cleaned_num = RemoveRougeChar(num.replace(/(.{3})/g,"$1,").split("").reverse().join(""));
      
      
      
      // the following line has been simplified. Revision history contains original.
      $this.val(cleaned_num);
  });


function RemoveRougeChar(convertString){
    
    
    if(convertString.substring(0,1) == ","){
        
        return convertString.substring(1, convertString.length)            
        
    }
    return convertString;
    
}

});

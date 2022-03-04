$(document).ready(function() {



  $('#other1').editable({


      type: 'text',
      title: 'Specify Line 32a Other Expenses:',
      success: function(response, label) {
          $("#id_step3-other_expense_1").val(label);
      }


   });

   $('#other2').editable({


      type: 'text',
      title: 'Specify Line 32b Other Expenses:',
      success: function(response, label) {
        console.log(label);
          $("#id_step3-other_expense_2").val(label);
      }



   });

   $('#other3').editable({


      type: 'text',
      title: 'Specify Line 32c Other Expenses:',
      success: function(response, label) {
          $("#id_step3-other_expense_3").val(label);
      }


   });

   $('#other4').editable({


      type: 'text',
      title: 'Specify Line 32d Other Expenses:',
      success: function(response, label) {
          $("#id_step3-other_expense_4").val(label);
      }


   });

   $('#other5').editable({


      type: 'text',
      title: 'Specify Line 32e Other Expenses:',
      success: function(response, label) {
          $("#id_step3-other_expense_5").val(label);
      }


   });

   $('#other6').editable({


      type: 'text',
      title: 'Specify Line 32f Other Expenses:',
      success: function(response, label) {
          $("#id_step3-other_expense_6").val(label);
      }


   });





});

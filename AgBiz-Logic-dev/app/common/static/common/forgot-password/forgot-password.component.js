(function() {
  'use strict';

  angular
    .module("commonModule")
    .component("forgotPassword", {
      templateUrl: "/static/common/forgot-password/forgot-password.component.html",
      controller: ForgotPasswordComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ForgotPasswordComponentController.$inject = [
    "$window",
    "userService",
    "modalService",
  ];

  function ForgotPasswordComponentController(
    $window,
    userService,
    modalService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.submit = submit;
    $ctrl.sendVerification = sendVerification;

    // Form
    $ctrl.form = {};
    $ctrl.show_form = false;
    $ctrl.username;
    $ctrl.new_password;
    $ctrl.new_password_confirm;
    $ctrl.code;


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {
      var query_params = parseQueryParams($window.location.search);

      if (query_params["code"] !== undefined) {
        $ctrl.show_form = true;
        $ctrl.code = query_params["code"];
      }
    }


    function submit() {
      if ($ctrl.form.$invalid == false) {
        var user = {
          'username': $ctrl.username,
        };
        userService.setPassword(user, $ctrl.new_password, $ctrl.code)
        .then(function(set_password_response) {
          if (set_password_response !== undefined &&
              set_password_response.data !== undefined) {
            modalService.alert("Password successfully changed!");
            $window.location.href = "/login";
          }
        });
      }
    }


    function sendVerification() {
      var user = {
        'username': $ctrl.username,
      };
      userService.requestPasswordReset(user)
      .then(function(response) {
        modalService.alert("Password reset request sent successfully. Please check your email for the verification link.");
      });
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Returns a map object of the URL query parameters. Cannot use conventional $location.search() because HTML5 mode
        is not enabled. http://stackoverflow.com/a/34998008
    */
    function parseQueryParams(query_string) {
      return query_string
        .split(/[&||?]/)
        .filter(function (x) { return x.indexOf("=") > -1; })
        .map(function (x) { return x.split(/=/); })
        .map(function (x) {
            x[1] = x[1].replace(/\+/g, " ");
            return x;
        })
        .reduce(function (acc, current) {
            acc[current[0]] = current[1];
            return acc;
        }, {});
    }

  }

})();

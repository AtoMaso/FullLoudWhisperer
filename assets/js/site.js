(function () {
  "use strict";

  var $pickButton = $("#pickButton");
  // on click on the drop down click button show the reason in the other button
  $("#reasonDropdown li a").on("click", function () {
    var reason = $(this).text();
    $pickButton.text(reason);
  });


  var $sentDialog = $("#sentDialog");
  // on submit of the form call the sent Dialog modal form to show
  $("#contactForm").on("submit", function () {
    $sentDialog.modal("show");
    return false;
  });

  var $sentAlert = $("#sentAlert");
  // bootstrap advances the event of jquery, the bs in the event below is bootstrap
  $sentDialog.on("hidden.bs.modal", function () {
    // insert code here to do somehing when the dialog is closed
    //alert("close");
    $sentAlert.show();
  });

  // this method handles closing of the alerts. Insttead of closing and removing
  // the alert from the dom it is hiding it only but return false
  $sentAlert.on("close.bs.alert", function () {
    $sentAlert.hide();
    return false;
  });

  // tooltip display
  $("#contactForm input[type=submit").tooltip({
    // placement:"left"
    delay: {
      show: 500,
      hide: 0
    }
  });


  $("#theCarousel1").carousel({
    interval: 3000,
    cycle: true
  });
  $("#theCarousel2").carousel({
      interval: 3000,
      cycle: true
    });
  $("#theCarousel3").carousel({
    interval: 3000,
    cycle: true
  });
  $("#theCarousel4").carousel({
    interval: 3000,
    cycle: true
  });
  $("#theCarousel5").carousel({
    interval: 3000,
    cycle: true
  });
  $("#theCarousel6").carousel({
    interval: 3000,
    cycle: true
  });

})();
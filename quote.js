var total = 0;

$(document).ready(function() {
  window.onload = function() {
    document.body.classList.remove("is-preload");
  };
  window.ontouchmove = function() {
    return false;
  };
  window.onorientationchange = function() {
    document.body.scrollTop = 0;
  };

  $("#urgentYes").click(function() {
    $("urgentYes").prop("checked", true);
    console.log("yes selected");
  });

  $("#urgentNo").click(function() {
    $("urgentNo").prop("checked", true);
    console.log("no selected");
  });

  $("#car").click(function() {
    $("car").prop("checked", true);
    console.log("car selected");
  });

  $("#pickupTruck").click(function() {
    $("pickupTruck").prop("checked", true);
    console.log("pickup truck selected");
  });

  $("#suv").click(function() {
    $("suv").prop("checked", true);
    console.log("suv selected");
  });

  $("#fwd").click(function() {
    $("fwd").prop("checked", true);
    if (car) {
      total += 85;
    } else if (suv) {
      total += 90;
    } else {
      total += 150;
    }
  });

  $("#awd").click(function() {
    $("awd").prop("checked", true);
    console.log("awd selected");
  });

  $("#rwd").click(function() {
    $("rwd").prop("checked", true);
    console.log("rwd selected");
  });

  $("#notSure").click(function() {
    $("notSure").prop("checked", true);
    console.log("not sure selected");
  });

  $("#CheckboxTow").click(function() {
    $("CheckboxTow").prop("checked", true);
    console.log("tow selected");
  });

  $("#CheckboxBoost").click(function() {
    $("CheckboxBoost").prop("checked", true);
    total += 65;
    console.log("boost selected");
  });

  $("#CheckboxGasDelivery").click(function() {
    $("CheckboxGasDelivery").prop("checked", true);
    total += 65;
    console.log("gas delivery selected");
  });

  $("#CheckboxLockout").click(function() {
    $("CheckboxLockout").prop("checked", true);
    total += 65;
    console.log("lockout selected");
  });

  $("#CheckboxTireChange").click(function() {
    $("CheckboxTireChange").prop("checked", true);
    total += 85;
    console.log("tire change selected");
  });

  $("#submitBtn").click(function() {
    alert("Your estimated price is $" + total);
    $("#submitForm").submit();
    $("#submitForm").hide();
  });
});

function moneyInput($input) {
  $input.on("keypress", function (e) {
    var keynum = e.keyCode || e.which;
    var keystr = String.fromCharCode(keynum);
    var curval = $(this).val();
    // Allow a decimal place
    if (curval.indexOf('.') === -1 && keystr === '.') {
      return true;
    }

    var completeNewVal = curval + keystr;
    var testVal = (completeNewVal / 1).toFixed(2).replace(".00", "");
    if (completeNewVal !== testVal) {
      return false;
    }
    return true;
  });
}

$(function () {

  var pageVar = $('#session_var').val(),
    $userInput = $('#session_value'),
    pickerOps = {
      altInput: true,
      altFormat: "D J M Y"
    };

  if (pageVar === 'weekly_spend') {
    moneyInput($userInput);
    return;
  }

  if (pageVar === 'quit_date') {
    pickerOps.minDate = "today";
    pickerOps.maxDate = new Date();
    pickerOps.maxDate.setDate(pickerOps.maxDate.getDate() + 14);
  }

  var picker = flatpickr(".text-input-outer.date input", pickerOps);

  if (picker.config) {
    $("#calpicker")
      .on("mousedown touchstart", function (e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        picker.open();
      });
    // Fix get boundingrect wrong left position first time
    picker.open();
    picker.close();
  }

  $('#quit-plan-button').on('click', function() {
    $('#quit-plan').toggleClass('open');
  })
});
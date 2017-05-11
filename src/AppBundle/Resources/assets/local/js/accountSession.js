$(function(){
  var picker = flatpickr(".text-input-outer.date input", {
    altInput: true,
    altFormat: "D J M Y"
  });
  if(picker.config)
  {
    $("#calpicker")
    .on("mousedown touchstart",function(e){
      e.preventDefault();
      e.stopPropagation();
    })
    .on("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      picker.open();
    });
    // Fix get boundingrect wrong left position first time
    picker.open();
    picker.close();
  }  
});
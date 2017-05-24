$(function(){
  $(".text-input").on("change blur keyup", function(e)
  {
    var $th = $(this),
    val = $th.val();
    if( $th.hasClass("isfilled") && val === '' )
    {
      $th.removeClass("isfilled");
    }
    else if( !$th.hasClass("isfilled") && val !== '' )
    {
      $th.addClass("isfilled");
    }
  }).trigger("blur");

  $("#resend_email_confirmation").on("click", function(e)
  {
    e.preventDefault();
    $("#app_user_change_email_email").val($("#new_email").text());
    $("#new_email_form").submit();
  });
});
$(function(){
	var $pieTeal = $("#pieTeal");
	if($pieTeal.length)
	{
		var $pieGray = $("#pieGray");
		if($pieTeal.attr("data-deg")/1>180)
		{
			$pieTeal.addClass("big").removeClass("small");
			$pieGray.removeClass("big").addClass("small");
		}
	}
});
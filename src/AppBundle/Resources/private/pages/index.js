var $video = $(".video"),
$videoCover = $(".video-cover"),
$homeRight = $(".home-right"),
curBreakpoint,
isMobile = false;

var smallBreaks = ['xs', 'sm'],
largeBreaks = ['md', 'lg', 'xl'];

var reflow = (function reflowF(e){
	if(!isMobile){
		var maxWidth = $homeRight.height()/9*16;
		$video.css({
			maxWidth: maxWidth+"px",
			width: $(window).width()*0.58
		});
		return reflowF;
	}
})();

function changeLayout(type){
	switch(type){
		case "mobile":
			isMobile = true;
			$video.appendTo(".mobile-video-holder");
			$homeRight.hide();
			$video.css({
				maxWidth: "",
				width: ""
			});
		break;
		case "desktop":
			isMobile = false;
			$video.appendTo($homeRight);
			$homeRight.show();
		break;
	}
}
(function($, viewport){
	viewport.use('bootstrap4');
	
	$(function(){
		viewport.onChange(function(newBreakpoint, oldBreakpoint) {
			if(oldBreakpoint===null){
				if(smallBreaks.indexOf(newBreakpoint)!==-1){
					//first setup for mobile - default layout is desktop will not need modifications
					changeLayout('mobile');
				}
			}else{
				if(smallBreaks.indexOf(newBreakpoint)!==-1 && largeBreaks.indexOf(oldBreakpoint)!==-1){
					//gone down to mobile layout
					changeLayout('mobile');
					
				}else if(largeBreaks.indexOf(newBreakpoint)!==-1 && smallBreaks.indexOf(oldBreakpoint)!==-1){
					//gone up to desktop layout
					changeLayout('desktop');
				}
			}
	    });
	    $(window).resize(reflow);
	});
})(jQuery, ResponsiveBootstrapToolkit);
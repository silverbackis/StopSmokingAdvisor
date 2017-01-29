/**
* Layout reflow
**/
(function($, viewport){
	viewport.use('bootstrap4');
	var $video = $(".video"),
	$videoCover = $(".video-cover"),
	$homeRight = $(".home-right"),
	$homeLeft = $(".home-left"),
	curBreakpoint,
	isMobile = false;

	var smallBreaks = ['xs', 'sm'],
	largeBreaks = ['md', 'lg', 'xl'];

	var reflow = (function reflowF(e){
		if(!isMobile){
			var minHeight = $(".home-left-hmid").outerHeight();
			$homeRight.add($homeLeft).css({
				minHeight: minHeight+"px"
			});

			var rightHeight = $homeRight.height(),
			maxWidth = rightHeight/9*16;

			$video.css({
				maxWidth: maxWidth+"px",
				width: $(window).width()*0.58,
				minHeight: minHeight+"px"
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
					width: "",
					minHeight: ""
				});
				$homeRight.add($homeLeft).css({
					minHeight: ""
				});
			break;
			case "desktop":
				isMobile = false;
				$video.appendTo($homeRight);
				$homeRight.show();
			break;
		}
	}
	
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

/**
* Intro animation
**/
var introTimeline = new TimelineLite({paused:true})
.from(".home-left", 0.45, { opacity:0, x:-30 })
.from(".home-right", 0.45, { opacity:0, y:-30 }, "-=0.15")
.from(".bottom-links", 0.45, { opacity:0, y:30 }, "-=0.15")
.from(".play-button", 0.45, { opacity:0, x:"20%" });
$(function(){
	introTimeline.play();
});

/**
* Changing home pages
**/
(function(){
	function showPage(pageKey){
		if(!tweens[pageKey]){
			console.warn("Cannot show page, tween does not exist for that page", pageKey);
			return;
		}
		pageStatus.selected = pageKey;

		var $wrapper = $(tweens[pageKey]._targets[0]),
		slideNewPage = function(){
			$wrapper.show();
			tweens[pageKey].play();
			pageStatus.showing = pageKey;
		};
		
		if(pageStatus.showing) {
			//prevent function from resetting home page
			tweens[pageStatus.showing].eventCallback("onReverseComplete", null);
			//continue/start the current page from sliding away
			tweens[pageStatus.showing].reverse();
			//call function to show the new page straight away - do not wait for home to zoom out
			slideNewPage();
		}else{
			//home zoom out, and when complete show new page - override oncomplete function
			//(could then click another link while the home page is zooming out and function will overwrite)
			tweens['#home'].eventCallback("onComplete", slideNewPage);
			tweens['#home'].play();
		}
	}

	function showHome(){
		if(pageStatus.showing){
			tweens[pageStatus.showing].eventCallback("onReverseComplete",function(){
				tweens['#home'].reverse();
				pageStatus.showing = null;
			});
			tweens[pageStatus.showing].reverse();
		}else{
			tweens['#home'].reverse();
		}
	}

	var timeline = new TimelineLite(),
	pageStatus = {
		selected: null,
		showing: null
	},
	tweens = {
		"#home": new TweenLite.to("#home-container", 0.4, { 
			z: -80, 
			paused: true, 
			ease: Power2.easeInOut
		}),
		"#login": new TweenLite.from(
			".login-wrapper", 
			0.5, 
			{ 
				x: "-100%", 
				ease: Power2.easeInOut, 
				paused: true
			}
		),
		"#register": new TweenLite.from(
			".register-wrapper", 
			0.5, 
			{ 
				x: "100%", 
				ease: Power2.easeInOut, 
				paused: true
			}
		)
	};

	$(".login-wrapper, .register-wrapper").hide();

	$(".main-home-link").on("click",function(e){
		e.preventDefault();
		showPage($(this).attr("href"));
	});
	
	$(".close-page-icon").on("click",function(e){
		e.preventDefault();
		showHome();
	});
})();

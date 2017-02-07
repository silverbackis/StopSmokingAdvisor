/**
 * Layout reflow
 */
var videoPlaying = false,
introVideo;

(function($, viewport){
	viewport.use('bootstrap4');
	var $video = $(".video"),
	$videoCover = $(".video-cover"),
	$homeRight = $(".home-right"),
	$homeLeft = $(".home-left"),
	$topRow = $(".main-home-row"),
	curBreakpoint,
	isMobile = false,
	rightHeight,
	maxWidth,
	windowWidth,
	videoWidth,
	widthIncrease,
	useVideoWidth;

	var smallBreaks = ['xs', 'sm'],
	largeBreaks = ['md', 'lg', 'xl'];

	var reflow = (function reflowF(evt){
		var doTween = evt==='tween',
		timeline;
		if(doTween){
			timeline = new TimelineLite({paused:true});
		}
		if(!isMobile){
			var minHeight = $(".home-left-hmid").outerHeight();
			$homeRight.add($homeLeft).css({
				minHeight: minHeight+"px"
			});
			
			rightHeight = $homeRight.height();
			windowWidth = $(window).width();
			maxWidth = videoPlaying ? windowWidth : (rightHeight/9)*16;
			videoWidth = windowWidth*0.58;

			if(maxWidth>windowWidth){
				maxWidth = windowWidth;
			}

			widthIncrease = videoPlaying ? maxWidth-videoWidth : 0;
			if(widthIncrease<0){
				widthIncrease = 0;
			}
			var topRowObj = {
				width: (windowWidth+widthIncrease)+"px",
				marginLeft: (widthIncrease*-1)+"px"
			};

			if(videoPlaying){
				if(doTween){
					timeline.to($topRow[0], 0.3, topRowObj, 0);
				}else{
					TweenLite.set($topRow[0], topRowObj);
				}
				
				useVideoWidth = maxWidth;
			}else{
				if(doTween){
					timeline.to($topRow[0], 0.3, topRowObj, 0);
				}else{
					TweenLite.set($topRow[0], {
						width: "",
						marginLeft: ""
					});
				}
				useVideoWidth = videoWidth;
			}

			var videoCSSObj = {
				maxWidth: maxWidth+"px",
				width: useVideoWidth,
				minHeight: minHeight+"px"
			};

			if(doTween){
				timeline.to($video[0], 0.3, videoCSSObj, 0).play();
			}else{
				TweenLite.set($video[0], videoCSSObj);
			}
			
			return reflowF;
		}
	})();

	function changeLayout(type){
		var restartVideo = videoPlaying;
		switch(type){
			case "mobile":
				isMobile = true;
				
				$video.appendTo(".mobile-video-holder");
				$homeRight.hide();
				$homeRight.add($homeLeft).css({
					minHeight: ""
				});

				TweenLite.set($topRow[0], {
					width: "",
					marginLeft: ""
				});
				TweenLite.set($video[0],{
					maxWidth: "",
					width: "",
					minHeight: ""
				});

				introVideo.resize('100%', 'auto');
			break;
			case "desktop":
				isMobile = false;
				$video.appendTo($homeRight);
				$homeRight.show();
				introVideo.resize('auto', '100%');
				reflow();
			break;
		}
		if(restartVideo){
			setTimeout(function(){
				introVideo.play(true);
			},10);
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


	/**
	 * Video
	 */
	(function(){
		$(function(){
			introVideo = jwplayer("videoPlayer");
			introVideo.setup({
			    sources: [
			    	{
			    		file: "//content.jwplatform.com/manifests/JpuXFVbD.m3u8?sig=6eb4779cc858265f3c43748c9b87831e&exp=14864758134",
			    		label: "HLS"
			    	},
			    	/*{
			    		file: "//content.jwplatform.com/videos/JpuXFVbD-hx4c5Uw3.mp4",
			    		label: "180p"
			    	},
			    	{
			    		file: "//content.jwplatform.com/videos/JpuXFVbD-PSjFUP8I.mp4",
			    		label: "270p"
			    	},
			    	{
			    		file: "//content.jwplatform.com/videos/JpuXFVbD-LX202PBh.mp4",
			    		label: "406p"
			    	},*/
			    	{
			    		file: "//content.jwplatform.com/videos/JpuXFVbD-xhTL5q8u.mp4",
			    		label: "720p"
			    	}/*,
			    	{
			    		file: "//content.jwplatform.com/videos/JpuXFVbD-aHTOGd7Q.mp4",
			    		label: "1080p"
			    	}*/
			    ], 
			    image: "//content.jwplatform.com/thumbs/JpuXFVbD-1920.jpg",
			    mediaid: "JpuXFVbD",
			    abouttext: "Stop Smoking Advisor",
				aboutlink: "https://www.stopsmokingadvisor.net",
				height: "100%",
	    		width: "auto",
	    		preload: true
			});

			introVideo.setControls(false);
			introVideo.on('ready', function(){
				$(".play-button").on("click", function(e){
					e.preventDefault();
					e.stopPropagation();
					introVideo.play(true);
				});

				$(".video-cover").on("click", function(){
					introVideo.play();
				});
			
				$(".video-cover .jw-flag-controls-disabled .jw-media").css({
					cursor: "pointer"
				});

				var vidPlay = function(){
					new TweenLite.to(".play-button", 0.3, { x: "100%" });
					//should try and increase vidth of the video column to 16x9 or as wide as the screen
					//push the title and text out the way to the left
					//should not apply to the mobile view
					videoPlaying = true;
					reflow('tween');
				},
				vidStopped = function(){
					$(".play-button").removeClass("link-clicked");
					new TweenLite.to(".play-button", 0.3, { x: "0%" });
					videoPlaying = false;
					reflow('tween');
				};
				introVideo.on("play", vidPlay);
				introVideo.on("pause", vidStopped);
				introVideo.on("complete", vidStopped);
			});
		});
	})();

})(jQuery, ResponsiveBootstrapToolkit);

/**
 * Intro animation
 */
$(".opacity-0").css({
	opacity: "",
	visibility: ""
});
$(".opacity-0").removeClass("opacity-0");

var introTimeline = new TimelineLite({
	paused: true, 
	delay: 0.6
})
.from(".home-left", 0.45, { opacity: 0, x: -30 })
.from(".home-right", 0.45, { opacity: 0, y: -30 }, "-=0.15")
.from(".bottom-links", 0.45, { opacity: 0, y: 30 }, "-=0.15")
.from(".play-button", 0.45, { opacity: 0, x: "20%" });
$(function(){
	introTimeline.play();
});


/**
 * Set and reset link shrinking on click
 */
$(".link-text-size").parents("a, button").add(".close-page-icon").on("click",function(){
	var $a = $(this);
	setTimeout(function(){
		$a.removeClass("link-clicked").addClass("link-clicked");
		if($a.data("resetTimeout")){
			clearTimeout($a.data("resetTimeout"));
		}
		$a.data("resetTimeout",setTimeout(function(){
			$a.removeClass("link-clicked");
		},1200));
	},50);
});

/**
 * Changing home pages
 */
(function(){
	/**
	 * Page changing vars and timeline functions
	 */
	var tweens = {
		"#home": new TweenLite
			.to(
				"#home-container", 
				0.4, 
				{ 
					z: -80, 
					paused: true, 
					ease: Power2.easeInOut
				}
			),
		"#login": new TimelineLite({paused: true})
			.from(
				".login-wrapper", 
				0.65, 
				{ 
					x: "-100%", 
					ease: Power2.easeInOut
				}
			),
		"#register": new TimelineLite({paused: true})
			.from(
				".register-wrapper", 
				0.65, 
				{ 
					x: "100%", 
					ease: Power2.easeInOut
				}
			),
	},
	v = {
		scrollTops: {},
		resetScrollTimeout: null,
		pageStatus: {
			showing: null
		}
	},	
	f = {
		getWrapper: function(viewKey){
			return $(tweens[viewKey].getChildren()[0]._targets[0]).parent();
		},
		showView: function(viewKey){
			var $wrapper = f.getWrapper(viewKey);
			
			//reset wrapper's scrolltop which may have been set when hidding and was changerd to fixed position
			$wrapper.scrollTop(0);
			
			//set scroll position for new view
			$("body").scrollTop(v.scrollTops[viewKey]);

			v.pageStatus.selected = null;
			v.pageStatus.showing = viewKey;
			tweens[viewKey].play();
		},
		setViewFixed: function(viewKey, wrapperScrollTop){
			var $oldWrapper = f.getWrapper(viewKey);
			v.scrollTops[viewKey] = wrapperScrollTop;
			
			//wrapper to be fixed position, display inline-block and scroll to same Y as body
			$oldWrapper.addClass("wrapper-anim-out").removeClass("wrapper-show");
			$("."+viewKey.substring(1)+"-outer").scrollTop(v.scrollTops[viewKey]);
		}
	};

	/**
	 * Main showPage function
	 */
	function showPage(pageKey){
		//if we request a page that doesn't exist, instead just go home and give console warning.
		if(pageKey && !tweens[pageKey]){
			console.warn("Cannot show page, tween does not exist for that page", pageKey);
			pageKey = false;
		}

		var $oldWrapper,
		pageToHide,
		wrapperScrollTop;
		if(v.pageStatus.showing){
			pageToHide = v.pageStatus.showing;
			$oldWrapper = f.getWrapper(pageToHide);
			wrapperScrollTop = $("body").scrollTop();
		}

		if(!pageKey){//go to default view - home
			if(!pageToHide){
				//no page to hide, reverse the home animation in (zoom back in)
				tweens['#home'].reverse();
			}else{
				
				//unfix the home screen
				//fix position the view to animate out and hide overflow-x
				$("body").removeClass("home-behind");
				$("body").scrollTop(v.scrollTops.body);	

				$oldWrapper.removeClass("wrapper-show").addClass("wrapper-anim-out");
				
				//fix view and set scroll position
				f.setViewFixed(pageToHide, wrapperScrollTop);

				tweens[pageToHide].eventCallback("onReverseComplete",function(){
					$oldWrapper.removeClass("wrapper-anim-out");
					tweens['#home'].reverse();
				});
				tweens[pageToHide].reverse();

				v.pageStatus.showing = null;
			}
		}else{//show a page
			//deal with view if one was selected, but now started to be shown yet
			if(v.pageStatus.selected){
				var $selectedWrapper = f.getWrapper(v.pageStatus.selected);
				$selectedWrapper.removeClass("wrapper-show");
			}
			v.pageStatus.selected = pageKey;
			
			//make wrapper relative pos and display table (final state)
			//do this before making body fixed
			var $wrapper = f.getWrapper(pageKey);
			$wrapper.addClass("wrapper-show");
			
			//set scrollTop variable for the new view if not set already
			if(!v.scrollTops[pageKey]){
				v.scrollTops[pageKey] = 0;
			}

			if(!pageToHide) {
				//set home fixed
				v.scrollTops.body = $("body").scrollTop();
				$("body").addClass("home-behind");
				$(".home-outer").scrollTop(v.scrollTops.body);				

				//shrink home page - when complete, slide in the new page
				tweens['#home'].eventCallback("onComplete", f.showView, [pageKey]);
				tweens['#home'].play();
			}else{
				//hide current page to fixed pos
				f.setViewFixed(pageToHide, wrapperScrollTop);
				tweens[pageToHide].eventCallback("onReverseComplete",function(){
					$oldWrapper.removeClass("wrapper-anim-out");
				});
				tweens[pageToHide].reverse();

				f.showView(pageKey);
			}
		}
	}

	/**
	 * Hash change events, pages will change when hash on page changes
	 */
	(function(){
		function hashChangeEvent(){
			if(videoPlaying){
				introVideo.pause();
			}
			if(location.hash==='#login' || location.hash==='#register'){
				showPage(location.hash);
			}else{
				showPage();
			}
		}

		$(window).on('hashchange', hashChangeEvent);
		introTimeline.eventCallback("onComplete",function(){
			hashChangeEvent();
		});

	})();
})();

/**
 * Form validation
 */
(function(){
	var $inputs = {
		regPass: $("#register-pass1")
	};
	$inputs.regPass.on("change keyup", function(){
		var pw = $inputs.regPass.val(),
		validCls;
		//at least 1 letter
		hasValidCls = $("#pw-letter").hasClass("valid");
		if(/[a-z]/i.test(pw)){
			if(!hasValidCls){
				$("#pw-letter").addClass("valid");
			}
		}else{
			if(hasValidCls){
				$("#pw-letter").removeClass("valid");
			}
		}

		//at least 1 number
		hasValidCls = $("#pw-number").hasClass("valid");
		if(/\d/.test(pw)){
			if(!hasValidCls){
				$("#pw-number").addClass("valid");
			}
		}else{
			if(hasValidCls){
				$("#pw-number").removeClass("valid");
			}
		}

		//at least 6 characters
		hasValidCls = $("#pw-6").hasClass("valid");
		if(pw.length>=6){
			if(!hasValidCls){
				$("#pw-6").addClass("valid");
			}
		}else{
			if(hasValidCls){
				$("#pw-6").removeClass("valid");
			}
		}
	});
})();

/**
 * TEMPORARY
 */
$(".social-login-link").on("click", function(e){
	e.preventDefault();
});
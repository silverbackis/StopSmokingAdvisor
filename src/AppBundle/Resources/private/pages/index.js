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
			maxWidth = (rightHeight/9)*16;
			windowWidth = $(window).width();
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
					TweenLite.set($topRow[0],topRowObj);
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
			    	{file: "//content.jwplatform.com/videos/kSxmP2Z8-hx4c5Uw3.mp4"},
			    	{file: "//content.jwplatform.com/videos/kSxmP2Z8-PSjFUP8I.mp4"},
			    	{file: "//content.jwplatform.com/manifests/kSxmP2Z8.m3u8?sig=952df8e8981048a30731097a970402cc&exp=1486145446"}
			    ], 
			    image: "//content.jwplatform.com/thumbs/kSxmP2Z8-480.jpg",
			    mediaid: "kSxmP2Z8",
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
var introTimeline = new TimelineLite({
	paused:true, 
	delay:1.6
})
.from(".home-left", 0.45, { opacity:0, x:-30 })
.from(".home-right", 0.45, { opacity:0, y:-30 }, "-=0.15")
.from(".bottom-links", 0.45, { opacity:0, y:30 }, "-=0.15")
.from(".play-button", 0.45, { opacity:0, x:"20%" });
$(function(){
	introTimeline.play();
});

/**
 * Changing home pages
 */
(function(){
	var scrollTops = {};

	function showPage(pageKey){
		if(!tweens[pageKey]){
			console.warn("Cannot show page, tween does not exist for that page", pageKey);
			return;
		}

		pageStatus.selected = pageKey;
		var $wrapper = $(tweens[pageKey].getChildren()[0]._targets[0]),
		slideNewPage = function(){
			pageStatus.showing = pageKey;
			$wrapper.addClass("wrapper-anim");
			tweens[pageKey].eventCallback("onComplete", function(){
				$wrapper
					.addClass("wrapper-show")
					.scrollTop(0);

				$("body").css({
					overflowY: ""
				});

				if(scrollTops[pageKey]){
					$("body").scrollTop(scrollTops[pageKey]);
				}
			});
			tweens[pageKey].play();
		};
		
		if(pageStatus.showing) {
			$.when(resetScroll(true)).done(function(){
				//prevent function from resetting home page
				var hidePageKey = pageStatus.showing;
				tweens[pageStatus.showing].eventCallback("onReverseComplete", function(){
					hideWrapper(hidePageKey);
				});
				//continue/start the current page from sliding away
				tweens[pageStatus.showing].reverse();
				//call function to show the new page straight away - do not wait for home to zoom out
				slideNewPage();
			});
		}else{
			//home zoom out, and when complete show new page - override oncomplete function
			//(could then click another link while the home page is zooming out and function will overwrite)
			tweens['#home'].eventCallback("onComplete", slideNewPage);
			tweens['#home'].play();
		}
	}

	function resetScroll(showAnotherPage){
		var $wrapper = $(tweens[pageStatus.showing].getChildren()[0]._targets[0]),
		dfrd = $.Deferred();

		scrollTops[pageStatus.showing] = $("body").scrollTop();
		//move to scrolltop 0 first to prevent ios flicker as positions change and url bar size change - force url bar to show
		$("body").scrollTop(0);
		$("body").scrollTop(scrollTops[pageStatus.showing]);

		setTimeout(function(){
			//add scrollbar if one will hide from this overlay, or the home page will be showing one
			var bodyHeight = $("body").height();

			if($wrapper.height()>bodyHeight || $(".site-wrapper").height()>bodyHeight){
				$("body").css({
					overflowY: "scroll"
				});
			}

			if(!showAnotherPage){
				$("body")
					.removeClass("home-behind")
					.scrollTop(scrollTops.body)
					.css({
						overflowY: ""
					});
			}

			$wrapper
				.removeClass("wrapper-show")
				.addClass("wrapper-anim")
				.scrollTop(scrollTops[pageStatus.showing]);
			dfrd.resolve();
		},180);
		return dfrd.promise();
	}

	function hideWrapper(pageKey){
		var $wrapper = $(tweens[pageKey].getChildren()[0]._targets[0]);
		$wrapper.removeClass("wrapper-anim");
	}

	function showHome(){
		if(pageStatus.showing){
			$.when(resetScroll()).done(function(){
				tweens[pageStatus.showing].eventCallback("onReverseComplete",function(){
					hideWrapper(pageStatus.showing);
					tweens['#home'].reverse();
					pageStatus.showing = null;
				});
				tweens[pageStatus.showing].reverse();
			});
		}else{
			tweens['#home'].reverse();
		}
	}

	var pageStatus = {
		selected: null,
		showing: null
	},
	tweens = {
		"#home": new TweenLite.to("#home-container", 0.4, { 
			z: -80, 
			paused: true, 
			ease: Power2.easeInOut, 
			onStart: function(){
				//keep scrollbar to prevent jumping just yet
				if($(".home-outer").height()>$("body").height()){
					$("body").css({
						overflowY: "scroll"
					});
				}

				scrollTops.body = $("body").scrollTop();
				$("body")
					.addClass("home-behind");
				$(".home-outer").scrollTop(scrollTops.body);
			}
		}),
		"#login": new TimelineLite({paused: true})
			.from(
				".login-wrapper", 
				0.5, 
				{ 
					x: "-100%", 
					ease: Power2.easeInOut
				}
			),
		"#register": new TimelineLite({paused: true})
			.from(
				".register-wrapper", 
				0.5, 
				{ 
					x: "100%", 
					ease: Power2.easeInOut
				}
			),
	};

	//unfocus links timeout when focussed so text no longer hides away
	$(".link-text-size").parents("a, button").add(".close-page-icon").on("click",function(){
		$a = $(this);
		setTimeout(function(){
			$a
				.removeClass("link-clicked")
				.addClass("link-clicked");

			if($a.data("resetTimeout")){
				clearTimeout($a.data("resetTimeout"));
			}
			$a.data("resetTimeout",setTimeout(function(){
				$a.removeClass("link-clicked");
			},1200));
		},50);		
	});

	var hashChangeEvent = function(){
		if(videoPlaying){
			introVideo.pause();
		}
		if(location.hash==='#login' || location.hash==='#register'){
			showPage(location.hash);
		}else{
			showHome();
		}
	};

	$(window).on('hashchange', hashChangeEvent);

	introTimeline.eventCallback("onComplete",function(){
		hashChangeEvent();
	});

	$(".social-login-link").on("click", function(e){
		e.preventDefault();
	});
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
/**
 * Preload images
 */
$.fn.preload = function() {
    this.each(function(){
    	var img = new Image();
        img.src = this;
    });
};
var preloadImages = [];
$(".preload-bg").each(function(){
	preloadImages.push($(this).css("background-image").replace('url(','').replace(')','').replace(/\"/gi, ""));
});
$(preloadImages).preload();

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

	var reflow = (function reflowF(evt, tweenCompleteFunction){
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
				if(tweenCompleteFunction){
					timeline.eventCallback("onComplete", tweenCompleteFunction);
				}else{
					timeline.eventCallback("onComplete", null);
				}
				timeline.to($video[0], 0.3, videoCSSObj, 0).play();
			}else{
				TweenLite.set($video[0], videoCSSObj);
			}
			
			return reflowF;
		}else if(tweenCompleteFunction){
			tweenCompleteFunction();
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
				videoPlaying = true;
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
		introVideo = jwplayer("videoPlayer");
		introVideo.setup({
		    sources: [
		    	{
		    		file: "//content.jwplatform.com/manifests/JpuXFVbD.m3u8?sig=ea38f26da3a2609f827097776e7cfcbc",
		    		label: "HLS"
		    	},
		    	{
		    		file: "//content.jwplatform.com/videos/JpuXFVbD-aHTOGd7Q.mp4",
		    		label: "1080p"
		    	},
		    	{
		    		file: "//content.jwplatform.com/videos/JpuXFVbD-xhTL5q8u.mp4",
		    		label: "720p"
		    	}		    	
		    ], 
		    image: "//content.jwplatform.com/thumbs/JpuXFVbD-1920.jpg",
		    mediaid: "JpuXFVbD",
		    abouttext: "Stop Smoking Advisor",
			aboutlink: "https://www.stopsmokingadvisor.net",
			height: "100%",
    		width: "auto",
    		preload: true,
    		hlshtml: true
		});

		var vidPlay = function(){
			new TweenLite.to(".play-button", 0.3, { x: "100%" });
			videoPlaying = true;
			reflow('tween', function(){
				introVideo.play(true);
			});
		},
		vidStopped = function(){
			$(".play-button").removeClass("link-clicked");
			new TweenLite.to(".play-button", 0.3, { x: "0%" });
			videoPlaying = false;
			reflow('tween');
		};
		introVideo.setControls(false);
		introVideo.on('displayClick', function(){
			if(videoPlaying){
				introVideo.pause(true);
			}else{
				vidPlay();				
			}
		});

		introVideo.on('ready', function(){
			$(".play-button").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				if(!videoPlaying){
					vidPlay();
				}
			});
		
			$(".video-cover .jw-flag-controls-disabled .jw-media").css({
				cursor: "pointer"
			});

			
			//introVideo.on("play", vidPlay);
			introVideo.on("pause", vidStopped);
			introVideo.on("complete", vidStopped);
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
var playButtonTween = new TweenLite.from(".play-button", 0.45, { opacity: 0, x: "20%", paused: true });
var introTimeline = new TimelineLite({
	paused: true, 
	delay: 0.6
})
.from(".home-left", 0.45, { opacity: 0, x: -30 })
.from(".home-right", 0.45, { opacity: 0, y: -30 }, "-=0.15")
.from(".bottom-links", 0.45, { opacity: 0, y: 30 }, "-=0.15")
.add(function(){
	if(!videoPlaying){
		playButtonTween.play();
	}else{
		TweenLite.set(".play-button", { opacity: 1 });
	}
});
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
		function hashChangeEvent(init){
			if(init!==true && videoPlaying){
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
			hashChangeEvent(true);
		});

	})();
})();

/**
 * Form validation
 */
(function(){
	var $inputs = {
		regPass: $("#fos_user_registration_form_plainPassword_first")
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
 * Form ajax post
 */
(function(){
	$('#loginCollapse').on('show.bs.collapse', function () {
		$("#loginForm").attr("action", $("#loginForm").attr("data-loginAction"));
		$("#username").attr("name", "_username");
	});
	$('#forgotCollapse').on('show.bs.collapse', function () {
		$("#loginForm").attr("action", $("#loginForm").attr("data-forgotAction"));
		$("#username").attr("name", "username");
	});
	$('#resettingModal').on('hidden.bs.modal', function (e) {
		if(!$('#loginCollapse').hasClass("show")){
			$("#showLoginForm").trigger("click.bs.collapse.data-api");
		}
	});
	$.fn.errorMessage = function(message, noFlash){
		this.each(function(){
			var $input = $(this);

			var f = {
				init: function(){
					//only initialise data on inputs which have the correct error message structure
					if(!$input.next().is(".form-control-feedback") || $input.parents(".form-group").length<1){
						return false;
					}
					var $feedback = $input.next();
					//set the elements to be used for error messages
					$input
						.data("errorElements", {
							$feedback: $feedback,
							$formGroup: $input.parents(".form-group"),
							$form: $input.parents("form")
						})
						.data("isError", false)
						.data("flashTimeline", new TimelineLite({ 
							onComplete: function(){ 
								$feedback.css({backgroundColor: ""}); 
							}
						}))
						.data("validateTimeout", null);
					return true;
				},
				public_hide: function(){
					$input.data("isError", false);

					new TweenLite.to($input.data("errorElements").$feedback[0], 0.4, {opacity: 0, y: "-100%", onComplete:function(){
						$input.data("errorElements").$feedback.empty();
					}});
					new TweenLite.to($input.data("errorElements").$formGroup[0], 0.4, {paddingBottom: 0});
				}
			};

			if(typeof $input.data("errorElements")=='undefined' || message=='init'){
				var initSuccess = f.init();
				if(message=='init' || !initSuccess){
					return;
				}
			}		

			if(typeof f['public_'+message]=='function'){
				f['public_'+message]();
			}else{
				$input.data("isError", true);
				var currentMessage = $input
					.data("errorElements").$feedback.html();
				$input
					.data("errorElements").$feedback.html(message);

				if(currentMessage===message && !noFlash){
					$input.data("flashTimeline")
						.clear()
						.to($input.data("errorElements").$feedback[0], 0.3, {backgroundColor: $("button.btn", $input.data("errorElements").$form).css("background")})
						.to($input.data("errorElements").$feedback[0], 0.9, {backgroundColor: "transparent"});
				}
				new TweenLite.to($input.data("errorElements").$feedback[0], 0.4, {opacity: 1, y: "0%"});
				new TweenLite.to($input.data("errorElements").$formGroup[0], 0.4, {paddingBottom: $input.data("errorElements").$feedback.outerHeight()});
			}
		});
		return this;
	};

	$.fn.ajaxForm = function() {
	    this.each(function(){
	    	var $form = $(this),
	    	$inputs = $( ":input", $form ).not("[type=submit]");

	    	var submitFunction = function(overrideData, $input, eventType){
	    		var serializedData = $input ? $input.serializeArray() : $inputs.serializeArray(),
	    		hidErr = function(){
	    			if($input){
			    		$input.errorMessage("hide");
			    	}else{
			    		$inputs.errorMessage("hide");
			    	}
			    },
			    formData = {};

	    		if($input){
	    			serializedData.push({
	    				name: "task[input]",
	    				value: $input.attr("id")
	    			});
	    			serializedData.push({
	    				name: "task[submit]",
	    				value: 'no'
	    			});
	    		}

			    $.each(serializedData, function(){
			    	formData[this.name] = this.value;
				});

	    		if(overrideData && typeof overrideData=='object'){
	    			formData = $.extend(formData, overrideData);
	    		}

	    		$.ajax({
		    		type: "POST",
					url: $form.attr("action"),
					data: formData,
					statusCode: {
						200: function(response) {
							//logged in
					    	hidErr();
							window.location.href = response.href;
					    },
					    401: function(response) {
							//login/authorization failed
					    	hidErr();
					    	$("#password").errorMessage(response.responseJSON.message);
					    },
						201: function(response) {
							//created
					    	hidErr();
							alert("You have registered!");
							window.location.hash = '#home';
					    },
					    202: function(response) {
					    	//validation success
					    	hidErr();
					    	if(response.message){
					    		$("#modal_notice").html(response.message);
					    		$('#resettingModal').modal();
					    	}
					    },
					    400: function(response) {
					    	hidErr();
							$.each(response.responseJSON, function(inputID, inputError){
								var $input = $("#"+inputID);
								$input.errorMessage(inputError, eventType==='keyup' ? true : false);
							});
					    }
					},
					error: function(err){
						if(err.status!==400 && err.status!==401){
							alert("Sorry, an unknown error occurred. Please try again.");
							console.warn(arguments);
						}
					},
					dataType: 'json'
		    	});
	    	},
	    	inputEvent = function(e){
	    		var $input = $(this);

	    		//do not submit for validation if it is keyup, and not already an error
	    		if(e.type=='keyup' && !$input.data("isError")){
	    			return;
	    		}

	    		//clear keyup timeout
	    		if($input.data("validateTimeout")){
	    			clearTimeout($input.data("validateTimeout"));
	    		}

	    		$input.data(
	    			"validateTimeout",
	    			setTimeout(function(){
		    			var overrideData = {};

		    			//if validating the first password field, simulate the second password field matching
		    			if($input.attr("id")==="fos_user_registration_form_plainPassword_first"){
		    				overrideData['fos_user_registration_form[plainPassword][second]'] = $input.val();
		    			}else if($input.attr("id")==="fos_user_registration_form_plainPassword_second"){
		    				//set the second password value first so we can check if it matches the first
		    				overrideData['fos_user_registration_form[plainPassword][second]'] = $input.val();
		    				//change to validate the first password field
		    				$input = $("#fos_user_registration_form_plainPassword_first");
		    			}

		    			submitFunction(overrideData, $input, e.type);
		    		}, e.type=='keyup' ? 200 : 0)
		    	);
	    	};

	    	$form.on("submit", function(e){
	    		e.preventDefault();
	    		var overrideData = {};
	    		if($form.attr("name")=='fos_user_registration_form'){
	    			overrideData['fos_user_registration_form[username]'] = $("#fos_user_registration_form_email").val();
	    		}
	    		submitFunction(overrideData, null, e.type);
	    	});
	    	if($form.attr("name")=='fos_user_registration_form'){
				$inputs.errorMessage("init").on("keyup blur", inputEvent);
			}else{
				$inputs.errorMessage("init").on("keyup", function(){
					$inputs.errorMessage("hide");
				});
			}
	    });
	    return this;
	};

	$(".fos_user_registration_register, .fos_user_security_check").ajaxForm();
})();
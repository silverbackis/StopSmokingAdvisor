var AjaxManager = (function($){
	// Private vars
	var prv = {
		submittingTotal: 0,
		erronious: 0,
		defaultOps: {
			method: 'GET',
			dataType: null,
			contentType: null,
			initFn: null,
			submitFn: null,
			successFn: null,
			errorFn: null,
			data: null,
			uniqueRequest: {
				data: false,
				url: false
			},
			abortable: false,
			debug: false,
			load: false,
			status: {
				enabled: true,
				$el: $("#saveNotice"),
				savedText: $("#saveNotice").html()
			}
		}
	};
	//Private functions
	function hashObj(object){
		var string = JSON.stringify(object);

		var hash = 0,
		i = 0;
		if (this.length === 0) return hash;
		for (i; i < this.length; i++) {
			char = this.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}

	function setSaving(localOps)
	{
		if(localOps.status.enabled)
		{
			localOps.status.$el.html(localOps.load ? "Loading..." : "...Saving").addClass("saving").removeClass("text-danger");
		}
	}

	function setSaved(localOps)
	{
		if(localOps.status.enabled)
		{
			localOps.status.$el.html(localOps.status.savedText).removeClass("saving");
		}
	}

	function setError(localOps)
	{
		if(localOps.status.enabled)
		{
			localOps.status.$el.html("Sorry, changes not saved. Please refresh the page.").removeClass("saving").addClass("text-danger");
		}
	}

	function ajaxError(localOps, error, textStatus, errorThrown, jqueryAjaxScope){
		prv.submittingTotal--;
		setError(localOps);
		if(localOps.errorFn)
		{
			localOps.errorFn(error, textStatus, errorThrown, this, jqueryAjaxScope);
		}
		else
		{
			if(typeof error.responseJSON == 'object')
			{
				if(error.responseJSON.errors)
				{
					$(error.responseJSON.errors).each(function(){
						alert(this);
					});
				}else{
					alert("An unknown error occured. Sorry for the inconvenience.");
				}
			}
			else
			{
				alert("Error processing your request: "+error.responseText);
			}
		}
	}

	function ajaxSuccess(localOps, response, jqueryAjaxScope){
		prv.submittingTotal--;
		if(prv.submittingTotal===0)
		{
			setSaved(localOps);
		}
		if(localOps.successFn)
		{
			localOps.successFn(response, this, jqueryAjaxScope);
		}
	}
	// Ajax Object
	function AjaxRequest(url, ops)
	{
		// private - localised to the request
		var currentRequests = {},
		_self = this;

		// Public vars as AjaxRequest obect is returned by AjaxManager
		this.url = url;
		this.ops = {};
		$.extend(this.ops, prv.defaultOps, ops);

		// Public function as AjaxRequest obect is returned by AjaxManager
		this.submit = function(data, url){
			// Localise set options to this submission
			var localOps = $.extend({}, this.ops);

			// initFn function can be set and can override url and ops
			if(localOps.initFn)
			{
				var initResponse = this.ops.initFn.call(this);
				if(typeof initResponse=='object')
				{
					if(initResponse.url)
					{
						url = initResponse.url;
					}
					if(initResponse.ops)
					{
						$.extend(localOps, initResponse.ops);
					}
				}
				else if(false === initResponse)
				{
					if(localOps.debug)
					{
						console.log("initFn cancelled an ajax request", localOps);
					}
					return;
				}
			}

			// data does not need to be submitted, but if contentType json, we will automatically stringify objects
			if(!data)
			{
				data = null;
			}
			else if(typeof data=='object' && localOps.contentType && localOps.contentType.indexOf('application/json')!==-1)
			{
				data = JSON.stringify(data);
			}
			// set private url var to what has been set for this request if exists, or main url if not
			url = url || this.url;

			// now we have final data and url vars, we can create a hash based on what makes the request unique (unique requests cannot cancel each other out)
			var requestHash = hashObj({
				data: localOps.uniqueRequest.data ? data : null,
				url: localOps.uniqueRequest.url ? url : null
			});

			// If this request is not unique to another in process
			if(currentRequests[requestHash])
			{
				// we will abort the old request if we are able to, or simply not send this request again if not
				if(localOps.abortable)
				{
					currentRequests[requestHash].abort();
				}
				else
				{
					if(localOps.debug)
					{
						console.warn("Request already in progress and is not abortable");
					}
					return;
				}
			}

			// setup ajax options
			var ajaxOps = {
				type: localOps.method,
				url: url,
				dataType: localOps.dataType,
				contentType: localOps.contentType,
				data: data || localOps.data,
				success: function(response){
					currentRequests[requestHash] = undefined;
					ajaxSuccess.call(_self, localOps, response, this);
				},
				error: function(error, textStatus, errorThrown){
					currentRequests[requestHash] = undefined;
					ajaxError.call(_self, localOps, error, textStatus, errorThrown, this);
				}
			};

			// If there has been a function set to be called just before submission
			if(localOps.submitFn)
			{
				var submitFnResponse = localOps.submitFn.call(this);
				if(false === submitFnResponse)
				{
					if(localOps.debug)
					{
						console.log("submitFn cancelled posting the data:", ajaxOps);
					}
					return;
				}
			}

			if(localOps.debug)
			{
				console.log("AjaxRequest $.ajax options:", ajaxOps);
			}

			// Increase total of ajax calls in progress
			prv.submittingTotal++;
			// Set the saving notice (depending on if this request is loading or saving data)
			setSaving(localOps);
			// Do Ajax call
			currentRequests[requestHash] = $.ajax(ajaxOps);
		};
	}
	
	// public functions
	var self = {
		new: function(url, ops){
			if(!url)
			{
				console.warn("First argument 'url' is required for AjaxManager.new");
				return;
			}
			if(!ops)
			{
				ops = {};
			}
			var newAjaxRequest = new AjaxRequest(url, ops);
			return newAjaxRequest;
		}
	};

	return self;
})(jQuery);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AjaxManager;
}
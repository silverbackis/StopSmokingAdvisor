var AjaxManager = (function($){

	var prv = {
		submittingTotal: 0
	};

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

	var $saveNotice = $("#saveNotice"),
	savedText = $saveNotice.html();
	function setSaving(load)
	{
		$saveNotice.html(load ? "Loading..." : "...Saving").addClass("saving").removeClass("text-danger");
	}

	function setSaved()
	{
		$saveNotice.html(savedText).removeClass("saving");
	}

	function setError()
	{
		$saveNotice.html("Sorry, changes not saved. Please refresh.").removeClass("saving").addClass("text-danger");
	}

	function AjaxRequest(url, ops)
	{
		//private
		var currentRequests = {},
		_self = this;

		this.url = url;
		this.ops = {
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
			load: false
		};
		$.extend(this.ops, ops);

		this.submit = function(data, url){
			var localOps = $.extend({}, this.ops);

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
			}

			if(!data)
			{
				data = null;
			}
			if(localOps.contentType && localOps.contentType.indexOf('application/json')!==-1)
			{
				data = JSON.stringify(data);
			}

			url = url || this.url;

			var requestHash = hashObj({
				data: localOps.uniqueRequest.data ? data : null,
				url: localOps.uniqueRequest.url ? url : null
			});

			if(currentRequests[requestHash])
			{
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

			if(localOps.submitFn)
			{
				localOps.submitFn.call(this);
			}

			var ajaxOps = {
				type: localOps.method,
				url: url,
				dataType: localOps.dataType,
				contentType: localOps.contentType,
				data: data || localOps.data,
				success: function(response){
					currentRequests[requestHash] = undefined;
					_self.ajaxSuccess.call(_self, localOps, response, this);
				},
				error: function(error, textStatus, errorThrown){
					currentRequests[requestHash] = undefined;
					_self.ajaxError.call(_self, localOps, error, textStatus, errorThrown, this);
				}
			};

			if(localOps.debug)
			{
				console.log("AjaxRequest $.ajax options:", ajaxOps);
			}
			prv.submittingTotal++;
			setSaving(localOps.load);
			currentRequests[requestHash] = $.ajax(ajaxOps);
		};
	}
	AjaxRequest.prototype.ajaxError = function(localOps, error, textStatus, errorThrown, jqueryAjaxScope){
		prv.submittingTotal--;
		setError();
		if(localOps.errorFn)
		{
			localOps.errorFn(error, textStatus, errorThrown, jqueryAjaxScope);
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
	};
	AjaxRequest.prototype.ajaxSuccess = function(localOps, response, jqueryAjaxScope){
		prv.submittingTotal--;
		if(prv.submittingTotal===0)
		{
			setSaved();
		}
		if(localOps.successFn)
		{
			localOps.successFn(response, jqueryAjaxScope);
		}
	};
	

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
var AjaxManager = (function($, alert){
	// Private
	var prv = {
		submittingTotal: 0,
		erronious: 0,
		inputs: [],
		saveNotice: {
			enabled: true,
			$el: $("#saveNotice"),
			savedText: $("#saveNotice").html()
		}
	};

	// Protected - available to all objects called from within AjaxManager
	this.setSaved = function()
	{
		if(prv.saveNotice.enabled)
		{
			var inputErrors = false;
			$.each(prv.inputs, function(){
				if(this.error.current)
				{
					inputErrors = true;
					return false;
				}
			});
			if(inputErrors)
			{
				setError();
				return;
			}
			prv.saveNotice.$el.html(prv.saveNotice.savedText).removeClass("saving text-warning text-danger");
		}
	};
	this.setError = function()
	{
		if(prv.saveNotice.enabled)
		{
			prv.saveNotice.$el.html("Some changes not saved.").removeClass("saving text-warning").addClass("text-danger");
		}
	};
	this.setSaving = function(loading)
	{
		// Increase total of ajax calls in progress
		prv.submittingTotal++;

		if(prv.saveNotice.enabled)
		{
			prv.saveNotice.$el.html(loading ? "Loading..." : "...Saving").addClass("saving").removeClass("text-danger text-warning");
		}
	};
	this.setNotSaved = function()
	{
		if(prv.saveNotice.enabled)
		{
			prv.saveNotice.$el.html("Waiting for user").removeClass("saving text-danger").addClass("text-warning");
		}
	};
	this.submitComplete = function()
	{
		prv.submittingTotal--;
	};
	
	// public
	var self = {
		newRequest: function(url, ops)
		{
			if(!url)
			{
				console.warn("First argument 'url' is required for AjaxManager.newRequest");
				return;
			}
			if(!ops)
			{
				ops = {};
			}
			var newAjaxRequest = new AjaxRequest(url, ops);
			return newAjaxRequest;
		},
		newInput: function($input, nodeID, entity)
		{
			if(!$input)
			{
				console.warn("First argument '$input' is required for AjaxManager.newInput");
				return;
			}
			var newInput = new AjaxInput($input, nodeID, entity);
			prv.inputs.push(newInput);
			return newInput;
		},
		findInputs: function(nodeID, column)
		{
			var matchingInputs = [];
			$.each(prv.inputs, function()
			{
				var AI = this;
				if(AI.id===nodeID && AI.getColumn()===column)
				{
					//matching input
					matchingInputs.push(AI);
				}
			});
			return matchingInputs;
		}
	};

	return self;
})(jQuery, BootstrapModalAlerts.alert);
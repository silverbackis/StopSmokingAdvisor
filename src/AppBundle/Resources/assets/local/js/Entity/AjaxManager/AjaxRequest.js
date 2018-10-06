import { setSaving, submitComplete, setSaved, setError } from '../../Utils/AjaxManager'

export const hashObj = function (object){
  var string = JSON.stringify(object);

  var hash = 0,
    i = 0;
  if (string.length === 0) return hash;
  for (i; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

// Ajax Object
function AjaxRequest(url, ops)
{
	// private - localised to the request
	var currentRequests = {},
	prv = {
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
			input: null
		}
	};

	// Public vars as AjaxRequest obect is returned by AjaxManager
	this.url = url;
	this.ops = {};
	this.debounceTimer = {};
	$.extend(this.ops, prv.defaultOps, ops);

	// Protected getters and setters
	this.setRequest = function(hash, $a)
	{
		currentRequests[hash] = $a;
	};
	this.getRequest = function(hash)
	{
		return currentRequests[hash];
	};
	this.setOps = function(ops) {
    $.extend(this.ops, ops);
	}
	this.getOps = function () {
		return this.ops
	}
  this.extendFn = (fnName, fn) => {
		const opKey = `${fnName}Fn`
		if (!this.ops[opKey]) {
      this.ops[opKey] = fn
		} else {
			const orig = this.ops[opKey]
      this.ops[opKey] = () => {
        orig(...arguments)
        fn(...arguments)
			}
    }
  }
}
AjaxRequest.prototype.submit = function(data, url, ms, ops){
	var _self = this;

	if(!ops)
	{
		ops = {};
	}

	// Localise set options to this submission
	var localOps = $.extend({}, this.ops, ops);

	// initFn function can be set and can override url and ops
	if(localOps.initFn)
	{
		var initResponse = localOps.initFn.call(this);
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
		input_id: localOps.input ? localOps.input.$input.attr("id") : null,
		data: localOps.uniqueRequest.data ? data : null,
		url: localOps.uniqueRequest.url ? url : null
	});

	// If this request is not unique to another in process
	var existingRequest = this.getRequest(requestHash);
	if(existingRequest)
	{
		// we will abort the old request if we are able to, or simply not send this request again if not
		if(localOps.abortable)
		{
			existingRequest.abort();
      if(localOps.debug)
      {
        console.log('aborted existing request');
      }
		}
		else
		{
			if(localOps.debug)
			{
				console.warn("Request already in progress and is not abortable");
			}
			// return;
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
			_self.setRequest(requestHash, undefined);
			_self.ajaxSuccess(localOps, response, this);
		},
		error: function(error, textStatus, errorThrown){
			_self.setRequest(requestHash, undefined);
			_self.ajaxError(localOps, error, textStatus, errorThrown, this);
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
	// Set the saving notice (depending on if this request is loading or saving data)
	setSaving(localOps.load);

	clearTimeout(_self.debounceTimer[requestHash]);

  if(localOps.debug) {
    console.log('timeout', ajaxOps);
  }
  _self.debounceTimer[requestHash] = setTimeout(function(){
    // Do Ajax call
    if(localOps.debug) {
      console.log('send', ajaxOps);
    }
		_self.setRequest(requestHash, $.ajax(ajaxOps));
  }, ms || 250);
};
AjaxRequest.prototype.ajaxError = function (localOps, error, textStatus, errorThrown, jqueryAjaxScope){
	submitComplete();
	var errors = [];
	setError();
	if(typeof error.responseJSON == 'object')
	{
		if(error.responseJSON.errors)
		{
			$(error.responseJSON.errors).each(function(){
				alert(this.message);
				errors.push(this.message);
			});
		}else{
			alert("An unknown error occured. Sorry for the inconvenience.");
		}
	}
	else if(error.statusText!=='abort')
	{
		alert("Error processing your request: "+error.responseText);
		errors.push(error.responseText);
	}
	if(localOps.input)
	{
		localOps.input.setError(true, errors.join("\n"));
	}
	if(localOps.errorFn)
	{
		localOps.errorFn(error, textStatus, errorThrown, this, jqueryAjaxScope);
	}
};
AjaxRequest.prototype.ajaxSuccess = function(localOps, response, jqueryAjaxScope){
	submitComplete();
	setSaved(localOps);

	// make sure no errors on the input now
	if(localOps.input)
	{
		localOps.input.setError(false, null);
	}

	// custom success function
	if(localOps.successFn)
	{
		localOps.successFn(response, this, jqueryAjaxScope);
	}
};

export default AjaxRequest



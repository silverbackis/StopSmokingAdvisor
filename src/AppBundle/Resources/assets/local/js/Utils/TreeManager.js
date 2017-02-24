var TreeManager = (function($, alert, confirm){
	// References only for in this object
	var tm = this,
	$sessionSelect = $("#sessionSelect"),
	$pageContainer = $("#pageContainer"),
	rootTree;

	// Referenced and updatable vars from Entities
	this.$treeContainer = $("#treeContainer");
	this.selectedNode = null;
	this.sessionNumber = $sessionSelect.val();
	this.SidePanel = new SidePanel();

	this.setInputValue = function($input, value)
	{
		if($input.attr("type")==='checkbox')
		{
			$input.prop("checked", value).trigger("change");
		}
		else if($input.is("div"))
		{
			//$input.html(value);
			return $input.trumbowyg('html', value);
		}
		else if($input.is("select")){
			$input.selectpicker('val', value).trigger("change");
		}
		else
		{
			$input.val(value);
		}
	};

	this.getInputValue = function($input)
	{
		if($input.attr("type")==='checkbox')
		{
			return $input.prop("checked");
		}
		else if($input.is("div"))
		{
			//return $input.html();
			return $input.trumbowyg('html');
		}
		else
		{
			return $input.val();
		}
	};

	// All ajax
	this.ajax = {
		getSession: AjaxManager.new('/admin/pages/get/', {
			dataType: 'json',
			submitFn: function(){
				$treeContainer.empty();
			},
			successFn: function(response){
				tm.createBranch(response);
			},
			abortable: true,
			load: true
		}),
		getPage: AjaxManager.new('/admin/page/get/', {
			dataType: 'json',
			submitFn: function(){
				SidePanel.disableInputs();
			},
			abortable: true,
			load: true
		}),
		searchSession: AjaxManager.new('/admin/pages/search/', {
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			abortable: true,
			uniqueRequest: {
				url: true
			},
			initFn: function(){
				return {
					url: this.url + sessionNumber,
					ops: {}
				};
			},
			load: true,
			status: {
				enabled: false
			}
		}),
		addNode: AjaxManager.new('/admin/page/add', {
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json'
		}),
		deleteNode: AjaxManager.new('/admin/page/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateNode: AjaxManager.new('/admin/page/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: true
			}
		}),
		copyMoveNode: AjaxManager.new('/admin/page/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true
			}
		}),
		addCondition: AjaxManager.new('/admin/condition/add', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				data: true
			}
		}),
		deleteCondition: AjaxManager.new('/admin/condition/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		})
	};

	this.createBranch = function(nodeData, parentNode){
		var newTree = new Tree(parentNode);
		if(!parentNode)
		{
			rootTree = newTree;
		}
		$(nodeData).each(function(){
			var newNode = newTree.appendNode(this);
		});
	};
	this.showTreeTargets = function(sNode, request){
		if(this.selectedNode)
		{
			this.hideTreeTargets();
		}

		// set globally the selected node
		this.selectedNode = sNode;
		this.selectedNode.$treeNode.addClass("selected action-"+request);
		this.selectedNode.setRequest(request);

		// display we are copying / moving
		$("#targetAction").text(request);
		$pageContainer.addClass("show-targets");
	};
	this.hideTreeTargets = function(){
		// clear the selected node
		this.selectedNode.$treeNode.removeClass("selected action-"+this.selectedNode.request);
		this.selectedNode.clearRequest();
		this.selectedNode = null;

		//hide target display
		$pageContainer.removeClass("show-targets");
	};

	//Select/dropdown in header and trigger to load currently selected session
	$sessionSelect.on("change", function(){
		tm.sessionNumber = $(this).val();
		tm.ajax.getSession.submit(null, ajax.getSession.url + tm.sessionNumber);
	}).trigger("change");

	// Cancel button when moving/copying nodes
	$("#targetCancel").on("click",function(e){
		e.preventDefault();
		hideTreeTargets();
	});

	return null;
})(jQuery, BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm);
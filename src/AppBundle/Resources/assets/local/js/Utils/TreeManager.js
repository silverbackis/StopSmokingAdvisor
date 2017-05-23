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

	// All ajax
	this.ajax = {
		getSession: AjaxManager.newRequest('/admin/pages/get/', {
			dataType: 'json',
			submitFn: function(){
				$treeContainer.empty();
				SidePanel.hide();
				NodeManager.clear();
			},
			successFn: function(response){
				tm.createBranch(response);
			},
			abortable: true,
			load: true
		}),
		getPage: AjaxManager.newRequest('/admin/page/get/', {
			dataType: 'json',
			submitFn: function(){
				SidePanel.disableInputs();
			},
			abortable: true,
			load: true
		}),
		searchSession: AjaxManager.newRequest('/admin/pages/search/', {
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
		addNode: AjaxManager.newRequest('/admin/page/add', {
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json'
		}),
		deleteNode: AjaxManager.newRequest('/admin/page/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateNode: AjaxManager.newRequest('/admin/page/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: false
			}
		}),
		copyMoveNode: AjaxManager.newRequest('/admin/page/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true
			}
		}),
		addCondition: AjaxManager.newRequest('/admin/condition/add', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				data: true
			}
		}),
		deleteCondition: AjaxManager.newRequest('/admin/condition/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateQuestion: AjaxManager.newRequest('/admin/question/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: true
			}
		}),
		addAnswer: AjaxManager.newRequest('/admin/answer/add', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				data: true
			}
		}),
		deleteAnswer: AjaxManager.newRequest('/admin/answer/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateAnswer: AjaxManager.newRequest('/admin/answer/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: true
			}
		})
	};

	// Protected functions accessible from shild objects
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
		this.selectedNode.request = request;

		// display we are copying / moving
		$("#targetAction").text(request);
		$pageContainer.addClass("show-targets");
	};
	this.hideTreeTargets = function(){
		// clear the selected node
		this.selectedNode.$treeNode.removeClass("selected action-"+this.selectedNode.request);
		this.selectedNode.request = null;
		this.selectedNode = null;

		//hide target display
		$pageContainer.removeClass("show-targets");
	};
	this.hashObj = function (object){
		var string = JSON.stringify(object);

		var hash = 0,
		i = 0;
		if (string.length === 0) return hash;
		for (i; i < string.length; i++) {
			char = string.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
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
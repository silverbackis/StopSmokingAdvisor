(function(alert, confirm){
	var $treeContainer = $("#treeContainer"),
	$sessionSelect = $("#sessionSelect"),
	$pageContainer = $("#pageContainer"),
	sessionNumber = $sessionSelect.val(),
	debounceInterval = 250,
	selectedNode = null;

	function showTreeTargets(sNode, request){
		if(selectedNode)
		{
			hideTreeTargets();
		}

		selectedNode = sNode;
		selectedNode.$treeNode.addClass("selected");
		selectedNode.setRequest(request);
		$pageContainer.addClass("show-targets");
		$("#targetAction").text(request);
	}

	function hideTreeTargets(){
		selectedNode.$treeNode.removeClass("selected");
		selectedNode.clearRequest();
		selectedNode = null;
		$pageContainer.removeClass("show-targets");
	}

	function SearchMenu(parentNode)
	{
		var _self = this;
		this.$searchResultLink = $("<a />",{
			href: '#',
			class: 'dropdown-item'
		});
		this.$noSearchResults = this.$searchResultLink.clone().html('No results');
		this.$loadingSearchResults = this.$searchResultLink.clone().html('Loading...');
		this.$dropdownMenu = $("<div />",{
			class: 'dropdown-menu'
		}).append(
			this.$loadingSearchResults
		);

		this.parentNode = parentNode;
		this.$dropdown = this.parentNode.$nameInput.parent();
		this.$dropdown.addClass("dropdown");

		this.currentPage = {
			name: (null === this.parentNode.nodeData.forwardToPage ? '' : this.parentNode.nodeData.forwardToPage.name),
			id: (null === this.parentNode.nodeData.forwardToPage ? '' : this.parentNode.nodeData.forwardToPage.id)
		};

		this.parentNode.$nameInput
			.addClass("dropdown-toggle goto-pagename")
			.attr({
				"data-toggle": "dropdown",
				"data-gotoid": this.currentPage.id
			})
			.on("focus", function(){
				_self.parentNode.$nameInput.trigger("click");
				_self.parentNode.searchName();
			})
			.attr("value", this.currentPage.name);
		
		// Link allowing the menu to show and hide with whether the field is in focus
		this.$dropdown.on("hide.bs.dropdown", function(){
			if(_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		});
		this.$dropdown.on("hidden.bs.dropdown", function(){
			_self.updateSaved();
		});
		this.$dropdown.on("show.bs.dropdown", function(){
			if(!_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		});
	}
	SearchMenu.prototype.updateSaved = function(){
		this.parentNode.$nameInput
				.val(this.currentPage.name)
				.attr("data-gotoid", this.currentPage.id);
	};
	SearchMenu.prototype.hide = function(){
		this.parentNode.$nameInput.trigger("click");
	};
	SearchMenu.prototype.setLoading = function(){
		this.$dropdownMenu.empty();
		this.$dropdownMenu.append(this.$loadingSearchResults);
	};
	SearchMenu.prototype.setResults = function(results){
		this.$dropdownMenu.empty();
		if(results.length<1)
		{
			this.$dropdownMenu.append(this.$noSearchResults);
		}
		else
		{
			var _self = this;
			var $selectableLink = this.$searchResultLink.clone();

			$selectableLink.on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				var data = $(this).data("searchResult");
				_self.parentNode.$nameInput.val(data.name);
				ajax.updateNode.ops.successFn = function(response){
					_self.currentPage = {
						name: data.name,
						id: data.id
					};
					// update saved in case has been hidden in the mean-time
					_self.updateSaved();
					// hide the menu if showing
					_self.hide();

					_self.parentNode.$nameInput.attr("data-gotoid", response.forwardToPage.id);
					var nodeData = _self.parentNode.getData();
					nodeData.forwardToPage = response.forwardToPage;
					_self.parentNode.setData(nodeData);
				};

				ajax.updateNode.submit({
					forward_to_page: data.id
				}, ajax.updateNode.url + _self.parentNode.nodeData.id);
			});

			$(results).each(function(){
				_self.$dropdownMenu.append(
					$selectableLink
						.clone(true)
						.attr("href", "#"+this.id)
						.html(this.name)
						.data("searchResult", this)
				);
			});
			
		}
	};

	// Tree Object and proto
	function Tree(parentNode)
	{
		this.$ul = $("<ul />",{
			class: "node-tree"
		});

		if(!parentNode)
		{
			$("<span />",{
				class: 'session-starts',
				html: 'Session starts'
			})
			.appendTo($treeContainer)
			.after(this.$ul);
		}
		else
		{
			this.$ul.appendTo(parentNode.$node);
			parentNode.setChildTree(this);
		}

		this.nodes = [];
		this.parentNode = parentNode;
	}
	Tree.prototype.appendNode = function(nodeData){
		var newNode = new Node(nodeData, this);
		if(nodeData.sort===1)
		{
			this.nodes.unshift(newNode);
			newNode.$node.prependTo(this.$ul);
		}
		else
		{
			this.nodes.splice(nodeData.sort-1, 0, newNode);
			newNode.$node.insertAfter(this.nodes[nodeData.sort-2].$node);
		}
		this.updateSortValues();


		if(nodeData.children.length>0)
		{
			f.createTree(nodeData.children, newNode);
		}
		return newNode;
	};
	Tree.prototype.getNodes = function(){
		return this.nodes;
	};
	Tree.prototype.updateSortValues = function(){
		$(this.nodes).each(function(index){
			var nData = this.getData();
			nData.sort = index+1;
			this.setData(nData);
		});
	};
	Tree.prototype.removeNodeIndex = function(nodeIndex){
		this.nodes.splice(nodeIndex, 1);
		this.updateSortValues();
	};

	// Node Object and proto
	function Node(nodeData, tree)
	{
		var _self = this,
		nodeParent = this.getParentId(nodeData);

		this.debounceTimer = null;
		this.nodeData = nodeData;
		this.tree = tree;
		this.childTree = null;
		this.conditions = {};
		this.request = null;

		this.$nameInput = $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Page name'
		})
		.on("keyup blur", function(e){
			if(nodeData.type=='link' && e.type=='blur')
			{
				return;
			}
			var ms = e.type==='blur' ? 1 : null;
			_self.debounce(nodeData.type!=='link' ? _self.updateName : _self.searchName, ms);
		});

		var $inputGroup = $("<div />",{
				class: 'input-group'
			}),
			$nameInputGroup = $inputGroup.clone().append(
				this.$nameInput
			);
		if(nodeData.type!=='link')
		{
			this.$nameInput.attr("value", nodeData.name);
		}
		else
		{
			this.SearchMenu = new SearchMenu(this);

			$nameInputGroup.append(
				this.SearchMenu.$dropdownMenu
			);
		}		

		this.$conditionInput = $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Condition'
		});
		this.$addConditionButton = $("<a />",{
			href: '#',
			class: 'btn btn-primary condition-add',
			html: '&nbsp;'
		}).on("click", function(){
			ajax.addCondition.ops.successFn = function(response){
				_self.appendCondition(response);
			};
			ajax.addCondition.submit({
				pageID: _self.nodeData.id,
				condition: _self.$conditionInput.val()
			});
		});
		this.$conditions = $("<div />",{
			class: 'conditions'
		});
		this.$treeNode = $("<div />",{
			class: 'tree-node',
			id: 'node_'+nodeData.id
		});

		var $nodeAddPage = $("<a />",{
				href: '#',
				class: 'node-add page',
				html: 'Add Page'
			}),
			$nodeAddLink = $("<a />",{
				href: '#',
				class: 'node-add link',
				html: 'Add Link'
			}),
			$nodeTargetLink = $("<a />",{
				href: '#',
				class: 'node-target',
				html: 'select target location'
			}),
			$dropupDivider = $("<div />",{
				class: 'dropdown-divider'
			}),
			$nodeInner = $("<div />",{
				class: 'node-inner'
			}).append(
				$nameInputGroup
			).append(
				$inputGroup.clone().append(
					this.$conditionInput
				).append(
					$("<span />",{
						class: 'input-group-addon'
					}).append(
						this.$addConditionButton
					)
				)
			).append(
				this.$conditions
			),
			$nodeBarRight = $("<div />",{
				class: 'node-bar right'
			}).append(
				$("<div />",{
					class: 'btn-group dropup'
				}).append(
					$("<div />",{
						class: 'dropdown-menu node'
					}).append(
						$("<a />",{
							href: '#',
							class: 'dropdown-item',
							html: 'Move'
						}).on("click", function(){
							showTreeTargets(_self, 'move');
						})
					).append(
						$dropupDivider.clone()
					).append(
						$("<a />",{
							href: '#',
							class: 'dropdown-item',
							html: 'Copy'
						}).on("click", function(){
							showTreeTargets(_self, 'copy');
						})
					).append(
						$dropupDivider.clone()
					).append(
						$("<a />",{
							href: '#',
							class: 'dropdown-item',
							html: 'Delete'
						}).on("click", function(e){
							e.preventDefault();
							confirm("Are you sure you want to delete this node and all of its children?", {
								title: 'Are you sure?'
							}, function(e, confirmed, bsma){ 
								if(confirmed)
								{
									ajax.deleteNode.ops.successFn = function(){
										_self.remove();
									};
									ajax.deleteNode.submit({}, ajax.deleteNode.url + nodeData.id);
								} 
							});
						})
					)
				).append(
					$("<a />",{
						href: '#',
						class: 'node-menu',
						'data-toggle': 'dropdown'
					}).append(
						$("<div />",{
							class: 'icon',
							html: 'Menu'
						})
					)
				)
			);

		if(nodeData.type!=='link')
		{
			$nodeInner.append(
				$("<a />",{
					href: '/admin/edit/'+nodeData.id,
					class: 'btn btn-primary',
					html: 'Open'
				})
			);
			$nodeBarRight.append(
				$("<span />",{
					class: 'node-add-group'
				}).append(
					$nodeAddPage.clone()
					.on("click", function(e){
						e.preventDefault();

						ajax.addNode.ops.successFn = function(response){
							_self.addNodeByData(true, response);
						};
						ajax.addNode.submit({
							session: sessionNumber,
							parent: nodeData.id,
							sort: 1,
							type: 'page'
						});
					})
				).append(
					$nodeAddLink.clone()
					.on("click", function(e){
						e.preventDefault();

						ajax.addNode.ops.successFn = function(response){
							_self.addNodeByData(true, response);
						};
						ajax.addNode.submit({
							session: sessionNumber,
							parent: nodeData.id,
							sort: 1,
							type: 'link'
						});
					})
				).append(
					$nodeTargetLink.clone()
					.on("click", function(e){
						e.preventDefault();
						_self.setCopyMoveAjax(true);
					})
				)
			);
		}
		else
		{
			$nodeInner.prepend(
				$("<span />",{
					class: 'node-goto-header',
					html: 'Go to'
				})
			);
		}

		$(nodeData.conditions).each(function(){
			_self.appendCondition(this);
		});
		this.$node = $("<li />",{
			class: "tree-li"
		}).append(
			this.$treeNode.append(
				$("<div />",{
					class: 'item-node'
				}).append(
					$nodeInner
				).append(
					$("<div />",{
						class: 'node-bar bottom'
					}).append(
						$nodeAddPage.clone()
						.on("click", function(e){
							e.preventDefault();
							ajax.addNode.ops.successFn = function(response){
								_self.addNodeByData(false, response);
							};
							ajax.addNode.submit({
								session: sessionNumber,
								parent: nodeParent,
								sort: nodeData.sort+1,
								type: 'page'
							});
						})
					).append(
						$nodeAddLink.clone()
						.on("click", function(e){
							e.preventDefault();
							ajax.addNode.ops.successFn = function(response){
								_self.addNodeByData(false, response);
							};
							ajax.addNode.submit({
								session: sessionNumber,
								parent: nodeParent,
								sort: nodeData.sort+1,
								type: 'link'
							});
						})
					)
					.append(
						$nodeTargetLink.clone()
						.on("click", function(e){
							e.preventDefault();
							_self.setCopyMoveAjax(false);
						})
					)
				)
				.append(
					$nodeBarRight
				)
			)
		).append(
			$("<div />",{
				class: 'tree-icon-question-answer'
			})
		).data("nodeData",{
			id: nodeData.id,
			parent: nodeData.parent,
			sort: nodeData.sort
		});
	}
	Node.prototype.getData = function(){
		return this.$node.data("nodeData");
	};
	Node.prototype.setData = function(data){
		this.$node.data("nodeData", data);
		this.nodeData = data;
	};
	Node.prototype.setChildTree = function(childTree){
		this.childTree = childTree;
	};
	Node.prototype.remove = function(){
		if(this.childTree)
		{
			$(this.childTree.nodes).each(function(){
				this.remove();
			});
			this.childTree = undefined;
		}
		this.tree.removeNodeIndex(this.getData().sort-1);
		this.$node.remove();
	};
	Node.prototype.debounce = function(fn, ms){
		_self = this;
    	clearTimeout(_self.debounceTimer);
        _self.debounceTimer = setTimeout(function(){
            fn.call(_self);
        }, ms || debounceInterval);
	};
	Node.prototype.updateName = function(){
		var _self = this,
		data = {
			name: this.$nameInput.val()
		};
		ajax.updateNode.ops.successFn = function(){
			_self.bindUpdatedName.call(_self);
		};
		ajax.updateNode.submit(data, ajax.updateNode.url + this.nodeData.id);	
	};
	Node.prototype.bindUpdatedName = function(){
		$(".goto-pagename[data-gotoid="+this.nodeData.id+"]").val(this.$nameInput.val());
	};
	Node.prototype.searchName = function(){
		var _self = this;
		this.SearchMenu.setLoading();

		ajax.searchSession.ops.successFn = function(response){
			_self.SearchMenu.setResults(response);
		};
		ajax.searchSession.submit({
			search: this.$nameInput.val()
		});		
	};
	Node.prototype.appendCondition = function(conditionData){
		var newCondition = new Condition(conditionData, this);
		this.conditions[conditionData.id] = newCondition;
		this.$conditions.append(
			newCondition.$condition
		);
		this.$conditionInput.val("");
	};
	Node.prototype.setRequest = function(request){
		this.request = request;
	};
	Node.prototype.clearRequest = function(){
		this.request = null;
	};
	Node.prototype.setCopyMoveAjax = function(child){
		var sourceNode = selectedNode,
		type = sourceNode.request,
		targetNode = this;
		var data = {
			parent: child ? targetNode.nodeData.id : targetNode.getParentId(),
			sort: child ? 1 : targetNode.nodeData.sort+1
		};
		ajax.copyMoveNode.ops.successFn = function(nodeData){
			sourceNode[type](targetNode, child, nodeData);
		};
		ajax.copyMoveNode.submit(data, ajax.copyMoveNode.url + type + '/' + sourceNode.nodeData.id);
	};
	Node.prototype.getParentId = function(nodeData){
		if(!nodeData)
		{
			nodeData = this.getData();
		}
		return (null === nodeData.parent ? null : (nodeData.parent.id ? nodeData.parent.id : nodeData.parent));
	};
	Node.prototype.copy = function(targetNode, child, nodeData){
		targetNode.addNodeByData(child, nodeData);
		hideTreeTargets();
	};
	Node.prototype.move = function(targetNode, child, nodeData){
		this.copy(targetNode, child, nodeData);
		// delete this node visually now we have added as a new mode wherever it is meant to be
		this.remove();
	};
	Node.prototype.addNodeByData = function(child, nodeData){
		if(child)
		{
			if(this.childTree)
			{
				this.childTree.appendNode(nodeData);
			}
			else
			{
				//we have to add the child tree
				f.createTree([nodeData], this);
			}
		}
		else
		{
			this.tree.appendNode(nodeData);
		}
	};

	// Condition object and protos
	function Condition(conditionData, Node)
	{
		var _self = this;
		this.Node = Node;
		this.conditionData = conditionData;
		this.$condition = $("<a />",{
			class: 'btn btn-secondary btn-sm',
			href: '#',
			html: conditionData.condition+'&nbsp;&nbsp;',
			id: 'condition_'+conditionData.id
		}).append(
			$("<span />",{
				class: 'text-danger',
				html: '&times;'
			})
		).on("click", function(e){
			e.preventDefault();
			ajax.deleteCondition.ops.successFn = function(response){
				_self.remove();	
			};
			ajax.deleteCondition.submit({}, ajax.deleteCondition.url + _self.conditionData.id);
		});
	}
	Condition.prototype.remove = function(id){
		delete this.Node.conditions[this.conditionData.id];
		this.$condition.remove();
	};

	//general functions
	var f = {
		createTree: function(nodeData, parentNode){
			var newTree = new Tree(parentNode);
			$(nodeData).each(function(){
				var newNode = newTree.appendNode(this);
			});
		}
	};
	var ajax = {
		getSession: AjaxManager.new('/admin/pages/get/', {
			dataType: 'json',
			submitFn: function(){
				$treeContainer.empty();
			},
			successFn: function(response){
				f.createTree(response);
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

	// Setup main interface for getting tree data
	$sessionSelect.on("change", function(){
		sessionNumber = $(this).val();
		ajax.getSession.submit(null, ajax.getSession.url + sessionNumber);
	}).trigger("change");

	$("#targetCancel").on("click",function(e){
		e.preventDefault();
		hideTreeTargets();
	});
})(BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm);
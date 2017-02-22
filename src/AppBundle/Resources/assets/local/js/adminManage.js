(function(){
	var $treeContainer = $("#treeContainer"),
	$sessionSelect = $("#sessionSelect"),
	$pageContainer = $("#pageContainer"),
	sessionNumber = $sessionSelect .val(),
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
		this.parentNode.$nameInput
			.addClass("dropdown-toggle")
			.attr("data-toggle", "dropdown")
			.on("focus", function(){
				_self.parentNode.$nameInput.trigger("click");
			});
		
		this.$dropdown.on("hide.bs.dropdown", function(){
			if(_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		});

		this.$dropdown.on("show.bs.dropdown", function(){
			if(!_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		});
	}
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
				f.ajax.updateNode(_self.parentNode.nodeData.id, {
					forward_to_page: data.id
				}, function(response){
					_self.hide();

					_self.parentNode.$nameInput.attr("data-gotoid", response.forwardToPage.id);
					var nodeData = _self.parentNode.getData();
					nodeData.forwardToPage = response.forwardToPage;
					_self.parentNode.setData(nodeData);
				});
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

		this.$nameInput = $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Page name'
		}).on("keyup blur", function(e){
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

			this.$nameInput.attr("value", (null === nodeData.forwardToPage ? '' : nodeData.forwardToPage.name));

			this.$nameInput.on("focus", function(e){
				_self.searchName();
			})
			.addClass("goto-pagename")
			.attr("data-gotoid", (null === nodeData.forwardToPage ? '' : nodeData.forwardToPage.id));

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
			f.ajax.addCondition.call(_self);
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
							f.ajax.deleteNode.call(_self, nodeData.id);
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

		this.debounceTimer = null;
		this.nodeData = nodeData;
		this.tree = tree;
		this.childTree = null;
		this.conditions = {};
		this.request = null;

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
						f.ajax.addNode.call(_self, 'page', nodeData.id, 1, true);
					})
				).append(
					$nodeAddLink.clone()
					.on("click", function(e){
						e.preventDefault();
						f.ajax.addNode.call(_self, 'link', nodeData.id, 1, true);
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
							f.ajax.addNode.call(_self, 'page', nodeParent, nodeData.sort+1);
						})
					).append(
						$nodeAddLink.clone()
						.on("click", function(e){
							e.preventDefault();
							f.ajax.addNode.call(_self, 'link', nodeParent, nodeData.sort+1);
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
		var data = {
			name: this.$nameInput.val()
		};
		f.ajax.updateNode(this.nodeData.id, data, this.bindUpdatedName.call(this));		
	};
	Node.prototype.bindUpdatedName = function(){
		$(".goto-pagename[data-gotoid="+this.nodeData.id+"]").val(this.$nameInput.val());
	};
	Node.prototype.searchName = function(){
		this.SearchMenu.setLoading();
		f.ajax.searchSession(this);		
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
		f.ajax.copyMoveNode.call(selectedNode, this, child);
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
			f.ajax.deleteCondition.call(_self);
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
				if(this.children.length>0)
				{
					f.createTree(this.children, newNode);
				}
			});
		},
		ajaxError: function(err){
			console.warn(arguments);
			if(typeof err.responseJSON == 'object')
			{
				if(err.responseJSON.errors)
				{
					$(err.responseJSON.errors).each(function(){
						alert(this);
					});
				}else{
					alert("An unknown error occured. Sorry for the inconvenience.");
				}
			}
			else
			{
				alert("Error processing your request: "+err.responseText);
			}
		},
		ajax: {
			getSession: function(session){
				$treeContainer.empty();
				$.ajax({
					type: "GET",
					url: '/admin/pages/get/'+session,
					dataType: 'json',
					success: function(nodeData){
						f.createTree(nodeData);
					},
					error: f.ajaxError
				});
			},
			searchSession: function(searchNode){
				var search = searchNode.$nameInput.val();
				$.ajax({
					type: "POST",
					url: '/admin/pages/search/'+sessionNumber,
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify({
						search: search
					}),
					success: function(pageResults){
						searchNode.SearchMenu.setResults(pageResults);
					},
					error: f.ajaxError
				});
			},
			addNode: function(type, parent, sort, childTree){
				var currentNode = this;
				$.ajax({
					type: "POST",
					url: '/admin/page/add',
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify({
						session: sessionNumber,
						parent: parent,
						sort: sort,
						type: type
					}),
					success: function(nodeData){
						currentNode.addNodeByData(childTree, nodeData);
					},
					error: f.ajaxError
				});
			},
			deleteNode: function(id){
				var dNode = this;
				$.ajax({
					type: "GET",
					url: '/admin/page/delete/'+id,
					dataType: 'json',
					success: function(response){
						dNode.remove();
					},
					error: f.ajaxError
				});
			},
			updateNode: function(id, data, fn){
				$.ajax({
					type: "POST",
					url: '/admin/page/update/'+id,
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify(data),
					success: function(response){
						if(fn){
							fn(response);
						}
					},
					error: f.ajaxError
				});
			},
			copyMoveNode: function(targetNode, child){
				var sourceNode = this,
				type = this.request;
				var data = {
					parent: child ? targetNode.nodeData.id : targetNode.getParentId(),
					sort: child ? 1 : targetNode.nodeData.sort
				};
				$.ajax({
					type: "POST",
					url: '/admin/page/'+type+'/'+this.nodeData.id,
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify(data),
					success: function(nodeData){
						sourceNode[type](targetNode, child, nodeData);
					},
					error: f.ajaxError
				});
			},
			addCondition: function(){
				var node = this;
				$.ajax({
					type: "POST",
					url: '/admin/condition/add',
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify({
						pageID: node.nodeData.id,
						condition: node.$conditionInput.val()
					}),
					success: function(conditionData){
						node.appendCondition(conditionData);
					},
					error: f.ajaxError
				});
			},
			deleteCondition: function(){
				var dCondition = this;
				$.ajax({
					type: "GET",
					url: '/admin/condition/delete/'+dCondition.conditionData.id,
					dataType: 'json',
					success: function(response){
						dCondition.remove();	
					},
					error: f.ajaxError
				});
			}
		}
	};

	// Setup main interface for getting tree data
	$sessionSelect.on("change", function(){
		sessionNumber = $(this).val();
		f.ajax.getSession(sessionNumber);
	});
	f.ajax.getSession(sessionNumber);

	$("#targetCancel").on("click",function(e){
		e.preventDefault();
		hideTreeTargets();
	});
})();
(function(){
	var $treeContainer = $("#treeContainer"),
	$sessionSelect = $("#sessionSelect"),
	sessionNumber = $sessionSelect .val();

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
	Tree.prototype.addNode = function(nodeData){
		var newNode = new Node(nodeData, this);
		if(nodeData.sort===1)
		{
			this.nodes.unshift(newNode);
			newNode.$node.prependTo(this.$ul);
		}
		else
		{
			newNode.$node.insertAfter(this.nodes[nodeData.sort-2].$node);
			this.nodes.splice(nodeData.sort-1, 0, newNode);
		}
		return newNode;
	};
	Tree.prototype.getNodes = function(){
		return this.nodes;
	};
	Tree.prototype.updateSortValues = function(){
		$(this.nodes).each(function(index, node){
			var nData = node.getData();
			nData.sort = index+1;
			node.setData(nData);
		});
	};
	Tree.prototype.removeNodeIndex = function(nodeIndex){
		this.nodes.splice(nodeIndex, 1);
		this.updateSortValues();
	};


	// Node Object and proto
	function Node(nodeData, tree)
	{
		var _self = this;

		this.nodeData = nodeData;
		this.tree = tree;
		this.childTree = null;

		var nodeParent = (null === nodeData.parent ? null : (nodeData.parent.id ? nodeData.parent.id : nodeData.parent));

		var $inputGroup = $("<div />",{
			class: 'input-group'
		}),
		$nodeAddPage = $("<a />",{
			href: '#',
			class: 'node-add page',
			html: 'Add Page'
		}),
		$nodeAddLink = $("<a />",{
			href: '#',
			class: 'node-add link',
			html: 'Add Link'
		}),
		$dropupDivider = $("<div />",{
			class: 'dropdown-divider'
		});

		this.$node = $("<li />",{
			class: "tree-li"
		}).append(
			$("<div />",{
				class: 'tree-node',
				id: 'node'+nodeData.id
			}).append(
				$("<div />",{
					class: 'item-node'
				}).append(
					$("<div />",{
						class: 'node-inner'
					}).append(
						$inputGroup.clone().append(
							$("<input />",{
								type: 'text',
								class: 'form-control',
								placeholder: 'Page name',
								value: nodeData.name
							})
						)
					).append(
						$inputGroup.clone().append(
							$("<input />",{
								type: 'text',
								class: 'form-control',
								placeholder: 'Condition'
							})
						).append(
							$("<span />",{
								class: 'input-group-addon'
							}).append(
								$("<a />",{
									href: '#',
									class: 'btn btn-primary condition-add',
									html: '&nbsp;'
								})
							)
						)
					).append(
						$("<div />",{
							class: 'conditions'
						}).append(
							_self.createCondition('test > 5')
						)
					).append(
						$("<a />",{
							href: '/admin/edit/'+nodeData.id,
							class: 'btn btn-primary',
							html: 'Open'
						})
					)
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
				)
				.append(
					$("<div />",{
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
								})
							).append(
								$dropupDivider.clone()
							).append(
								$("<a />",{
									href: '#',
									class: 'dropdown-item',
									html: 'Duplicate'
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
					).append(
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
						)
					)
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
	};
	Node.prototype.setChildTree = function(childTree){
		this.childTree = childTree;
	};
	Node.prototype.createCondition = function(condition){
		var $condition = $("<a />",{
			class: 'btn btn-secondary btn-sm',
			href: '#',
			html: condition+'&nbsp;&nbsp;'
		}).append(
			$("<span />",{
				class: 'text-danger',
				html: '&times;'
			})
		);
		return $condition;
	};
	Node.prototype.delete = function(removeTree){
		if(this.childTree)
		{
			$(this.childTree.nodes).each(function(index, childNode){
				childNode.delete(true);
			});
			this.childTree = undefined;
		}
		if(removeTree)
		{
			this.tree = undefined;
		}
		else
		{
			this.tree.removeNodeIndex(this.nodeData.sort);
		}
		this.$node.remove();
	};

	//general functions
	var f = {
		generateTree: function(nodeData, parentNode){
			var newTree = new Tree(parentNode);
			$(nodeData).each(function(index, nodeData){
				var newNode = newTree.addNode(nodeData);
				if(nodeData.children.length>0)
				{
					f.generateTree(nodeData.children, newNode);
				}
			});
		},
		ajaxError: function(err){
			console.warn(arguments);
			if(err.responseJson)
			{
				console.warn(err.responseJson);
				if(err.responseJson.errors)
				{
					$(err.responseJson.errors).each(function(index, message){
						alert(message);
					});
				}else{
					alert("An unknown error occured. Sorry for the inconvenience.");
				}
			}else{
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
						f.generateTree(nodeData);
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
						if(childTree)
						{
							if(currentNode.childTree)
							{
								currentNode.childTree.addNode(nodeData);
							}
							else
							{
								//we have to add the child tree
								f.generateTree([nodeData], currentNode);
							}
						}
						else
						{
							currentNode.tree.addNode(nodeData);
						}
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
						dNode.delete();
					},
					error: f.ajaxError
				});
			},
			copyNode: function(id, parent, sort){
				$.ajax({
					type: "POST",
					url: '/admin/page/copy/'+id,
					dataType: 'json',
					data:{
						parent: parent,
						sort: sort
					},
					success: function(response){
					},
					error: f.ajaxError
				});
			},
			moveNode: function(id, parent, sort){
				$.ajax({
					type: "POST",
					url: '/admin/page/move/'+id,
					dataType: 'json',
					data:{
						parent: parent,
						sort: sort
					},
					success: function(response){
					},
					error: f.ajaxError
				});
			},
			addCondition: function(id, condition){
				$.ajax({
					type: "POST",
					url: '/admin/condition/add',
					dataType: 'json',
					data:{
						pageID: id,
						condition: condition
					},
					success: function(response){
					},
					error: f.ajaxError
				});
			},
			deleteCondition: function(id){
				$.ajax({
					type: "GET",
					url: '/admin/condition/delete/'+id,
					dataType: 'json',
					success: function(response){
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
})();
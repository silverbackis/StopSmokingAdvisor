import { newInput, requests as ajax } from '../../Utils/AjaxManager'
import SidePanel from '../../Utils/SidePanel'
import Condition from './Condition'
import BootstrapModalAlerts from '../../../../global/BootstrapModalAlerts'
import SearchMenu from './SearchMenu'

// Node Object and proto
function Node(nodeData, tree)
{
	let _self = this,
	nodeParent = this.getParentId(nodeData);

	this.debounceTimer = null;
	this.nodeData = nodeData;
	this.tree = tree;
	this.childBranch = null;
	this.conditions = {};
	this.request = null;
	this.inputs = [];
	this.opened = false;

	this.$nameInput = $("<input />",{
		type: 'text',
		class: 'form-control',
		placeholder: 'Page name'
	});
	this.$pageStatus = $("<div />", {
		class: 'page-status'
	});
	this.updatePageStatus();

	if(nodeData.type === 'link')
	{
		this.$nameInput.attr({
			"data-column": "name"
		});
		this.$nameInput.on("keyup", function(e){
			_self.debounce(_self.searchName);
		});
	}
	else
	{
		this.$nameInput.attr({
			"data-column": "name"
		});
		this.inputs.push(newInput(this.$nameInput, this.nodeData.id));
	}

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
		this.LocalSearchMenu = new SearchMenu(this);
		$nameInputGroup.append(
			this.LocalSearchMenu.$dropdownMenu
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
			_self.addCondition(response);
		};
		ajax.addCondition.submit({
			page: _self.nodeData.id,
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
	const TreeManager = require('../../Utils/TreeManager').default
	const showTreeTargets = TreeManager.showTreeTargets

	let $nodeAddPage = $("<a />",{
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
					class: 'input-group-append'
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
            BootstrapModalAlerts.confirm("Are you sure you want to delete this node and all of its children?", {
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
				href: '#',
				class: 'btn btn-primary',
				html: 'Open'
			}).on("click", function(e){
				e.preventDefault();
				SidePanel.show(_self.nodeData.id);
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
		_self.addCondition(this);
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
				.append(
					this.$pageStatus
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
	);

}
Node.prototype.debounce = function(fn, ms)
{
	var _self = this;
	clearTimeout(_self.debounceTimer);
    _self.debounceTimer = setTimeout(function(){
        fn.call(_self);
    }, ms || 250);
};
Node.prototype.searchName = function()
{
	var _self = this;
	this.LocalSearchMenu.setLoading();

	ajax.searchSession.ops.successFn = function(response){
		_self.LocalSearchMenu.setResults(response);
	};
	ajax.searchSession.submit({
		search: this.$nameInput.val()
	});
};
Node.prototype.updatePageStatus = function()
{
	this.$pageStatus.removeClass("text-success text-muted");
	if(this.nodeData.live)
	{
		this.$pageStatus.html("Live").addClass("text-success");
	}
	else
	{
		this.$pageStatus.html("Draft").addClass("text-muted");
	}
};
Node.prototype.getParentId = function(nodeData){
	if(!nodeData)
	{
		nodeData = this.nodeData;
	}
	return (null === nodeData.parent ? null : (nodeData.parent.id ? nodeData.parent.id : nodeData.parent));
};
Node.prototype.addNodeByData = function(child, nodeData){
	if(child)
	{
		if(this.childBranch)
		{
			this.childBranch.appendNode(nodeData);
		}
		else
		{
      const TreeManager = require('../../Utils/TreeManager').default
			//we have to add the child tree
      TreeManager.createBranch([nodeData], this);
		}
	}
	else
	{
		this.tree.appendNode(nodeData);
	}
};
Node.prototype.setCopyMoveAjax = function(child){
  const TreeManager = require('../../Utils/TreeManager').default
	var sourceNode = TreeManager.selectedNode,
	type = sourceNode.request,
	targetNode = this;
	var data = {
		parent: child ? targetNode.nodeData.id : targetNode.getParentId(),
		sort: child ? 1 : targetNode.nodeData.sort+1,
		session: targetNode.nodeData.session
	};
	// change the sort if we are moving to the same tree/branch just later in the list
	// e.g. if we are at sort position 1, and we want to move it to beneath sort position 2
	// then position 2 will become position 1, so this sort actually needs to be 2, not 3 - reduce by 1
	if(type==='move' &&
		!child &&
		sourceNode.tree.$ul[0] === targetNode.tree.$ul[0] &&
		targetNode.nodeData.sort > sourceNode.nodeData.sort)
	{
		data.sort--;
	}
	ajax.copyMoveNode.ops.successFn = function(nodeData){
		sourceNode[type](targetNode, child, nodeData);
	};
	ajax.copyMoveNode.submit(data, ajax.copyMoveNode.url + type + '/' + sourceNode.nodeData.id);
};
Node.prototype.copy = function(targetNode, child, nodeData){
  const TreeManager = require('../../Utils/TreeManager').default
	targetNode.addNodeByData(child, nodeData);
  TreeManager.hideTreeTargets();
};
Node.prototype.remove = function(){
	if(this.childBranch)
	{
		$(this.childBranch.nodes).each(function(){
			this.remove();
		});
		this.childBranch = undefined;
	}
	this.tree.removeNodeIndex(this.nodeData.sort-1);
	
	$(".goto-pagename[data-gotoid="+this.nodeData.id+"]").val("");

	this.$node.remove();
};
Node.prototype.move = function(targetNode, child, nodeData){
	this.remove();
	this.copy(targetNode, child, nodeData);
};
Node.prototype.setEditing = function(set)
{
	var editingCls = "editing";
	this.opened = set;
	if(set)
	{
		if(!this.$treeNode.hasClass("editing"))
		{
			this.$treeNode.addClass("editing");
		}
	}
	else
	{
		if(this.$treeNode.hasClass("editing"))
		{
			this.$treeNode.removeClass("editing");
		}
	}
};
Node.prototype.addCondition = function(conditionData){
	var newCondition = new Condition(conditionData, this.nodeData.id);
	this.conditions[conditionData.id] = newCondition;
	this.$conditions.append(
		newCondition.$condition
	);
	this.$conditionInput.val("");

	if(this.opened)
	{
		SidePanel.addCondition(newCondition);
	}
};
Node.prototype.removeCondition = function(conditionID){
	this.conditions[conditionID].$condition.remove();
	if(this.opened)
	{
		SidePanel.removeCondition(this.conditions[conditionID]);
	}
	this.conditions[conditionID] = undefined;
};
export default Node;

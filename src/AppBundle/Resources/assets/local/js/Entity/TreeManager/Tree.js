import NodeManager from '../../Utils/NodeManager'
import TreeManager from '../../Utils/TreeManager'

// Tree Object and proto
function Tree(parentNode, $treeContainer)
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
		parentNode.childBranch = this;
	}

	this.nodes = [];
	this.parentNode = parentNode;
}
Tree.prototype.appendNode = function(nodeData){
	var newNode = NodeManager.new(nodeData, this);
	if(nodeData.sort===1)
	{
		newNode.$node.prependTo(this.$ul);
		this.nodes.unshift(newNode);
	}
	else
	{
		var sortToIndex = nodeData.sort-1;
		newNode.$node.insertAfter(this.nodes[sortToIndex-1].$node);
		this.nodes.splice(sortToIndex, 0, newNode);
	}
	this.updateSortValues();

	if(nodeData.children.length>0)
	{
    TreeManager.createBranch(nodeData.children, newNode);
	}
	return newNode;
};
Tree.prototype.getNodes = function(){
	return this.nodes;
};
Tree.prototype.updateSortValues = function(){
	$(this.nodes).each(function(index){
		this.nodeData.sort = index+1;
	});
};
Tree.prototype.removeNodeIndex = function(nodeIndex){
	this.nodes.splice(nodeIndex, 1);
	this.updateSortValues();
};
export default Tree;

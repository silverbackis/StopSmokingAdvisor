var NodeManager = (function($, alert, confirm){
	var nodes = {};

	var public = {
		new: function(nodeData, treeBranch){
			var newNode = new Node(nodeData, treeBranch);
			nodes[newNode.nodeData.id] = newNode;
			return newNode;
		},
		get: function(nodeID)
		{
			return nodes[nodeID];
		},
		clear: function(){
			nodes = {};
		}
	};
	return public;
})(jQuery, BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm);
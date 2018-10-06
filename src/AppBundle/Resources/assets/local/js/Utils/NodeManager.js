import jQuery from 'jquery'
import BootstrapModalAlerts from '../../../global/BootstrapModalAlerts'
import Node from '../Entity/NodeManager/Node'

const NodeManager = (function($, alert, confirm){
	let nodes = {};

	return {
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
})(jQuery, BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm);

export default NodeManager

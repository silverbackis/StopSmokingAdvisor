import jQuery from 'jquery'
import BootstrapModalAlerts from '../../../global/BootstrapModalAlerts'
import { requests } from './AjaxManager'
import Tree from '../Entity/TreeManager/Tree'

export const $treeContainer = $("#treeContainer");

const TreeManagerCls = function($, alert, confirm) {
	// References only for in this object
	var tm = this,
	$sessionSelect = $("#sessionSelect"),
	$pageContainer = $("#pageContainer"),
	rootTree;

	requests.getSession.extendFn('submit', () => {
    $treeContainer.empty();
	})
  requests.getSession.extendFn('success', (response) => {
    tm.createBranch(response);
  })

	// Referenced and updatable vars from Entities
	this.selectedNode = null;
	this.sessionNumber = $sessionSelect.val();
	window.sessionNumber = this.sessionNumber

	// All ajax
	this.ajax = requests

	// Protected functions accessible from shild objects
	this.createBranch = (nodeData, parentNode) => {
		const newTree = new Tree(parentNode, $treeContainer);
		if(!parentNode)
		{
			rootTree = newTree;
		}
		$(nodeData).each(function(){
			newTree.appendNode(this);
		});
	};
	this.showTreeTargets = (sNode, request) => {
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
	this.hideTreeTargets = () => {
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
			const char = string.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	};

	//Select/dropdown in header and trigger to load currently selected session
	$sessionSelect.on("change", function(){
		tm.sessionNumber = $(this).val();
		tm.ajax.getSession.submit(null, tm.ajax.getSession.url + tm.sessionNumber);
	}).trigger("change");

	// Cancel button when moving/copying nodes
	$("#targetCancel").on("click", (e) => {
		e.preventDefault();
		this.hideTreeTargets();
	});
}

export const TreeManager = new TreeManagerCls(jQuery, BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm)

export default TreeManager;

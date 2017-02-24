function SidePanel()
{
	var _self = this;

	this.$panel = $(".right-bar");
	this.selectedNode = null;
	this.$draftToggle = $("#liveToggle");
	this.$draftToggleText = $("#liveToggleText");
	this.$previewButton = $("#previewButton");
	this.$mediaSelect = $("#mediaSelect");
	this.$dataInputs = $("[data-column]", this.$panel);
	this.$fieldset = $("fieldset", this.$panel);
	this.$selects = $("select", this.$panel);
	this.$wysiwyg = $('#pageTextEdit');

	// close the panel
	$(".close-sidebar").on("click", function(e){
		e.preventDefault();
		SidePanel.hide();
	});

	// disable preview button for now
	this.$previewButton.on("click", function(e){
		e.preventDefault();
		alert("Sorry, this feature is not currently available. There is no user front-end yet.", { title: 'Not available yet' });
	});

	// change text (draft/live) for the toggle
	this.$draftToggle.on("change", function(){
		if(_self.$draftToggle.is(":checked"))
		{
			_self.$draftToggleText.html("Live");
		}
		else
		{
			_self.$draftToggleText.html("Draft");
		}
	}).trigger("change");

	this.$mediaSelect.on("change", function(){
		$(".media-tab-type:not(.hidden)").addClass("hidden");
		$("#media-tab-"+$(this).val()).removeClass("hidden");
	}).trigger("change");

	// Page text editor
	$.trumbowyg.svgPath = '/bundles/app/svg/icons.svg';
	this.$wysiwyg.trumbowyg({
	    btns: [['viewHTML'], ['strong', 'em'], ['link']],
	    autogrow: true
	});

	// ajax inputs
	this.$dataInputs.each(function(){
		new AjaxInput($(this));
	});
}
SidePanel.prototype.show = function(Node)
{
	if(this.selectedNode)
	{
		this.hide();
	}

	this.$panel.addClass("show");
	Node.$treeNode.addClass("editing");
	this.selectedNode = Node;
	// load in cache and disable inputs while we refresh the data
	this.load();
	this.disableInputs();
	ajax.getPage.ops.successFn = function(nodeData){
		Node.nodeData = nodeData;
		SidePanel.load();
		SidePanel.enableInputs();
	};
	ajax.getPage.submit({}, ajax.getPage.url + this.selectedNode.nodeData.id);
};
SidePanel.prototype.hide = function()
{
	if(this.selectedNode)
	{
		this.$panel.removeClass("show");
		this.selectedNode.$treeNode.removeClass("editing");
		this.selectedNode = null;
	}
};
SidePanel.prototype.disableInputs = function()
{
	this.$fieldset.add(this.$selects).prop("disabled", true);
	this.$selects.selectpicker('refresh');
	this.$wysiwyg.trumbowyg('disable');
};
SidePanel.prototype.enableInputs = function()
{
	this.$fieldset.add(this.$selects).prop("disabled", false);
	this.$selects.selectpicker('refresh');
	this.$wysiwyg.trumbowyg('enable');

};
SidePanel.prototype.load = function()
{
	var data = this.selectedNode.nodeData;

	this.$dataInputs.attr("data-id", data.id).each(function(){
		var $input = $(this),
		key = $input.attr("data-column"),
		value = data[$input.attr("data-column")];
		if(typeof value=='undefined')
		{
			console.warn("Cannot load data. "+key+" is not defined.", data);
		}
		setInputValue($input, value);
	});
};
var SidePanel = (function($){
	var LocalSidePanel = function()
	{
		var _self = this;
		this.$panel = $(".right-bar");
		this.selectedNodeID = null;
		this.$draftToggle = $("#liveToggle");
		this.$draftToggleText = $("#liveToggleText");
		this.$previewButton = $("#previewButton");
		this.$mediaSelect = $("#mediaSelect");
		this.$dataInputs = $("[data-column]", this.$panel);
		this.$fieldset = $("fieldset", this.$panel);
		this.$selects = $("select", this.$panel);
		this.$wysiwyg = $('#pageTextEdit');
		this.inputs = [];
		this.$conditions = $(".conditions", this.$panel);
		this.$conditionAdd = $(".condition-add", this.$panel);
		this.$conditionInput = $("#conditionPanelInput", this.$panel);
		this.$progressBar = $("#uploadProgressBar");
		this.$uploadProgress = $("#uploadProgress");
		this.$nodeImage = $("#nodeImage");
		this.$vimeoFrame = $("#vimeoFrame");

		this.questionDom = {
			$type: $("#questionType"),
			$text: $("#questionText"),
			$var: $("#variableText"),
			$answersPanel: $("#answersPanel"),
			$answers: $("#answers"),
			$addAnswer: $("#addAnswer")
		};

		// close the panel
		$(".close-sidebar").on("click", function(e){
			e.preventDefault();
			_self.hide();
		});

		// disable preview button for now
		this.$previewButton.on("click", function(e){
			e.preventDefault();
			alert("Sorry, this feature is not currently available. There is no user front-end yet.", { title: 'Not available yet' });
		});

		// change text (draft/live) for the toggle
		this.$draftToggle.on("change", function(){
			_self.$draftToggleText.html(_self.$draftToggle.is(":checked") ? "Live" : "Draft");
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
			var inputEntity = typeof $(this).attr("data-entity")!='undefined' ? $(this).attr("data-entity") : "node",
			newInput = AjaxManager.newInput($(this), null, inputEntity);
			_self.inputs.push(newInput);
		});

		// condition add functionality
		this.$conditionAdd.on("click", function(e)
		{
			e.preventDefault();
			var Node = NodeManager.get(_self.selectedNodeID);

			ajax.addCondition.ops.successFn = function(response){
				Node.addCondition(response);
			};
			ajax.addCondition.submit({
				page: Node.nodeData.id,
				condition: _self.$conditionInput.val()
			});
		});

		// setup uploader
		this.uploader = new plupload.Uploader({
			browse_button: 'uploadButton',
			drop_element: 'uploadButton',
			url: null,
			filters: {
				mime_types : [
					{ title : "Images", extensions : "jpg,jpeg,gif,png" }
				],
				max_file_size: "5mb"
			},
			multi_selection: false,
			flash_swf_url: '/bundles/plupload/Moxie.swf',
			silverlight_xap_url: '/bundles/plupload/Moxie.xap'
		});
		this.uploader.init();
		// when we add a file we want to start an upload immediately as we are not handling lots of files
		this.uploader.bind('FilesAdded', function(up, files) {
			_self.uploader.start();
		});
		this.uploader.bind('BeforeUpload', function(up, file) {
			up.settings.url = '/admin/page/upload/'+_self.selectedNodeID;
			up.settings.nodeID = _self.selectedNodeID;
		});
		this.uploader.bind('UploadFile', function(up, file) {
			_self.$uploadProgress.show();
			_self.$progressBar.removeClass("bg-danger bg-success");
		});
		this.uploader.bind('UploadProgress', function(up, file) {
			_self.$progressBar.css({width: file.percent+"%"});
		});
		this.uploader.bind('FileUploaded', function(up, file, result) {
			_self.$progressBar.addClass("bg-success");
			_self.$uploadProgress.hide();
			var Node = NodeManager.get(up.settings.nodeID),
			NodeData = JSON.parse(result.response);
			Node.nodeData = NodeData;
			_self.updateMedia();
		});
		this.uploader.bind('Error', function(up, err) {
			console.log(err);
			alert(err.message, {title: "Upload error #"+err.code});
			_self.$progressBar.addClass("bg-danger");
		});

		this.questionDom.$type.on("change", function(){
			var $type = $(this);
			if($type.val()==='choice')
			{
				_self.questionDom.$answersPanel.show();
			}
			else
			{
				_self.questionDom.$answersPanel.hide();
			}
		});

		this.questionDom.$addAnswer.on("click", function(){
			ajax.addAnswer.ops.successFn = function(answerData){
				_self.addAnswer(answerData);
				// add the answer to Node's data
				var Node = NodeManager.get(answerData.question.page.id);
				Node.nodeData.questions[0].answerOptions.push(answerData);
			};

			var Node = NodeManager.get(_self.selectedNodeID);
			ajax.addAnswer.submit({
				question: Node.nodeData.questions[0].id
			});
		});
	};

	LocalSidePanel.prototype.show = function(nodeID)
	{
		var _self = this;

		if(this.selectedNodeID)
		{
			this.hide();
		}

		this.$panel.addClass("show");
		this.selectedNodeID = nodeID;
		var Node = NodeManager.get(this.selectedNodeID);
		Node.setEditing(true);
		// load in cache and disable inputs while we refresh the data
		this.$conditions.empty();
		this.disableInputs();
		this.load();
		ajax.getPage.ops.successFn = function(nodeData){
			Node.nodeData = nodeData;
			_self.load();
			_self.enableInputs();
		};
		ajax.getPage.submit({}, ajax.getPage.url + this.selectedNodeID);
	};
	LocalSidePanel.prototype.hide = function()
	{
		if(this.selectedNodeID)
		{
			this.$panel.removeClass("show");
			var Node = NodeManager.get(this.selectedNodeID);
			Node.setEditing(false);
			this.selectedNodeID = null;
		}
	};
	LocalSidePanel.prototype.disableInputs = function()
	{
		this.$fieldset.add(this.$selects).prop("disabled", true);
		this.$selects.selectpicker('refresh');
		this.$wysiwyg.trumbowyg('disable');
	};
	LocalSidePanel.prototype.enableInputs = function()
	{
		this.$fieldset.add(this.$selects).prop("disabled", false);
		this.$selects.selectpicker('refresh');
		this.$wysiwyg.trumbowyg('enable');
	};
	LocalSidePanel.prototype.load = function()
	{
		var _self = this,
		nodeID = this.selectedNodeID;
		var Node = NodeManager.get(nodeID);

		var questionID = Node.nodeData.questions.length>0 ? Node.nodeData.questions[0].id : null;

		$.each(this.inputs, function()
		{
			var AjaxInput = this,
			id = AjaxInput.entity === 'node' ? nodeID : (AjaxInput.entity==='question' ? questionID : null);
			AjaxInput.loadEntity(id, nodeID);
		});
		$.each(Node.conditions, function()
		{
			_self.addCondition(this);
		});
		_self.updateMedia();

		this.questionDom.$answers.empty();
		if(Node.nodeData.questions.length > 0)
		{
			$.each(Node.nodeData.questions[0].answerOptions, function()
			{
				_self.addAnswer(this);
			});
		}
	};
	LocalSidePanel.prototype.addCondition = function(Condition)
	{
		this.$conditions.append(Condition.$conditionSidePanel);
		this.$conditionInput.val("");
	};
	LocalSidePanel.prototype.removeCondition = function(Condition)
	{
		Condition.$conditionSidePanel.remove();
	};
	LocalSidePanel.prototype.updateMedia = function()
	{
		var Node = NodeManager.get(this.selectedNodeID),
		vimeoSetTimeout = null,
		_self = this;
		if(null !== Node.nodeData.imagePath)
		{
			this.$nodeImage.attr("src", "/"+Node.nodeData.imagePath).show();
		}
		else
		{
			this.$nodeImage.attr("src", "#").hide();
		}
		_self.$vimeoFrame.empty();
		if('' !== Node.nodeData.videoUrl && null !== Node.nodeData.videoUrl)
		{
			//https://vimeo.com/73101630
	        //BECOMES
	        //https://player.vimeo.com/video/73101630?title=0&byline=0&portrait=0
			var $iframe = $("<iframe></iframe>",{
				id: 'vimeoVideo',
				src: "https://player.vimeo.com/video/" + Node.nodeData.videoUrl.split("/").pop() + "?title=0&byline=0&portrait=0",
				width: 450,
				height: 253,
				frameborder: 0,
				webkitallowfullscreen: true,
				mozallowfullscreen: true,
				allowfullscreen: true
			});
			if(vimeoSetTimeout)
			{
				clearTimeout(vimeoSetTimeout);
			}
			vimeoSetTimeout = setTimeout(function(){
				_self.$vimeoFrame.empty();
				$iframe.appendTo(_self.$vimeoFrame);
			},350);
		}
	};
	LocalSidePanel.prototype.addAnswer = function(answerData)
	{
		var newAnswer = new Answer(answerData);
		newAnswer.$answer.appendTo(this.questionDom.$answers);
	};

	return new LocalSidePanel();
})(jQuery);


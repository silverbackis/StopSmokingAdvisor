function SearchMenu(parentNode)
{
	var _self = this;

	// Create DOM Elements
	this.$dropdownMenu = $("<div />",{
		class: 'dropdown-menu'
	});
	this.$searchResultLink = $("<a />",{
		href: '#',
		class: 'dropdown-item'
	});
	this.$noSearchResults = this.$searchResultLink
		.clone()
		.html('No results');
	this.$loadingSearchResults = this.$searchResultLink
		.clone()
		.html('Loading...')
		.appendTo(this.$dropdownMenu);
	

	this.parentNode = parentNode;

	// Setup page node is currently forwading to
	this.currentPage = {
		name: (null === this.parentNode.nodeData.forwardToPage ? '' : this.parentNode.nodeData.forwardToPage.name),
		id: (null === this.parentNode.nodeData.forwardToPage ? '' : this.parentNode.nodeData.forwardToPage.id)
	};

	// Modify the Node's input and parent to create a dropdown
	this.$dropdown = this.parentNode
		.$nameInput
			.addClass("dropdown-toggle goto-pagename")
			.attr({
				"data-toggle": "dropdown",
				"data-gotoid": this.currentPage.id,
				"value": this.currentPage.name
			})
			.on("focus", function(){
				_self.parentNode.$nameInput.trigger("click");
				_self.parentNode.searchName.call(_self.parentNode);
			})
		.parent()
			.addClass("dropdown");
	
	// Link allowing the menu to show and hide with whether the field is in focus
	var dropdownFn = {
		hide: function(){
			if(_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		},
		hidden: function(){
			_self.updateSaved();
		},
		show: function(){
			if(!_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		}
	};
	this.$dropdown.on("hide.bs.dropdown", dropdownFn.hide);
	this.$dropdown.on("hidden.bs.dropdown", dropdownFn.hidden );
	this.$dropdown.on("show.bs.dropdown", dropdownFn.show );
	return this;
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

		var clickFn = function(e){
			e.preventDefault();
			e.stopPropagation();

			var data = $(this).data("searchResult");
			_self.parentNode.$nameInput.val(data.name);

			ajax.updateNode.ops.successFn = function(newNodeData){
				// update current page
				_self.currentPage = {
					name: data.name,
					id: data.id
				};

				// update saved in case has been hidden in the mean-time
				_self.updateSaved();
				// hide the menu if showing
				_self.hide();

				_self.parentNode.$nameInput.attr("data-gotoid", newNodeData.forwardToPage.id);
				
				// Update NodeData
				_self.parentNode.nodeData = newNodeData;
			};

			ajax.updateNode.submit({
				forwardToPage: data.id
			}, ajax.updateNode.url + _self.parentNode.nodeData.id);
		};

		var $selectableLink = this.$searchResultLink
			.clone()
			.on("click", clickFn);

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
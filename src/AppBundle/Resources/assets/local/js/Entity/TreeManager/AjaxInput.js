function AjaxInput($input)
{
	var _self = this;
	this.$input = $input;
	this.$column = this.$input.attr("data-column");

	var inputChangeFn = function(e){
		var ms = e.type==='blur' || e.type==='change' ? 1 : null;
		_self.debounce(_self.update);
	};
	if(this.$input.is("select") || this.$input.is("[type=checkbox]"))
	{
		this.$input.on("change", inputChangeFn);
	}
	else
	{
		this.$input.on("keyup blur", inputChangeFn);
	}
}
AjaxInput.prototype.update = function(){
	var _self = this,
	data = {};

	this.inputValue = getInputValue(this.$input);
	data[this.$column] = this.inputValue;

	ajax.updateNode.ops.successFn = function(){
		_self.bindUpdatedData.call(_self);
	};
	ajax.updateNode.submit(data, ajax.updateNode.url + this.$input.attr("data-id"));	
};
AjaxInput.prototype.bindUpdatedData = function()
{
	var _self = this;
	$("[data-column='"+this.$column+"'][data-id='"+this.$input.attr("data-id")+"'],[data-column='"+this.$column+"'][data-gotoid='"+this.$input.attr("data-id")+"']").not(this.$input).each(function(){
		$dataEl = $(this);
		setInputValue($dataEl, _self.inputValue);
	});
};
AjaxInput.prototype.debounce = function(fn, ms)
{
	var _self = this;
	clearTimeout(_self.debounceTimer);
    _self.debounceTimer = setTimeout(function(){
        fn.call(_self);
    }, ms || 250);
};
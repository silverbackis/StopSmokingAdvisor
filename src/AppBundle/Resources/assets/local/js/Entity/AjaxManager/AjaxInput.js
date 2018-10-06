import NodeManager from '../../Utils/NodeManager'
import {AjaxManager, requests as ajax} from '../../Utils/AjaxManager'

function AjaxInput($input, id, entity)
{
	var _self = this;
	this.$input = $input;
	this.id = id;
	this.lastValue = {
		submitted: this.getInputValue(),
		saved: this.getInputValue()
	};
	this.error = {
		current: false,
		message: null
	};
	if(!entity)
	{
		entity = 'node';
	}
	this.entity = entity;

	var inputChangeFn = function(e){
		if(!_self.$input.is(":disabled"))
		{
			_self.update(e.type);
		}
	};
	if(typeof this.$input.attr("data-update_events") !== 'undefined')
	{
		this.$input.on(this.$input.attr("data-update_events"), inputChangeFn);
		this.$input.on("keypress", function()
		{
			setNotSaved();
		});
	}
	else
	{
		if(this.$input.is("select") || this.$input.is("[type=checkbox]"))
		{
			this.$input.on("change", inputChangeFn);
		}
		else
		{
			this.$input.on("keyup blur", inputChangeFn);
		}
	}
}
AjaxInput.prototype.getColumn = function()
{
	return this.$input.attr("data-column");
};
AjaxInput.prototype.loadEntity = function(id, nodeID)
{
	this.id = id;
	var nodeData = NodeManager.get(nodeID).nodeData;
	switch(this.entity)
	{
		case "node":
			this.setInputValue(nodeData[this.getColumn()]);
			this.bindUpdatedData();
		break;

		case "question":
			if(nodeData.questions.length > 0)
				this.setInputValue(nodeData.questions[0][this.getColumn()]);
		break;

		// does not need to load data dynamically, we create new inputs for new data - we don't load it in again and overwrite
		case "answer":
		break;
	}
	this.lastValue = {
		submitted: this.getInputValue(),
		saved: this.getInputValue()
	};
};
AjaxInput.prototype.update = function(etype){
	var _self = this,
	data = {};
	// only update changed values
	var currentValue = this.getInputValue();
	if(currentValue!==this.lastValue.submitted)
	{
		if(currentValue === this.lastValue.saved)
		{
			// last saved value means it must have validated properly before, just remove error notices - do not submit
			this.error.current = false;
			this.setError(false);
			//setSaved();
			//return;
		}

		this.lastValue.submitted = currentValue;
		var column = this.getColumn();
		data[column] = this.lastValue.submitted;

		var successFn = function(entityData){
			var Node;
			switch(_self.entity)
			{
				case "node":
					Node = NodeManager.get(_self.id);
					Node.nodeData = entityData;
					_self.bindUpdatedData.call(_self);
					if(column === 'videoUrl' && SidePanel.selectedNodeID === _self.id)
					{
						SidePanel.updateMedia();
					}
					if(column === 'live')
					{
						Node.updatePageStatus();
					}
				break;

				case "question":
					var questionData = entityData;
					Node = NodeManager.get(questionData.page.id);
					Node.nodeData.questions[0] = questionData;
				break;

				case "answer":
					var answerData = entityData;
					Node = NodeManager.get(answerData.question.page.id);
					$.each(Node.nodeData.questions[0].answerOptions, function(key)
					{
						if(this.id === answerData.id)
						{
							Node.nodeData.questions[0].answerOptions[key] = answerData;
							return false;
						}
					});
				break;
			}
			_self.lastValue.saved = currentValue;
		};
		//console.log("UPDATE: ", data);
		var ms = etype==='blur' || etype==='change' ? 1 : null,
		baseURL = (this.entity==='node' ? ajax.updateNode.url : (this.entity === 'question' ? ajax.updateQuestion.url : ajax.updateAnswer.url));
		ajax.updateNode.submit(data, baseURL + this.id, ms, { 
			input: _self,
			successFn: successFn
		});
	}
};
AjaxInput.prototype.bindUpdatedData = function()
{
	var _self = this,
	col = this.getColumn(),
	newInputValue = _self.getInputValue();
	$.each(AjaxManager.findInputs(this.id, col), function()
	{
		var foundAI = this;
		if(_self.$input[0]!==foundAI.$input[0])
		{
			// input that matches and is not this one, bind the data
			foundAI.setInputValue(newInputValue);
		}
	});

	// bind to goto links if name column
	if(col==='name')
	{
		$("[data-gotoid="+_self.id+"][data-column='name']").val(newInputValue);
	}
};
AjaxInput.prototype.setInputValue = function(value)
{
	if(this.$input.attr("type")==='checkbox')
	{
		this.$input.prop("checked", value).trigger("change");
	}
	else if(this.$input.is("div"))
	{
		this.$input.trumbowyg('html', value === null ? '' : value);
	}
	else if(this.$input.is("select")){
		this.$input.selectpicker('val', value);
		this.$input.trigger("change");
	}
	else
	{
		this.$input.val(value === null ? '' : value);
	}
};
AjaxInput.prototype.getInputValue = function()
{
	if(this.$input.attr("type")==='checkbox')
	{
		return this.$input.prop("checked");
	}
	else if(this.$input.is("div"))
	{
		return this.$input.trumbowyg('html');
	}
	else
	{
		return this.$input.val();
	}
};
AjaxInput.prototype.setError = function(isError, message)
{
	if(isError)
	{
		if(!this.$input.hasClass("error"))
		{
			this.$input.addClass("error");
		}
	}
	else
	{
		if(this.$input.hasClass("error"))
		{
			this.$input.removeClass("error");
		}
	}
	this.error.current = isError;
	this.error.message = message;
};
export default AjaxInput

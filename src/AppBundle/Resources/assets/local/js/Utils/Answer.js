import {AjaxManager, requests as ajax} from './AjaxManager'
import NodeManager from './NodeManager'
import BootstrapModalAlerts from '../../../global/BootstrapModalAlerts'

// Answer object - created by SidePanel
function Answer(data)
{
	this.data = data;

	var _self = this,
	els = {
		$displayInput: $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Enter answer option',
			id: 'answerText' + this.data.id,
			"data-column": "answer"
		})
		.val(data.answer),
		$valueInput: $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Enter value to save',
			id: 'answerValue' + this.data.id,
			"data-column": "saveValue"
		})
		.val(data.saveValue),
		$close: $("<button />",{
			type: 'button',
			class: 'close delete-answer text-danger'
		}).append(
			$("<span />",{
				"aria-hidden": true,
				html: '&times;&nbsp;'
			})
		).on("click", function(e){
			e.preventDefault();
      BootstrapModalAlerts.confirm("Are you sure you want to delete this answer?", {
				title: 'Are you sure?'
			}, function(e, confirmed, bsma){ 
				if(confirmed)
				{
					ajax.deleteAnswer.ops.successFn = function(){
						_self.remove();
					};
					ajax.deleteAnswer.submit({}, ajax.deleteAnswer.url + _self.data.id);
				} 
			});
		})
	};

	this.inputs = [
		AjaxManager.newInput(els.$displayInput, this.data.id, 'answer'),
		AjaxManager.newInput(els.$valueInput, this.data.id, 'answer')
	];

	this.$answer = $("<div />",{
		class: 'answer-group'
	})
	.append(
		$("<hr />")
	)
	.append(
		els.$close
	)
	.append(
		$("<br />")
	)
	.append(
		$("<div />",{
			class: 'form-group'
		})
		.append(
			$("<label />",{
				for: 'answerText' + this.data.id,
				html: 'Answer Option (Displayed)'
			})
		).append(
			$("<div />",{
				class: 'input-group'
			}).append(
				els.$displayInput
			)
		)
	)
	.append(
		$("<div />",{
			class: 'form-group'
		})
		.append(
			$("<label />",{
				for: 'AnswerValue' + this.data.id,
				html: 'Answer Option (Saved value)'
			})
		).append(
			$("<div />",{
				class: 'input-group'
			}).append(
				els.$valueInput
			)
		)
	);

	return this;
}
Answer.prototype.remove = function()
{
	var Node = NodeManager.get(this.data.question.page.id),
	_self = this;
	$.each(Node.nodeData.questions[0].answerOptions, function(index)
	{
		if(this.id === _self.data.id)
		{
			Node.nodeData.questions[0].answerOptions.splice(index, 1);
			return false;
		}
	});
	this.$answer.remove();
};
export default Answer

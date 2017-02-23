// Condition object and protos
function Condition(conditionData, Node)
{
	var _self = this;
	this.Node = Node;
	this.conditionData = conditionData;
	this.$condition = $("<a />",{
		class: 'btn btn-secondary btn-sm',
		href: '#',
		html: conditionData.condition+'&nbsp;&nbsp;',
		id: 'condition_'+conditionData.id
	}).append(
		$("<span />",{
			class: 'text-danger',
			html: '&times;'
		})
	).on("click", function(e){
		e.preventDefault();
		ajax.deleteCondition.ops.successFn = function(response){
			_self.remove();	
		};
		ajax.deleteCondition.submit({}, ajax.deleteCondition.url + _self.conditionData.id);
	});
}
Condition.prototype.remove = function(id){
	delete this.Node.conditions[this.conditionData.id];
	this.$condition.remove();
};
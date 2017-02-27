// Condition object and protos
function Condition(conditionData, nodeID)
{
	var _self = this,
	removeCondition = function(e){
		e.preventDefault();
		ajax.deleteCondition.ops.successFn = function(response){
			var Node = NodeManager.get(_self.nodeID);
			Node.removeCondition(_self.conditionData.id);	
		};
		ajax.deleteCondition.submit({}, ajax.deleteCondition.url + _self.conditionData.id);
	};
	this.nodeID = nodeID;
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
	).on("click", removeCondition);

	this.$conditionSidePanel = this.$condition.clone(true).removeClass("btn-sm");
	return this;
}
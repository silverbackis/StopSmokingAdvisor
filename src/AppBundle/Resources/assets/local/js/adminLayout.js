$(function(){
	$('#logout').popover({
		title: 'Are you sure?',
		content: '<div class="btn-group btn-group-sm" role="group" aria-label="Confirm logout">' +
  					'<a class="btn btn-secondary btn-success logout-confirm" href="/logout">Yes</a>' +
  					'<a class="btn btn-secondary btn-warning" href="#">No</a>' +
				'</div>',
		html: true,
		placement: 'left',
		trigger: 'click'
	});

	var hidePopoverFn = function(){
		$('#logout').popover('hide');
	};
	$('#logout').on('hide.bs.popover', function () {
	  $(document).off("click", hidePopoverFn);
	}).on('show.bs.popover', function () {
	  $(document).on("click", hidePopoverFn);
	}).on('shown.bs.popover', function () {
	  $(".logout-confirm").on("click", function(e){
	  	e.stopPropagation();
	  });
	});
});
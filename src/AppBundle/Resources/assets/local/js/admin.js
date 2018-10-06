require('../scss/admin.scss')

require('bootstrap')
require('bootstrap-select')
require('trumbowyg')

$(function () {
  var $logout =   $('#logout');

  $logout.popover({
    title: 'Are you sure?',
    content: '<div class="btn-group btn-group-sm" role="group" aria-label="Confirm logout">' +
      '<a class="btn btn-secondary btn-success logout-confirm" href="/logout">Yes</a>' +
      '<a class="btn btn-secondary btn-warning" href="#">No</a>' +
      '</div>',
    html: true,
    placement: 'bottom',
    trigger: 'click'
  });

  var hidePopoverFn = function () {
    $logout.popover('hide');
  };
  $logout.on('hide.bs.popover', function () {
    $(document).off("click", hidePopoverFn);
  }).on('shown.bs.popover', function () {
    $(document).on("click", hidePopoverFn);
    $(".logout-confirm").on("click", function (e) {
      e.stopPropagation();
    });
  });
});


// require('./Entity/AjaxManager/AjaxRequest')
// require('./Entity/NodeManager/Condition')
// require('./Entity/NodeManager/Node')
// require('./Entity/NodeManager/SearchMenu')
// require('./Entity/TreeManager/Tree')

require('./Utils/SidePanel')
require('./Utils/Answer')
require('./Utils/NodeManager')
require('./Utils/TreeManager')

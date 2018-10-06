import jQuery from 'jquery'

class BootstrapModalAlerts {
  constructor ($) {
    this.ops = {
      title: "Alert"
    };

    this.$modal =
      $('<div class="modal fade" id="bsModalAlert" tabindex="-1" role="dialog" aria-labelledby="bsModalAlertLabel" aria-hidden="true">' +
        '  <div class="modal-dialog" role="document">' +
        '    <div class="modal-content">' +
        '      <div class="modal-header">' +
        '        <h5 class="modal-title" id="bsModalAlertLabel"></h5>' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '          <span aria-hidden="true">&times;</span>' +
        '        </button>' +
        '      </div>' +
        '      <div class="modal-body">' +
        '      </div>' +
        '      <div class="modal-footer">' +
        '        <button type="button" class="btn btn-secondary" data-dismiss="modal" data-fn_value="0">Cancel</button>' +
        '        <button type="button" class="btn btn-primary alert-confirm" data-dismiss="modal" data-fn_value="1">OK</button>' +
        '     </div>' +
        '    </div>' +
        '  </div>' +
        '</div>');

    this.alert = function(message, ops, fn)
    {
      return this.confirm(message, ops, fn, true);
    };

    this.confirm = (message, ops, fn, okOnly) => {
      const localOps = $.extend({}, this.ops, ops);
      const $localModal = this.$modal.clone();

      $(".modal-body", $localModal).html(message);
      $(".modal-title", $localModal).html(localOps.title);
      if(okOnly)
      {
        $(".btn-secondary", $localModal).remove();
      }

      $localModal.appendTo("body");

      if('function' === typeof fn)
      {
      	const _self = this
        $(".btn", $localModal).on("click", function(e){
          fn.call(this, e, $(this).attr("data-fn_value")/1, _self);
        });
      }
      $localModal.modal('show');
      return true;
    };
    return this;
  }
}

export default new BootstrapModalAlerts(jQuery)

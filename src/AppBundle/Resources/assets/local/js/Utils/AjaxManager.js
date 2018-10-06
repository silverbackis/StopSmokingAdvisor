import AjaxInput from '../Entity/AjaxManager/AjaxInput'
import AjaxRequest from '../Entity/AjaxManager/AjaxRequest'

import SidePanel from './SidePanel'
import NodeManager from './NodeManager'

import $ from 'jquery'

// Private
let prv = {
  submittingTotal: 0,
  erronious: 0,
  inputs: [],
  saveNotice: {
    enabled: true,
    $el: $("#saveNotice"),
    savedText: $("#saveNotice").html()
  }
}

// Protected - available to all objects called from within AjaxManager
export const setSaved = function () {
  if (prv.saveNotice.enabled) {
    var inputErrors = false
    $.each(prv.inputs, function () {
      if (this.error.current) {
        inputErrors = true
        return false
      }
    })
    if (inputErrors) {
      setError()
      return
    }
    prv.saveNotice.$el.html(prv.saveNotice.savedText).removeClass("saving text-warning text-danger")
  }
}
export const setError = function () {
  if (prv.saveNotice.enabled) {
    prv.saveNotice.$el.html("Some changes not saved.").removeClass("saving text-warning").addClass("text-danger")
  }
}
export const setSaving = function (loading) {
  // Increase total of ajax calls in progress
  prv.submittingTotal++

  if (prv.saveNotice.enabled) {
    prv.saveNotice.$el.html(loading ? "Loading..." : "...Saving").addClass("saving").removeClass("text-danger text-warning")
  }
}
export const setNotSaved = function () {
  if (prv.saveNotice.enabled) {
    prv.saveNotice.$el.html("Waiting for user").removeClass("saving text-danger").addClass("text-warning")
  }
}
export const submitComplete = function () {
  prv.submittingTotal--
}

export const newInput = function ($input, nodeID, entity) {
  if (!$input) {
    console.warn("First argument '$input' is required for AjaxManager.newInput")
    return
  }
  var newInput = new AjaxInput($input, nodeID, entity)
  prv.inputs.push(newInput)
  return newInput
}
export const AjaxManager = {
  newRequest: function (url, ops) {
    if (!url) {
      console.warn("First argument 'url' is required for AjaxManager.newRequest")
      return
    }
    if (!ops) {
      ops = {}
    }
    return new AjaxRequest(url, ops)
  },
  newInput,
  findInputs: function (nodeID, column) {
    var matchingInputs = []
    $.each(prv.inputs, function () {
      var AI = this
      if (AI.id === nodeID && AI.getColumn() === column) {
        //matching input
        matchingInputs.push(AI)
      }
    })
    return matchingInputs
  }
}
// public
export default AjaxManager

export const requests = {
  getSession: AjaxManager.newRequest('/admin/pages/get/', {
    dataType: 'json',
    submitFn: () => {
      SidePanel.hide();
      NodeManager.clear();
    },
    abortable: true,
    load: true
  }),
  getPage: AjaxManager.newRequest('/admin/page/get/', {
    dataType: 'json',
    abortable: true,
    load: true
  }),
  searchSession: AjaxManager.newRequest('/admin/pages/search/', {
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    abortable: true,
    uniqueRequest: {
      url: true
    },
    initFn: function(){
      return {
        url: this.url + sessionNumber,
        ops: {}
      };
    },
    load: true,
    status: {
      enabled: false
    }
  }),
  addNode: AjaxManager.newRequest('/admin/page/add', {
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json'
  }),
  deleteNode: AjaxManager.newRequest('/admin/page/delete/', {
    dataType: 'json',
    uniqueRequest: {
      url: true
    }
  }),
  updateNode: AjaxManager.newRequest('/admin/page/update/', {
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    uniqueRequest: {
      url: true,
      data: false
    }
  }),
  copyMoveNode: AjaxManager.newRequest('/admin/page/', {
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    uniqueRequest: {
      url: true
    }
  }),
  addCondition: AjaxManager.newRequest('/admin/condition/add', {
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    uniqueRequest: {
      data: true
    }
  }),
  deleteCondition: AjaxManager.newRequest('/admin/condition/delete/', {
    dataType: 'json',
    uniqueRequest: {
      url: true
    }
  }),
  updateQuestion: AjaxManager.newRequest('/admin/question/update/', {
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    uniqueRequest: {
      url: true,
      data: true
    }
  }),
  addAnswer: AjaxManager.newRequest('/admin/answer/add', {
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    uniqueRequest: {
      data: true
    }
  }),
  deleteAnswer: AjaxManager.newRequest('/admin/answer/delete/', {
    dataType: 'json',
    uniqueRequest: {
      url: true
    }
  }),
  updateAnswer: AjaxManager.newRequest('/admin/answer/update/', {
    method: 'POST',
    dataType: 'json',
    contentType: "application/json",
    uniqueRequest: {
      url: true,
      data: true
    }
  })
}

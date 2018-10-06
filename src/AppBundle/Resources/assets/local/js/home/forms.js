import $ from 'jquery'
import { TweenLite, TimelineLite } from 'gsap'
import BMA from '../../../global/BootstrapModalAlerts'
const alert = BMA.alert
import { shrinkingLink } from './pageTransitions'

require('bootstrap')

/**
 * Form validation
 */
$(function() {
  const $inputs = {
    regPass: $("#fos_user_registration_form_plainPassword_first")
  }

  $inputs.regPass.on("change keyup", function () {
    var pw = $inputs.regPass.val(),
      validCls
    //at least 1 letter
    let hasValidCls = $("#pw-letter").hasClass("valid")
    if (/[a-z]/i.test(pw)) {
      if (!hasValidCls) {
        $("#pw-letter").addClass("valid")
      }
    } else {
      if (hasValidCls) {
        $("#pw-letter").removeClass("valid")
      }
    }

    //at least 1 number
    hasValidCls = $("#pw-number").hasClass("valid")
    if (/\d/.test(pw)) {
      if (!hasValidCls) {
        $("#pw-number").addClass("valid")
      }
    } else {
      if (hasValidCls) {
        $("#pw-number").removeClass("valid")
      }
    }

    //at least 6 characters
    hasValidCls = $("#pw-6").hasClass("valid")
    if (pw.length >= 6) {
      if (!hasValidCls) {
        $("#pw-6").addClass("valid")
      }
    } else {
      if (hasValidCls) {
        $("#pw-6").removeClass("valid")
      }
    }
  })
})


/**
 * Form ajax post
 */
$(function() {
  const $loginForm = $("#loginForm")
  const $loginCollapse = $('#loginCollapse')
  const $forgotCollapse = $('#forgotCollapse')

  $loginCollapse.on('show.bs.collapse', function () {
    $loginForm.attr("action", $loginForm.attr("data-loginAction"))
    $("#username").attr("name", "_username")
  })
  $forgotCollapse.on('show.bs.collapse', function () {
    $loginForm.attr("action", $loginForm.attr("data-forgotAction"))
    $("#username").attr("name", "username")
  })
  $('#resettingModal').on('hidden.bs.modal', function () {
    if (!$loginCollapse.hasClass("show")) {
      $("#showLoginForm").trigger("click.bs.collapse.data-api")
    }
  })
  $.fn.errorMessage = function (message, noFlash) {
    this.each(function () {
      var $input = $(this)

      var f = {
        init: function () {
          //only initialise data on inputs which have the correct error message structure
          if (!$input.next().is(".form-control-feedback") || $input.parents(".form-group").length < 1) {
            return false
          }
          var $feedback = $input.next()
          //set the elements to be used for error messages
          $input
            .data("errorElements", {
              $feedback: $feedback,
              $formGroup: $input.parents(".form-group"),
              $form: $input.parents("form")
            })
            .data("isError", false)
            .data("flashTimeline", new TimelineLite({
              onComplete: function () {
                $feedback.css({ backgroundColor: "" })
              }
            }))
            .data("validateTimeout", null)
          return true
        },
        public_hide: function () {
          $input.data("isError", false)

          TweenLite.to($input.data("errorElements").$feedback[ 0 ], 0.4, {
            opacity: 0, y: "-100%", onComplete: function () {
              $input.data("errorElements").$feedback.empty()
            }
          })
          TweenLite.to($input.data("errorElements").$formGroup[ 0 ], 0.4, { paddingBottom: 0 })
        }
      }

      if (typeof $input.data("errorElements") === 'undefined' || message === 'init') {
        var initSuccess = f.init()
        if (message === 'init' || !initSuccess) {
          return
        }
      }

      if (typeof f[ 'public_' + message ] === 'function') {
        f[ 'public_' + message ]()
      } else {
        $input.data("isError", true)
        var currentMessage = $input
          .data("errorElements").$feedback.html()
        $input
          .data("errorElements").$feedback.html(message)

        if (currentMessage === message && !noFlash) {
          var flashCol = $("button.btn", $input.data("errorElements").$form).css("backgroundColor")
          $input.data("flashTimeline")
            .clear()
            .set($input.data("errorElements").$feedback[ 0 ], { backgroundColor: "rgba(255, 255, 255, 0)" })
            .to($input.data("errorElements").$feedback[ 0 ], 0.3, { backgroundColor: flashCol })
            .to($input.data("errorElements").$feedback[ 0 ], 0.6, { backgroundColor: "rgba(100, 100, 100, 0)" }, "+=0.3")
        }
        new TweenLite.to($input.data("errorElements").$feedback[ 0 ], 0.4, { opacity: 1, y: "0%" })
        new TweenLite.to($input.data("errorElements").$formGroup[ 0 ], 0.4, { paddingBottom: $input.data("errorElements").$feedback.outerHeight() })
      }
    })
    return this
  }

  $.fn.ajaxForm = function () {
    this.each(function () {
      var $form = $(this),
        $inputs = $(":input", $form).not("[type=submit]")

      var submitFunction = function (overrideData, $input, eventType) {
          var serializedData = $input ? $input.serializeArray() : $inputs.serializeArray(),
            hidErr = function () {
              if ($input) {
                $input.errorMessage("hide")
              } else {
                $inputs.errorMessage("hide")
              }
            },
            buttonTextReset = function () {
              shrinkingLink($("button[type=submit]", $form), 'reset')
            },
            formData = {}

          if ($input) {
            serializedData.push({
              name: "task[input]",
              value: $input.attr("id")
            })
            serializedData.push({
              name: "task[submit]",
              value: 'no'
            })
          }

          $.each(serializedData, function () {
            formData[ this.name ] = this.value
          })

          if (overrideData && typeof overrideData === 'object') {
            formData = $.extend(formData, overrideData)
          }

          $.ajax({
            type: "POST",
            url: $form.attr("action"),
            data: formData,
            statusCode: {
              200: function (response) {
                //logged in
                hidErr()
                window.location.href = response.href
              },
              401: function (response) {
                //login/authorization failed
                hidErr()
                buttonTextReset()
                $("#password").errorMessage(response.responseJSON.message)
              },
              201: function (response) {
                //created
                hidErr()
                window.location.href = response.href
              },
              202: function (response) {
                //validation success
                hidErr()
                if (response.message) {
                  $("#modal_notice").html(response.message)
                } else {
                  $("#modal_notice").html('Sorry, we could not retrieve the exact message from the server to display to you. However, it appears your password reset request was successful and you should receive an email.')
                }
                $('#resettingModal').modal()
                buttonTextReset()
              },
              400: function (response) {
                hidErr()
                buttonTextReset()
                $.each(response.responseJSON, function (inputID, inputError) {
                  const $input = $("#" + inputID)
                  $input.errorMessage(inputError, eventType === 'keyup')
                })
              }
            },
            error: function (err) {
              if (err.status !== 400 && err.status !== 401) {
                alert("Sorry, an unknown error occurred. Please try again.")
                console.warn(arguments)
              }
              buttonTextReset()
            },
            dataType: 'json'
          })
        },
        inputEvent = function (e) {
          var $input = $(this)

          //do not submit for validation if it is keyup, and not already an error
          if (e.type === 'keyup' && !$input.data("isError")) {
            return
          }

          //clear keyup timeout
          if ($input.data("validateTimeout")) {
            clearTimeout($input.data("validateTimeout"))
          }

          $input.data(
            "validateTimeout",
            setTimeout(function () {
              var overrideData = {}

              //if validating the first password field, simulate the second password field matching
              if ($input.attr("id") === "fos_user_registration_form_plainPassword_first") {
                overrideData[ 'fos_user_registration_form[plainPassword][second]' ] = $input.val()
              } else if ($input.attr("id") === "fos_user_registration_form_plainPassword_second") {
                //set the second password value first so we can check if it matches the first
                overrideData[ 'fos_user_registration_form[plainPassword][second]' ] = $input.val()
                //change to validate the first password field
                $input = $("#fos_user_registration_form_plainPassword_first")
              }

              submitFunction(overrideData, $input, e.type)
            }, e.type === 'keyup' ? 200 : 0)
          )
        }

      $form.on("submit", function (e) {
        e.preventDefault()
        var overrideData = {}
        if ($form.attr("name") === 'fos_user_registration_form') {
          overrideData[ 'fos_user_registration_form[username]' ] = $("#fos_user_registration_form_email").val()
        }
        submitFunction(overrideData, null, e.type)
      })
      if ($form.attr("name") === 'fos_user_registration_form') {
        $inputs.errorMessage("init").on("keyup blur", inputEvent)
      } else {
        $inputs.errorMessage("init").on("keyup", function () {
          $inputs.errorMessage("hide")
        })
      }
    })
    return this
  }

  $(".fos_user_registration_register, .fos_user_security_check").ajaxForm();
})

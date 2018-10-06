import $ from 'jquery'
import { TimelineLite } from 'gsap'

export function shrinkingLink ($elems, action) {
  $elems.each(function () {
    const $el = $(this)
    switch (action) {
      default:
        $el.on("click", function () {
          $el[0].shrinkTimeout = setTimeout(function () {
            $el.removeClass("link-clicked").addClass("link-clicked")
            var resetTime = (typeof $el.attr("data-size-reset") === 'undefined' ? 1200 : ($el.attr("data-size-reset") === 'false' ? false : $el.attr("data-size-reset") / 1))
            if (resetTime !== false) {
              if ($el.data("resetTimeout")) {
                clearTimeout($el.data("resetTimeout"))
              }
              $el.data("resetTimeout", setTimeout(function () {
                shrinkingLink($el, 'reset')
              }, resetTime))
            }
          }, 50)
        })
        break
      case "reset":
        if ($el[0].shrinkTimeout) {
          clearTimeout($el[0].shrinkTimeout)
        }
        $el.removeClass("link-clicked")
        break
    }
  })
}

const tweens = {
  "#home": new TimelineLite({ paused: true })
    .to(
      "#home-container",
      0.4,
      {
        z: -80,
        ease: Power2.easeInOut
      }
    ),
  "#login": new TimelineLite({ paused: true })
    .from(
      ".login-wrapper",
      0.65,
      {
        x: "-100%",
        ease: Power2.easeInOut
      }
    ),
  "#register": new TimelineLite({ paused: true })
    .from(
      ".register-wrapper",
      0.65,
      {
        x: "100%",
        ease: Power2.easeInOut
      }
    )
}

const _vars = {
  scrollTops: {},
  resetScrollTimeout: null,
  pageStatus: {
    showing: null
  }
}

const fn = {
  getWrapper: function (viewKey) {
    return $(tweens[ viewKey ].getChildren()[ 0 ]._targets[ 0 ]).parent()
  },
  showView: function (viewKey) {
    const $wrapper = fn.getWrapper(viewKey)

    //reset wrapper's scrolltop which may have been set when hidding and was changerd to fixed position
    $wrapper.scrollTop(0)

    //set scroll position for new view
    $("body").scrollTop(_vars.scrollTops[ viewKey ])

    _vars.pageStatus.selected = null
    _vars.pageStatus.showing = viewKey
    tweens[ viewKey ].play()
  },
  setViewFixed: function (viewKey, wrapperScrollTop) {
    const $oldWrapper = fn.getWrapper(viewKey)
    _vars.scrollTops[ viewKey ] = wrapperScrollTop

    //wrapper to be fixed position, display inline-block and scroll to same Y as body
    $oldWrapper.addClass("wrapper-anim-out").removeClass("wrapper-show")
    $("." + viewKey.substring(1) + "-outer").scrollTop(_vars.scrollTops[ viewKey ])
  }
}

export function transitionPage (pageKey) {
  /**
   * Main showPage function
   */
  //if we request a page that doesn't exist, instead just go home and give console warning.
  if (pageKey && !tweens[ pageKey ]) {
    throw Error(`Cannot show page, tween does not exist for the key ${pageKey}`)
  }

  let $oldWrapper
  let pageToHide
  let wrapperScrollTop

  // We have a key, setup the current page to hide
  if (_vars.pageStatus.showing) {
    pageToHide = _vars.pageStatus.showing
    $oldWrapper = fn.getWrapper(_vars.pageStatus.showing)
    wrapperScrollTop = $("body").scrollTop()
  }

  if (!pageKey) {//go to default view - home
    if (!pageToHide) {
      //no page to hide, reverse the home animation in (zoom back in)
      tweens[ '#home' ].reverse()
    } else {

      //unfix the home screen
      //fix position the view to animate out and hide overflow-x
      $("body").removeClass("home-behind")
      $("body").scrollTop(_vars.scrollTops.body)

      $oldWrapper.removeClass("wrapper-show").addClass("wrapper-anim-out")

      //fix view and set scroll position
      fn.setViewFixed(pageToHide, wrapperScrollTop)

      tweens[ pageToHide ].eventCallback("onReverseComplete", function () {
        $oldWrapper.removeClass("wrapper-anim-out")
        tweens[ '#home' ].reverse()
      })
      tweens[ pageToHide ].reverse()

      _vars.pageStatus.showing = null
    }
  } else {//show a page
    //deal with view if one was selected, but now started to be shown yet
    if (_vars.pageStatus.selected) {
      var $selectedWrapper = fn.getWrapper(_vars.pageStatus.selected)
      $selectedWrapper.removeClass("wrapper-show")
    }
    _vars.pageStatus.selected = pageKey

    //make wrapper relative pos and display table (final state)
    //do this before making body fixed
    var $wrapper = fn.getWrapper(pageKey)
    $wrapper.addClass("wrapper-show")

    //set scrollTop variable for the new view if not set already
    if (!_vars.scrollTops[ pageKey ]) {
      _vars.scrollTops[ pageKey ] = 0
    }

    if (!pageToHide) {
      //set home fixed
      _vars.scrollTops.body = $("body").scrollTop()
      $("body").addClass("home-behind")
      $(".home-outer").scrollTop(_vars.scrollTops.body)

      //shrink home page - when complete, slide in the new page
      tweens[ '#home' ].eventCallback("onComplete", fn.showView, [ pageKey ])
      tweens[ '#home' ].play()
    } else {
      //hide current page to fixed pos
      fn.setViewFixed(pageToHide, wrapperScrollTop)
      tweens[ pageToHide ].eventCallback("onReverseComplete", function () {
        $oldWrapper.removeClass("wrapper-anim-out")
      })
      tweens[ pageToHide ].reverse()

      fn.showView(pageKey)
    }
  }
}

$(function () {
  const $resetLinks = $(".link-text-size").parents("a, button").add(".close-page-icon").not(".video")
  shrinkingLink($resetLinks)
})

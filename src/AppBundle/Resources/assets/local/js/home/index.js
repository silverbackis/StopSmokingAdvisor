require('../../scss/indexAction.scss')

import jQuery from 'jquery'
import RBT from '../../../global/bootstrap-toolkit/bootstrap-toolkit'
import {reflow, changeLayout} from './reflow'
import introTimeline from './introTimeline'
import Store from './store'
import introVideo from './video'
import { transitionPage } from './pageTransitions'

require('./forms')
require('./pageTransitions')

const store = new Store({
  videoPlaying: false
})

const RBT_instance = new RBT(jQuery)
const $ = jQuery

const smallBreaks = [ 'xs', 'sm' ];
const largeBreaks = [ 'md', 'lg', 'xl' ];

$(".preload-bg").each(function () {
  const src = $(this).css("background-image").replace('url(', '').replace(')', '').replace(/\"/gi, "")
  const img = new Image()
  img.src = src
})

const breakpointListener = function (newBreakpoint, oldBreakpoint) {
  if (smallBreaks.indexOf(newBreakpoint) !== -1 && largeBreaks.indexOf(oldBreakpoint) !== -1) {
    //gone down to mobile layout
    changeLayout('mobile', store.getKey('videoPlaying'))

  } else if (largeBreaks.indexOf(newBreakpoint) !== -1 && smallBreaks.indexOf(oldBreakpoint) !== -1) {
    //gone up to desktop layout
    changeLayout('desktop', store.getKey('videoPlaying'))
  }
}

function hashChangeEvent (init) {
  if (init !== true && store.getKey('videoPlaying')) {
    introVideo.pause()
  }
  if (location.hash === '#login' || location.hash === '#register') {
    transitionPage(location.hash)
  } else {
    transitionPage()
  }
}

$(function () {
  reflow(store.getKey('videoPlaying'))
  RBT_instance.viewport.breakpointChanged(breakpointListener)
  changeLayout(smallBreaks.indexOf(RBT_instance.viewport.current()) !== -1 ? 'mobile' : 'desktop')
  $(window).resize(reflow)
  introTimeline.play()
  $(window).on('hashchange', hashChangeEvent)
  introTimeline.eventCallback("onComplete", function () {
    hashChangeEvent(true)
  })
})

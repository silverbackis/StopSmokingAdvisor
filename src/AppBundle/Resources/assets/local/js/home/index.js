require('../../scss/indexAction.scss')

import jQuery from 'jquery'
import viewport from 'responsive-toolkit'
import {reflow, changeLayout} from './reflow'
import introTimeline from './introTimeline'
import Store from './store'
import introVideo from './video'
import { transitionPage } from './pageTransitions'
require('./forms')
require('./pageTransitions')

const $ = jQuery

const visibilityDivs = {
  'xs': $('<div class="device-xs d-block d-sm-none"></div>'),
  'sm': $('<div class="device-sm d-none d-sm-block d-md-none"></div>'),
  'md': $('<div class="device-md d-none d-md-block d-lg-none"></div>'),
  'lg': $('<div class="device-lg d-none d-lg-block d-xl-none"></div>'),
  'xl': $('<div class="device-xl d-none d-xl-block"></div>')
};

viewport.use('bootstrap4', visibilityDivs)
viewport.interval = 300;
viewport.breakpointChanged = function(fn, ms) {
  const self = viewport;

  //clear the resize event if previously set
  if(self.resizeFn){
    $(window).off("resize orientationchange", self.resizeFn);
  }

  self.resizeFn = function(){
    clearTimeout(self.timer);
    self.timer = setTimeout(function(){
      let newBreakpoint = self.current();
      if(newBreakpoint!==self.lastBreakpoint){
        fn(newBreakpoint, self.lastBreakpoint);
        self.lastBreakpoint = newBreakpoint;
      }
    }, ms || self.interval);
  };
  $(window).on("resize orientationchange", self.resizeFn);
}

const store = new Store({
  videoPlaying: false
})

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
  viewport.breakpointChanged(breakpointListener)
  changeLayout(smallBreaks.indexOf(viewport.current()) !== -1 ? 'mobile' : 'desktop')
  $(window).resize(reflow)
  introTimeline.play()
  $(window).on('hashchange', hashChangeEvent)
  introTimeline.eventCallback("onComplete", function () {
    hashChangeEvent(true)
  })
})

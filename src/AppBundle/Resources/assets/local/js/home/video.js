import {TweenLite} from 'gsap'
import Store from './store'
import {reflow} from './reflow'

const store = new Store()

import $ from 'jquery'

const introVideo = window.jwplayer("videoPlayer")
introVideo.setup({
  sources: [
    {
      file: "https://content.jwplatform.com/manifests/9adhtWI8.m3u8",
      label: "HLS"
    },
    {
      file: "http://content.jwplatform.com/videos/9adhtWI8-aHTOGd7Q.mp4",
      label: "1080p"
    },
    {
      file: "http://content.jwplatform.com/videos/9adhtWI8-xhTL5q8u.mp4",
      label: "720p"
    }
  ],
  image: "http://content.jwplatform.com/thumbs/9adhtWI8-1920.jpg",
  mediaid: "9adhtWI8",
  abouttext: "Stop Smoking Advisor",
  aboutlink: "https://www.stopsmokingadvisor.net",
  height: "100%",
  width: "auto",
  preload: true,
  hlshtml: true
})

const vidPlay = function () {
    TweenLite.to(".play-button", 0.3, { x: "100%" })
    store.setKey('videoPlaying', true)
    reflow('tween', function () {
      introVideo.play(true)
    })
  },
  vidStopped = function () {
    $(".play-button").removeClass("link-clicked")
    TweenLite.to(".play-button", 0.3, { x: "0%" })
    store.setKey('videoPlaying', false)
    reflow('tween')
  }
introVideo.setControls(false)
const displayClickFn = function () {
  if (store.getKey('videoPlaying')) {
    introVideo.pause(true)
  } else {
    vidPlay()
  }
}
introVideo.on('displayClick', displayClickFn)

introVideo.on('ready', function () {
  $(".play-button").on("click", function (e) {
    e.preventDefault()
    e.stopPropagation()
    displayClickFn()
  })

  introVideo.on("pause", vidStopped)
  introVideo.on("complete", vidStopped)
})

export default introVideo

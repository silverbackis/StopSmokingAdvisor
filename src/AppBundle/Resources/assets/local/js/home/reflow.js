import {TweenLite, TimelineLite} from 'gsap'
import introVideo from './video'
import $ from 'jquery'
import Store from './store'

const $video = $(".video"),
  $homeRight = $(".home-right"),
  $homeLeft = $(".home-left"),
  $topRow = $(".main-home-row")

export const reflow = function (evt, tweenCompleteFunction) {
  const store = new Store();
  const videoPlaying = store.getKey('videoPlaying')
  const isMobile = store.getKey('isMobile')

  const doTween = evt === 'tween'
  let timeline,
    rightHeight,
    maxWidth,
    windowWidth,
    videoWidth,
    widthIncrease,
    useVideoWidth

  if (doTween) {
    timeline = new TimelineLite({ paused: true })
  }

  if (!isMobile) {
    windowWidth = $(window).width()

    const minHeight = Math.round(Math.max($(".home-left-hmid").outerHeight(), (windowWidth / 100) * 27.5))
    $homeRight.add($homeLeft).css({
      minHeight: minHeight + "px"
    })

    rightHeight = $homeRight.height()
    maxWidth = videoPlaying ? windowWidth : (rightHeight / 9) * 16
    videoWidth = windowWidth * 0.58

    if (maxWidth > windowWidth) {
      maxWidth = windowWidth
    }

    widthIncrease = videoPlaying ? maxWidth - videoWidth : 0
    if (widthIncrease < 0) {
      widthIncrease = 0
    }
    let topRowObj = {
      width: (windowWidth + widthIncrease) + "px",
      marginLeft: (widthIncrease * -1) + "px"
    }

    if (videoPlaying) {
      if (doTween) {
        timeline.to($topRow[ 0 ], 0.3, topRowObj, 0)
      } else {
        TweenLite.set($topRow[ 0 ], topRowObj)
      }

      useVideoWidth = maxWidth
    } else {
      if (doTween) {
        timeline.to($topRow[ 0 ], 0.3, topRowObj, 0)
      } else {
        TweenLite.set($topRow[ 0 ], {
          width: "",
          marginLeft: ""
        })
      }
      useVideoWidth = videoWidth
    }

    const videoCSSObj = {
      maxWidth: maxWidth + "px",
      width: useVideoWidth,
      minHeight: minHeight + "px"
    }

    if (doTween) {
      if (tweenCompleteFunction) {
        timeline.eventCallback("onComplete", tweenCompleteFunction)
      } else {
        timeline.eventCallback("onComplete", null)
      }
      timeline.to($video[ 0 ], 0.3, videoCSSObj, 0).play()
    } else {
      TweenLite.set($video[ 0 ], videoCSSObj)
    }

    return this
  } else if (tweenCompleteFunction) {
    tweenCompleteFunction()
  }
}

export const changeLayout = function (type, restartVideo = false) {
  const store = new Store()
  store.setKey('isMobile', type === 'mobile')

  switch (type) {
    case "mobile":
      $video.appendTo(".mobile-video-holder")
      $homeRight.hide()
      $homeRight.add($homeLeft).css({
        minHeight: ""
      })

      TweenLite.set($topRow[ 0 ], {
        width: "",
        marginLeft: ""
      })
      TweenLite.set($video[ 0 ], {
        maxWidth: "",
        width: "",
        minHeight: ""
      })

      introVideo.resize('100%', 'auto')
      break
    case "desktop":
      $video.appendTo($homeRight)
      $homeRight.show()
      introVideo.resize('auto', '100%')
      reflow()
      break
  }
  if (restartVideo) {
    setTimeout(function () {
      store.setKey('videoPlaying', true)
      introVideo.play(true)
    }, 10)
  }
}

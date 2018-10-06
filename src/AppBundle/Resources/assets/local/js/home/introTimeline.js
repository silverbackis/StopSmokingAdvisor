import {TweenLite, TimelineLite} from 'gsap'
import Store from './store'

import $ from 'jquery'

const $op0 = $(".opacity-0")
$op0.css({
  opacity: "",
  visibility: ""
}).removeClass("opacity-0")

const playButtonTween = TweenLite.from(".play-button", 0.45, { opacity: 0, x: "20%", paused: true })
const introTimeline = new TimelineLite({
  paused: true,
  delay: 0.6
})
  .from(".home-left", 0.45, { opacity: 0, x: -30 })
  .from(".home-right", 0.45, { opacity: 0, y: -30 }, "-=0.15")
  .from(".bottom-links", 0.45, { opacity: 0, y: 30 }, "-=0.15")
  .add(function () {
    if (!new Store().getKey('videoPlaying')) {
      playButtonTween.play()
    } else {
      TweenLite.set(".play-button", { opacity: 1 })
    }
  })

export default introTimeline

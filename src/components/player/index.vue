<template>
  <div id="video-player"
    :style="{'width': width + 'px', 'height': height + 'px'}"
    :class="{'video-player-fullScreen': fullScreen}"
    @mousemove="show"
    ref="player">
    <video id="video"
      :src="src"
      :controls="false"
      @loadedmetadata="createPlayer"
      @progress="onProgress"
      @canplay="onCanplay"
      @canplaythrough="onProgress"
      @timeupdate="onTimeupdate"
      @ended="onEnded"
      @error="onError"
      @waiting="onWaiting"
      @click="playToggle"
      ref="video">
      您的浏览器版本过低，并不支持video标签，请升级！
    </video>

    <div class="shadow" v-show="!canPlay || error || playOrPause" @click.prevent="playToggle">

    </div>

    <div class="loading" v-show="!canPlay && !error">
      <img src="./loading-bubbles.svg" width="64" height="64">
    </div>

    <div class="pausing hover" @click.prevent="playToggle" v-show="playOrPause && canPlay">
      <i class="icon icon-play"></i>
    </div>

    <div class="error" v-show="error">
      <p>播放源出现问题...</p>
    </div>

    <div class="video-controls-wrapper" :class="{'hover': mouseMoving}">
      <div class="btn hover" @click="playToggle" :title="playTitle">
        <i :class="{'icon icon-play': playOrPause, 'icon icon-pause': !playOrPause}"></i>
      </div>

      <div class="track-progress-bar-wrapper">
        <duration-progress-bar
          :bufferScale="buffer / duration"
          :durationScale="current / duration"
          :durationLeft="5 / durationWidth"
          :movingTime="movingTime | formateTime"
          @getMovingTime="getMovingTime"
          @dumpDurationTrack="dumpDurationTrack"
          @wheelDurationTrack="wheelDurationTrack"
          ref="durationProgressBar"/>
      </div>

      <div class="text text-s text-padding">
        <b>{{current | formateTime}}</b>
        /
        <b>{{duration | formateTime}}</b>
      </div>


      <div class="btn hover" @click="volumeToggle" :title="volumeTitle">
        <i :class="{'icon icon-volume-medium': volume > 0.5 && volume <= 1, 'icon icon-volume-low': volume > 0 && volume <= 0.5,'icon icon-volume-mute': volume === 0}"></i>
      </div>

      <div class="volume-progress-bar-wrapper">
        <volume-progress-bar :volume="volume" @dumpVolumeTrack="dumpVolumeTrack" @wheelVolumeTrack="wheelVolumeTrack"/>
      </div>

      <div class="btn text text-s">
        <b>{{volume | formateVolume}}</b>
      </div>

      <div class="btn hover" @click="fullScreenToggle" :title="fullScreenTitle" ref="fullscreen">
        <i :class="{'icon icon-fullscreen': !fullScreen, 'icon icon-notFullscreen': fullScreen}"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import './icon.css'
  import './reset.css'
  import durationProgressBar from './durationProgressBar'
  import volumeProgressBar from './volumeProgressBar'

  export default {
    props: {
      src: {
        type: String,
        default: 'http://183.240.21.83/677184B6B7E3F83BB393955A8E/03001101005A55CD53BC174667F75EBB525462-E2D7-3A2C-403B-14FA2FAC3011.mp4?ccode=050F&duration=865&expire=18000&psid=365dfc259b5eda3f655843b854afe1d6&ups_client_netip=7b417f81&ups_ts=1516083783&ups_userid=&utid=cFVLEqudDDsCAbfr%2FzZxh7Ge&vid=XMzMwNjUyNTkyNA%3D%3D&vkey=A9467964e06263bb4f08a404fecee413a&s=3c64efbfbd707befbfbd' // http://jq22com.qiniudn.com/jq22-sp.mp4 http://10.10.0.88:8081/static/test.mp4 http://localhost:8080/static/demo.mp4
      },
      width: {
        type: Number,
        default: 500
      },
      height: {
        type: Number,
        default: 350
      }
    },
    components: {
      durationProgressBar,
      volumeProgressBar
    },
    data () {
      return {
        video: null,
        playOrPause: true,
        fullScreen: false,
        buffer: 0,
        current: 0,
        duration: 0,
        movingTime: 0,
        volume: 1,
        volumeTemp: 1,
        durationScale: 0,
        durationWidth: 0,
        mouseMoving: false,
        timer: null,
        error: false,
        canPlay: false
      }
    },
    computed: {
      playTitle () {
        return this.playOrPause ? '播放' : '暂停'
      },
      volumeTitle () {
        return this.volume === 0 ? '取消静音' : '静音'
      },
      fullScreenTitle () {
        return this.fullScreen ? '取消全屏' : '全屏'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.durationWidth = this.$refs.durationProgressBar.$el.getBoundingClientRect().width
        window.addEventListener('keydown', this.keydown.bind(this), false)
      })
    },
    methods: {
      keydown () {
        let _this = this
        window.onkeydown = function (e) {
          if (e.keyCode === 32) {
            if (window.event) { // ie
              try {
                e.keyCode = 0
              } catch (e) {}
              e.returnValue = false
            } else { // firefox
              e.preventDefault()
            }
            _this.playToggle()
          }
        }
      },
      throttle () {
        let _this = this
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          _this.mouseMoving = false
          clearTimeout(_this.timer)
        }, 2000)
      },
      show () {
        this.mouseMoving = true
        this.throttle()
      },
      playToggle () {
        if (this.playOrPause) this.video.play()
        else this.video.pause()
        this.playOrPause = !this.playOrPause
      },
      volumeToggle () {
        this.volume = this.volume === 0 ? this.volumeTemp : 0
      },
      fullScreenToggle () {
        this.fullScreen = !this.fullScreen
        if (this.fullScreen) {
          try {
            ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'].forEach((v) => {
              if (v in this.$refs.player) {
                this.$refs.player[v]()
                throw v
              }
            })
          } catch (err) {
            console.log(err)
          }
        } else {
          const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
          if (fullscreenElement) {
            try {
              ['exitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'].forEach((v) => {
                if (v in document) {
                  setTimeout(() => {
                    document[v]()
                  }, 0)
                  throw v
                }
              })
            } catch (err) {
              console.log(err)
            }
          }
        }
        setTimeout(() => {
          this.durationWidth = this.$refs.durationProgressBar.$el.getBoundingClientRect().width
        }, 20)
      },
      createPlayer () {
        this.video = this.$refs.video
        this.current = this.video.currentTime
        this.volume = this.video.volume
        this.duration = this.video.duration
      },
      onCanplay () {
        this.canPlay = true
      },
      play () {
        this.playOrPause = false
        this.video.play()
      },
      pause () {
        this.video.pause()
      },
      onTimeupdate () {
        this.current = this.video.currentTime
      },
      onProgress () {
        // 第一次播放后可能存在缓存所以之后刷新不会再有progress这个过程，所以buffer进度条的宽度不会发生变化
        // 因此要在video监听canplaythrough事件
        try {
          this.buffer = this.$refs.video.buffered.end(0)
        } catch (err) {
          console.log(err)
        }
      },
      onEnded () {
        this.playOrPause = true
      },
      onError () {
        this.error = true
      },
      onWaiting () {
        this.canPlay = false
      },
      getMovingTime (scale) {
        this.movingTime = this.duration * scale
      },
      dumpVolumeTrack (value) {
        this.volume = value
        this.volumeTemp = value
      },
      wheelVolumeTrack (flag) {
        if (flag) {
          if (this.volume + 0.02 <= 1) {
            this.volume = this.volume + 0.02
          }
        } else {
          if (this.volume - 0.02 >= 0) {
            this.volume = this.volume - 0.02
          }
        }
        this.volumeTemp = this.volume
      },
      dumpDurationTrack (scale) {
        this.current = this.duration * scale
        this.video.currentTime = this.current
      },
      wheelDurationTrack (flag) {
        if (flag) {
          if (this.current + 2 <= this.duration) {
            this.current += 2
            this.video.currentTime = this.current
          }
        } else {
          if (this.current - 2 >= 0) {
            this.current -= 2
            this.video.currentTime = this.current
          }
        }
      }
    },
    filters: {
      formateTime (value) {
        let [h, m, s] = [
          Math.floor(value / 3600),
          Math.floor(value % 3600 / 60),
          Math.floor(value % 60)
        ]
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        return `${h}:${m}:${s}`
      },
      formateVolume (value) {
        return Math.floor(value * 100)
      }
    },
    watch: {
      volume (value) {
        this.video.volume = value
      },
      playOrPause () {
        this.show()
      }
    }
  }
</script>

<style lang="scss" scoped>
  #video-player {
    position: relative;
    display: inline-block;
    background: #000;
    &.video-player-fullScreen {
      position: fixed !important;
      z-index: 100000 !important;
      left: 0;
      top: 0;
      width: 100% !important;
      height: 100% !important;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
    .shadow {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }
    .pausing {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      text-shadow: 0px 0px 10px rgba(255, 255, 255, 1);
      cursor: pointer;
      i {
        font-size: 50px;
        color: rgba(242, 156, 177, 1);
      }
    }
    .loading, .error {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      color: rgba(242, 156, 177, 1);
    }
    .video-controls-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 99999999999;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      width: 100%;
      height: 50px;
      background-color: rgba(0, 0, 0, .3);
      box-sizing: border-box;
      user-select: none;
      opacity: 0;
      transition: opacity 1s;
      &:hover, &.hover {
        opacity: 1;
      }
      .btn {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        color: rgba(255, 255, 255, 1);
      }
      .hover:hover {
        color: rgba(242, 156, 177, 1);
        text-shadow: 0px 0px 10px rgba(255, 255, 255, 1);
        cursor: pointer;
      }
      .text {
        color: rgba(255, 255, 255, 1);
        font-weight: 700;
        &.text-s {
          font-size: 12px;
        }
        &.text-m {
          font-size: 20px;
        }
        &.text-padding {
          padding: 0 10px;
        }
      }
      .track-progress-bar-wrapper {
        margin: 0 5px;
        flex: 1;
      }
      .volume-progress-bar-wrapper {
        margin: 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
      }
    }
  }
</style>

<template>
  <div id="video-player"
    :style="{'width': width + 'px', 'height': height + 'px'}"
    :class="{'video-player-fullScreen': fullscreen}"
    @mousemove="show">
    <div class="player" ref="player">
      <video id="video"
        width="100%"
        height="100%"
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
        @seeked="onSeeked"
        @click="playToggle"
        ref="video">
        您的浏览器版本过低，并不支持video标签，请升级！
      </video>

      <div class="shadow" v-show="!canplay || error || playOrPause" @click.prevent="playToggle"></div>

      <div class="loading" v-show="!canplay && !error">
        <div class="circle circle1"></div>
        <div class="circle circle2"></div>
        <div class="circle circle3"></div>
      </div>

      <div class="pausing hover" @click.prevent="playToggle" v-show="playOrPause && canplay">
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
          @cancelDragging="play"
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
          <i :class="{'icon icon-fullscreen': !fullscreen, 'icon icon-notFullscreen': fullscreen}"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './icon.css'
  import durationProgressBar from './durationProgressBar'
  import volumeProgressBar from './volumeProgressBar'

  export default {
    props: {
      src: {
        type: String,
        default: 'http://k.youku.com/player/getFlvPath/sid/051669978909212914527/st/mp4/fileid/03000A0A025A6138DD77B93087F459E32183A1-BB1F-4A07-B8FA-AEA0F07D9D3B?k=929e48fc527734792620249f&hd=0&myp=0&ts=390&ctype=12&ev=1&token=0514&oip=2067890049&ep=cieVHE%2BEX8kI7CPWij8bbi3mcXUIXP4J9h%2BF8NITALkhOe6%2Bmjals5q3PPZBFvEeBCYDGZ7yqdHv%0AaTEVYYIxqB4Q2z%2BoPvqS9oaS5dwmtZB2Zh5Ce7nUxlSeRjH1&ccode=050F&duration=389&expire=18000&psid=362a5fc9dc8df218f1dbcb34fe8484cf&ups_client_netip=7b417f81&ups_ts=1516699789&ups_userid=&utid=cFVLEqudDDsCAbfr%2FzZxh7Ge&vid=XMzMzMTc0MDY0OA%3D%3D&vkey=A14597744e626a5c3f947ffc1a888d520' // http://jq22com.qiniudn.com/jq22-sp.mp4 http://10.10.0.88:8081/static/test.mp4 http://localhost:8080/static/demo.mp4
      },
      width: {
        type: Number,
        default: 700
      },
      height: {
        type: Number,
        default: 500
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
        fullscreen: 0,
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
        canplay: false
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
        return this.fullscreen ? '取消全屏' : '全屏'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.durationWidth = this.$refs.durationProgressBar.$el.getBoundingClientRect().width
        this.bindFullscreenChange()
        window.addEventListener('keydown', this.keydown.bind(this), false)
      })
    },
    methods: {
      fullscreenChange () {
        let fullscreenEle = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
        this.fullscreen = fullscreenEle ? 1 : 0
        // 全屏或者取消全屏后为了保证控制条按钮的left值显示无误而需要重新获取进度条的宽度
        this.durationWidth = this.$refs.durationProgressBar.$el.getBoundingClientRect().width
      },
      bindFullscreenChange () {
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(f => {
          document.addEventListener(f, this.fullscreenChange.bind(this))
        })
      },
      keydown (e) {
        if (e.keyCode === 32) {
          if (window.event) { // ie
            try {
              e.keyCode = 0
            } catch (e) {}
            e.returnValue = false
          } else { // firefox
            e.preventDefault()
          }
          if (this.fullscreen) this.playToggle()
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
        if (this.playOrPause) {
          this.video.play()
          this.canplay = true
        } else {
          this.video.pause()
        }
        this.playOrPause = !this.playOrPause
      },
      volumeToggle () {
        this.volume = this.volume === 0
        ? this.volumeTemp === 0
        ? 1
        : this.volumeTemp
        : 0
      },
      fullScreenToggle () {
        if (!this.fullscreen) {
          try {
            ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'].forEach((v) => {
              if (v in this.$refs.player) {
                this.$refs.player[v]()
                throw v
              }
            })
          } catch (err) {
            // console.log(err)
          }
        } else {
          try {
            ['exitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen', 'msExitFullscreen'].forEach((v) => {
              if (v in document) {
                document[v]()
                throw v
              }
            })
          } catch (err) {
            // console.log(err)
          }
        }
      },
      getMovingTime (scale) {
        this.movingTime = this.duration * scale
      },
      play () {
        setTimeout(() => {
          if (!this.playOrPause) this.video.play()
        }, 20)
      },
      pause () {
        this.video.pause()
      },
      createPlayer () {
        this.video = this.$refs.video
        this.current = this.video.currentTime
        this.volume = this.video.volume
        this.duration = this.video.duration
      },
      onCanplay () {
        this.canplay = true
      },
      onTimeupdate () {
        this.current = this.video.currentTime
      },
      onProgress () {
        // 第一次播放后可能存在缓存所以之后刷新不会再有progress这个过程，所以buffer进度条的宽度不会发生变化
        // 因此要把该函数注册到canplaythrough事件上
        try {
          this.buffer = this.$refs.video.buffered.end(0)
        } catch (err) {
          // console.log(err)
        }
      },
      onEnded () {
        this.playOrPause = true
      },
      onError () {
        this.error = true
      },
      onWaiting () {
        this.canplay = false
      },
      onSeeked () {
        this.canplay = true
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
      dumpDurationTrack (scale, type) {
        this.current = this.duration * scale
        this.video.currentTime = this.current
        if (type === 'mousemove') this.pause()
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
        if (h >= 3600) h = h < 10 ? '0' + h : h
        else h = ''
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        return h ? `${h}:${m}:${s}` : `${m}:${s}`
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
  @keyframes circle {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  #video-player {
    position: relative;
    display: inline-block;
    background-color: #000;
    .player {
      width: 100%;
      height: 100%;
      video {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
      .shadow {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
      }
      .pausing {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 2;
        text-shadow: 0px 0px 10px rgba(255, 255, 255, 1);
        cursor: pointer;
        i {
          font-size: 50px;
          color: rgba(242, 156, 177, 1);
        }
      }
      .loading {
        .circle {
          display: inline-block;
          width: 15px;
          height: 15px;
          border-radius: 15px;
          background-color: rgba(242, 156, 177, 1);
          box-shadow: 0 0 10px #fff;
          transform: scale(0);
          animation: circle .8s ease-out infinite;
          &.circle2 {
            animation-delay: 0.25s;
          }
          &.circle3 {
            animation-delay: 0.5s;
          }
        }
      }
      .loading, .error {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 2;
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
  }
</style>

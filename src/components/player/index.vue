<template>
  <div id="video-player"
    :style="{'width': width + 'px', 'height': height + 'px'}"
    :class="{'video-player-fullScreen': fullScreen}"
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
        @click="playToggle"
        ref="video">
        您的浏览器版本过低，并不支持video标签，请升级！
      </video>

      <div class="shadow" v-show="!canPlay || error || playOrPause" @click.prevent="playToggle"></div>

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
          <i :class="{'icon icon-fullscreen': !fullScreen, 'icon icon-notFullscreen': fullScreen}"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './icon.css'
  // import './reset.css'
  import durationProgressBar from './durationProgressBar'
  import volumeProgressBar from './volumeProgressBar'

  export default {
    props: {
      src: {
        type: String,
        default: 'http://jq22com.qiniudn.com/jq22-sp.mp4' // http://jq22com.qiniudn.com/jq22-sp.mp4 http://10.10.0.88:8081/static/test.mp4 http://localhost:8080/static/demo.mp4
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
        fullScreen: 0,
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
        this.bindFullscreenChange()
      })
    },
    methods: {
      fullscreenChange () {
        let fullscreenEle = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
        this.fullScreen = fullscreenEle ? 1 : 0
      },
      bindFullscreenChange () {
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(f => {
          document.addEventListener(f, this.fullscreenChange.bind(this))
        })
      },
      // keydown (e) {
      //   if (e.keyCode === 32) {
      //     if (window.event) { // ie
      //       try {
      //         e.keyCode = 0
      //       } catch (e) {}
      //       e.returnValue = false
      //     } else { // firefox
      //       e.preventDefault()
      //     }
      //     this.playToggle()
      //   }
      // },
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
        this.volume = this.volume === 0
        ? this.volumeTemp === 0
        ? 1
        : this.volumeTemp
        : 0
      },
      fullScreenToggle () {
        if (!this.fullScreen) {
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
        // 这里设置延迟是为上面的全屏事件应该是异步操作，所以按下全屏按钮后并非立即执行全屏，因此这里要设置延迟要在执行全屏之后再获取对应的宽度，这样显示才不会出错
        // 本来延迟设置的是20ms,但是火狐浏览器20ms后执行还是全屏前的宽度，所以要设置更久才行（以最新的版本测试至少要210）
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
        setTimeout(() => {
          if (!this.playOrPause) this.video.play()
        }, 20)
      },
      pause () {
        this.video.pause()
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
  }
</style>

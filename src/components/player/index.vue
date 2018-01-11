<template>
  <div id="video-player">
    <video id="video"
      :src="src"
      :width="width"
      :height="height"
      :controls="false"
      @canplay="initParams"
      @timeupdate="playing"
      @ended="ended"
      ref="video">
      您的浏览器版本过低，并不支持video标签，请升级！
    </video>

    <div class="video-controls-wrapper">
      <div class="btn hover" @click="playToggle" :title="playTitle">
        <i class="fa" :class="{'fa-play': playOrPause, 'fa-pause': !playOrPause}" aria-hidden="true"></i>
      </div>

      <div class="track-progress-bar-wrapper">
        <duration-progress-bar
          :durationScale="current / this.duration"
          :durationLeft="5 / durationWidth"
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
        <i class="fa" :class="{'fa-volume-up': !mute, 'fa-volume-off': mute}" aria-hidden="true"></i>
      </div>

      <div class="volume-progress-bar-wrapper">
        <volume-progress-bar :volume="volume" @dumpVolumeTrack="dumpVolumeTrack" @wheelVolumeTrack="wheelVolumeTrack"/>
      </div>

      <div class="btn text text-s">
        <b>{{volume | formateVolume}}</b>
      </div>

      <!-- <div class="btn hover" @click="fullScreenToggle" :title="fullScreenTitle">
        <i class="fa" :class="{'fa-arrows-alt': !fullScreen, 'fa-arrows': fullScreen}" aria-hidden="true"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
  import 'font-awesome/css/font-awesome.min.css'
  import durationProgressBar from './durationProgressBar'
  import volumeProgressBar from './volumeProgressBar'

  export default {
    props: {
      src: {
        type: String,
        default: 'http://jq22com.qiniudn.com/jq22-sp.mp4' // http://jq22com.qiniudn.com/jq22-sp.mp4
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
        playOrPause: true,
        mute: false,
        fullScreen: false,
        current: 0,
        duration: 0,
        volume: 1,
        volumeTemp: 1,
        durationScale: 0,
        durationWidth: 0
      }
    },
    computed: {
      playTitle () {
        return this.playOrPause ? '播放' : '暂停'
      },
      volumeTitle () {
        return this.mute ? '取消静音' : '静音'
      },
      fullScreenTitle () {
        return this.fullScreen ? '取消全屏' : '全屏'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.durationWidth = this.$refs.durationProgressBar.$el.getBoundingClientRect().width
      })
    },
    methods: {
      playToggle () {
        if (this.playOrPause) {
          this.video.play()
        } else {
          this.video.pause()
        }
        this.playOrPause = !this.playOrPause
      },
      volumeToggle () {
        this.volume = this.mute ? this.volumeTemp : 0
        this.mute = !this.mute
      },
      fullScreenToggle () {
        this.fullScreen = !this.fullScreen
        // console.log(this.video.mozRequestFullScreen)
        if (this.fullScreen) {
          try {
            ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'].forEach((v) => {
              if (v in this.video) {
                this.video[v]()
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
                  document[v]()
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
      initParams () {
        this.video = this.$refs.video
        this.current = this.video.currentTime
        this.volume = this.video.volume
        this.duration = this.$refs.video.duration
        console.log('video already can play')
      },
      play () {
        this.video.play()
      },
      pause () {
        this.video.pause()
      },
      playing () {
        this.current = this.video.currentTime
      },
      ended () {
        this.playOrPause = true
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
        if (value) this.mute = false
        this.video.volume = value
      }
    }
  }
</script>

<style lang="scss" scoped>
  #video::-webkit-media-controls-enclosure {
    display: none !important;
  }
  #video-player {
    position: relative;
    display: inline-block;
    background: #000;
    video {
      // object-fit: fill;
    }
    .video-controls-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 99999999999;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      background-color: #fff;
      border-left: 1px solid rgba(0, 0, 0, .3);
      border-right: 1px solid rgba(0, 0, 0, .3);
      border-bottom: 1px solid rgba(0, 0, 0, .3);
      box-sizing: border-box;
      user-select: none;
      .btn {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: rgba(0, 0, 0, 1);
      }
      .hover:hover {
        color: rgba(0, 0, 0, .7);
        cursor: pointer;
      }
      .text {
        color: rgba(0, 0, 0, 1);
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
        height: 30px;
      }
    }
  }
</style>
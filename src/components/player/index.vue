<template>
  <div id="video-player">
    <video id="video"
      :src="src"
      :width="width"
      :height="height"
      :controls="false"
      @canplay="initParams"
      @timeupdate="playing"
      ref="video">
      您的浏览器版本过低，并不支持video标签，请升级！
    </video>

    <div class="video-controls-wrapper">
      <div class="btn hover" @click="playToggle" :title="playTitle">
        <i class="fa" :class="{'fa-play': playOrPause, 'fa-pause': !playOrPause}" aria-hidden="true"></i>
      </div>

      <div class="track-progress-bar-wrapper">
        <progress-bar id="track-progress-bar" ref="trackProgressBar">
          <slot>
            <div style="width: 0%" class="buffered-progress-percent"></div>
          </slot>
        </progress-bar>
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
        <progress-bar id="volume-progress-bar"/>
      </div>

      <div class="btn text text-s">
        <b>{{volume | formateVolume}}</b>
      </div>

      <div class="btn hover" @click="fullScreenToggle" :title="fullScreenTitle">
        <i class="fa" :class="{'fa-arrows-alt': !fullScreen, 'fa-arrows': fullScreen}" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import 'font-awesome/css/font-awesome.min.css'
  import progressBar from './progressBar'
  export default {
    props: {
      src: {
        type: String,
        default: 'http://jq22com.qiniudn.com/jq22-sp.mp4'
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
      progressBar
    },
    data () {
      return {
        playOrPause: true,
        mute: false,
        fullScreen: false,
        current: 0,
        duration: 0,
        volume: 1
      }
    },
    computed: {
      playTitle () {
        return this.playOrPause ? '播放' : '暂停'
      },
      volumeTitle () {
        return this.muted ? '取消静音' : '静音'
      },
      fullScreenTitle () {
        return this.fullScreen ? '取消全屏' : '全屏'
      }
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
        this.mute = !this.mute
        this.video.volume = this.mute ? this.volume : 0
      },
      fullScreenToggle () {
        this.fullScreen = !this.fullScreen
        if (this.fullScreen) {
          this.video.webkitRequestFullScreen()
        } else {
          document.webkitExitFullscreen()
        }
      },
      initParams () {
        this.video = this.$refs.video
        this.current = this.video.currentTime
        this.volume = this.video.volume
        this.duration = this.$refs.video.duration
        console.log('video already can play')
      },
      playing () {
        this.current = this.video.currentTime
        this.$refs.trackProgressBar.setCurrent(this.current / this.duration)
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
        return value.toFixed(2) * 100
      }
    }
  }
</script>

<style lang="scss" scoped>
  #video::-webkit-media-controls-enclosure{
    display:none !important;
  }
  #video-player {
    position: relative;
    display: inline-block;
    vertical-align: top;
    background: #000;
    #video {
      // object-fit: fill;
    }
    .video-controls-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 3000000000;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, .3);
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
        .buffered-progress-percent {
          position: absolute;
          left: 0;
          top: 0;
          z-index: -1;
          width: 0;
          height: 100%;
          background-color: rgba(255, 155, 55, .4);
        }
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

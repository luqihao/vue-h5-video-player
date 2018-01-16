<template lang="html">
  <div class="progress-track" ref="track"
    @click.prevent="dumpTrack"
    @mousewheel.prevent="wheelTrack"
    @mousemove.prevent="getMovingTime"
    @mouseout.prevent="hideMovingTime">
    <div :style="{width: bufferScale * 100 + '%'}" class="buffered-progress-percent"></div>
    <div :style="{width: durationScale * 100 + '%'}" class="progress-percent" ref="percent"></div>
    <div :style="{left: (durationScale - durationLeft) * 100 + '%'}" class="progress-control" @mousedown.prevent="bindEvents" ref="control"></div>
    <div class="movingTime" :style="{left: movingLeft * 100 + '%'}" v-show="movingFlag">
      <b>{{movingTime}}</b>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      bufferScale: {
        type: Number,
        default: 0
      },
      durationScale: {
        type: Number,
        default: 0
      },
      durationLeft: {
        type: Number,
        default: 0
      },
      movingTime: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        isDragging: false,
        movingLeft: 0,
        movingFlag: false
      }
    },
    methods: {
      getMovingTime (e) {
        let left = e.clientX - this.$refs.track.getBoundingClientRect().left
        let width = this.$refs.track.getBoundingClientRect().width
        if (left <= width && left >= 0) {
          this.$emit('getMovingTime', left / width)
          this.movingLeft = (left - 30) / width
          this.movingFlag = true
        }
      },
      hideMovingTime () {
        this.movingFlag = false
      },
      bindEvents () {
        this.isDragging = true
        window.addEventListener('mousemove', this.controlsDragging, false)
        window.addEventListener('mouseup', this.cancelDragging, false)
      },
      controlsDragging (e) {
        if (this.isDragging) {
          this.dumpTrack(e)
        }
      },
      cancelDragging (e) {
        this.isDragging = false
        window.removeEventListener('mousemove', this.controlsDragging, false)
        window.removeEventListener('mouseup', this.cancelDragging, false)
      },
      dumpTrack (e) {
        let left = e.clientX - this.$refs.track.getBoundingClientRect().left
        let width = this.$refs.track.getBoundingClientRect().width
        if (left <= width && left >= 0) {
          this.$emit('dumpDurationTrack', left / width)
        }
      },
      wheelTrack (e) {
        if (e.wheelDelta === 120) {
          this.$emit('wheelDurationTrack', true)
        }
        if (e.wheelDelta === -120) {
          this.$emit('wheelDurationTrack', false)
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('mousemove', this.controlsDragging, false)
      window.removeEventListener('mouseup', this.cancelDragging, false)
    }
  }
</script>

<style lang="scss" scoped>
  .progress-track {
    position: relative;
    width: 100%;
    height: 5px;
    background-color: rgba(255, 255, 255, .5);
    cursor: pointer;
    .buffered-progress-percent {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      height: 100%;
      background-color: rgba(242, 156, 177, .7);
    }
    .progress-percent {
      width: 0;
      height: 100%;
      background-color: rgba(242, 156, 177, 1);
    }
    .progress-control {
      position: absolute;
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      border: 3px solid #fff;
      box-sizing: border-box;
      box-shadow: .5px .5px 1px rgba(0, 0, 0, .8);
      background-color: rgba(242, 156, 177, 1);
      cursor: pointer;
    }
    .movingTime {
      position: absolute;
      top: -25px;
      left: -30px;
      width: 60px;
      text-align: center;
      background-color: #fff;
      border: 2px solid rgba(242, 156, 177, 1);
      border-radius: 3px;
      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-top: 5px solid rgba(242, 156, 177, 1);
        border-left: 5px solid rgba(242, 156, 177, 0);
        border-right: 5px solid rgba(242, 156, 177, 0);
        border-bottom: 5px solid rgba(242, 156, 177, 0);
      }
      b {
        color: rgba(242, 156, 177, 1);
        font-size: 12px;
        font-weight: 700;
      }
    }
  }
</style>

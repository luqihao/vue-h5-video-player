<template lang="html">
  <div class="progress-track" ref="track" @click.prevent="dumpTrack" @mousewheel.prevent="wheelTrack">
    <div style="width: 0%" class="buffered-progress-percent"></div>
    <div :style="{width: durationScale * 100 + '%'}" class="progress-percent" ref="percent"></div>
    <div :style="{left: (durationScale - durationLeft) * 100 + '%'}" class="progress-control" @mousedown.prevent="bindEvents" ref="control"></div>
  </div>
</template>
<script>
  export default {
    props: {
      durationScale: {
        type: Number,
        default: 0
      },
      durationLeft: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        isDragging: false
      }
    },
    methods: {
      bindEvents () {
        this.isDragging = true
        window.addEventListener('mousemove', this.controlsDragging, false)
        window.addEventListener('mouseup', this.cancelDragging, false)
      },
      controlsDragging (mousedownX) {
        if (this.isDragging) {
          let e = event || window.event
          this.dumpTrack(e)
        }
      },
      cancelDragging () {
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
      wheelTrack () {
        let e = event || window.event
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
    height: 3px;
    background-color: rgba(0, 0, 0, .2);
    cursor: pointer;
    .buffered-progress-percent {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      height: 100%;
      background-color: rgba(255, 155, 55, .4);
    }
    .progress-percent {
      width: 0;
      height: 100%;
      background-color: rgba(255, 155, 55, 1);
    }
    .progress-control {
      position: absolute;
      left: -5px;
      top: -2.5px;
      z-index: 1;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      border: 2.5px solid #fff;
      box-sizing: border-box;
      box-shadow: .5px .5px 1px rgba(0, 0, 0, .8);
      background-color: rgba(55, 155, 255, 1);
      cursor: pointer;
    }
  }
</style>

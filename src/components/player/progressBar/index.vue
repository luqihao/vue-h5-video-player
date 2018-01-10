<template lang="html">
  <div class="progress-track" ref="track" @click.prevent="dumpTrack" @mousewheel.prevent="wheelTrack">
    <slot></slot>
    <div style="width: 0%" class="progress-percent" ref="percent"></div>
    <div style="left: -5px" class="progress-control" @mousedown.prevent="bindEvents" ref="control"></div>
  </div>
</template>
<script>
  export default {
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
      setPercent (width) {
        this.$refs.percent.style.width = width + 'px'
      },
      setControl (left) {
        this.$refs.control.style.left = left + 'px'
      },
      dumpTrack (e) {
        let left = e.clientX - this.$refs.track.getBoundingClientRect().left
        let width = this.$refs.track.getBoundingClientRect().width
        if (left <= width && left >= 0) {
          this.setPercent(left)
          this.setControl(left - 5)
        }
      },
      wheelTrack () {
        let e = event || window.event
        let left = Number(this.$refs.control.style.left.replace('px', ''))
        let width = this.$refs.track.getBoundingClientRect().width
        if (e.wheelDelta === 120) {
          left += 1
        }
        if (e.wheelDelta === -120) {
          left -= 1
        }
        if (left <= width - 5 && left >= -5) {
          this.setPercent(left + 5)
          this.setControl(left)
        }
      },
      setCurrent (scale) {
        let width = this.$refs.track.getBoundingClientRect().width
        this.setPercent(scale * width)
        this.setControl(scale * width - 5)
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
    .progress-percent {
        height: 100%;
        background-color: rgba(255, 155, 55, 1);
    }
    .progress-control {
      position: absolute;
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

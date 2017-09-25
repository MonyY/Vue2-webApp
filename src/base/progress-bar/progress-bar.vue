<template lang='jade'>
  .progress-bar(ref="progressBar" @click="progressClick")
    .bar-inner
      .progress(ref="progress")
      .progress-btn-wrapper
        .progress-btn(ref="progressBtn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend="progressTouchEnd"
        )
</template>

<script>
  import { prefixStyle } from 'common/js/dom'

  const btnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        // 在拖动过程中
        this.touch.initiated = true
        // 触摸时的位置
        this.touch.starX = e.touches[0].pageX
        // 进度条已偏移的量
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        // 移动的距离
        const deltaX = e.touches[0].pageX - this.touch.starX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - btnWidth, Math.max(0, this.touch.left + deltaX ))
        this._offset(offsetWidth)
      },
      progressTouchEnd(e) {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      _offset(offsetWidth) {
        // 进度条移动
        this.$refs.progress.style.width = `${offsetWidth}px`
          // 进度条小球移动
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      // 同步播放进度
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - btnWidth
        // 拖动的百分比
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent(newVal) {
        if (newVal >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - btnWidth
          const offsetWidth = newVal * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
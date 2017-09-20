<template lang='jade'>
  .progress-circle
    svg(:width="radius", :height="radius" viewBox="0 0 100 100")
      circle.progress-background(r="50" cx="50" cy="50" fill="transparent")
      circle.progress-bar(r="50" cx="50" cy="50" fill="transparent", :stroke-dasharray="dashArray", :stroke-dashoffset="dashOffset")
    slot
</template>

<script>
  export default {
    props: {
      radius: {
        type: Number,
        default: 10
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
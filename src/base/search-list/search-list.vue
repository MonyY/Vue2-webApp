<template lang='jade'>
  .search-list(v-show="searchs.length")
    transition-group(name="list" tag="ul")
      li.search-item(:key="item" v-for="item in searchs" @click="selectItem(item)")
        span.text {{item}}
        span.icon(@click.stop="deleteOne(item)")
          i.icon-delete
</template>

<script>
  export default {
    props: {
      searchs: {
        type: Array,
        deafult: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
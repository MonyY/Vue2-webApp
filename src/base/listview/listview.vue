<template lang='jade'>
  Scroll.listview(
    :data="data" 
    ref="listview", 
    :listenScroll="listenScroll", 
    :probeType="probeType" 
    @scroll="scroll"
  )
    ul
      li.list-group(v-for="group in data" ref="listGroup")
        h2.list-group-title {{group.title}}
        ul
          li.list-group-item(v-for="item in group.items" @click="selectItem(item)")
            img.avatar(v-lazy="item.avatar")
            span.name {{item.name}}
    .list-shortcut(@touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove")
      ul
        li.item(v-for="(item, index) in shortcut", :data-index="index", :class="{'current':curIndex===index}") {{item}}
    .list-fixed(v-show="fixedTitle" ref="fixed")
      h1.fixed-title {{fixedTitle}}
    .loading-container(v-show="!data.length")
      Loading
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getData } from 'common/js/dom'

  const TITLE_HEIGHT = 30 // 左边导航每行dom高度
  const ANCHOR_HEIGHT = 18 // 右边导航每个字符dom高度

  export default {
    data() {
      return {
        scrollY: -1,
        curIndex: 0,
        diff: -1
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcut() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.curIndex] ? this.data[this.curIndex].title : ''
      }
    },
    components: {
      Scroll, Loading
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },

      // 点击字母，列表滚动至对应位置
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.start = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex // 滚动开始时的下标
        this._scrollTo(anchorIndex)
      },

      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.end = firstTouch.pageY
        // Y轴滚动的偏移量
        let delta = (this.touch.end - this.touch.start) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },

      scroll(pos) {
        this.scrollY = pos.y
      },

      _scrollTo(index) {
        // 处理点击左侧导航上下边框时字母失去高亮
        if (!index && index !== 0) {
          return
        }
        // 处理滚动到边界时字母失去高亮
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index] // 点击字母时高亮
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 计算右侧listGroup高度
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.curIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.curIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
<template lang='jade'>
  .recommend
    //- 穿入discList确保有数据并撑开元素高度
    Scroll.recommend-content(:data="discList" ref="scroll")
      //- 此div为了让轮播图和列表一起滚动
      div
        //- v-if的原因是确保获取到数据后，再渲染组件，避免组件内获取不到dom
        .slider-wrapper(v-if="recommends.length")
          Slider
            div(v-for="item in recommends")
              a(:href="item.linkUrl")
                img(:src="item.picUrl" @load="imgLoading")
        .recommend-list
          h1.list-title 热门歌单推荐
          ul
            li.item(v-for="item in discList" @click="selectItem(item)")
              .icon
                img(v-lazy="item.imgurl" width="60" height="60")
              .text
                h2.name(v-html="item.creator.name")
                p.desc(v-html="item.dissname")
      .loading-container(v-show="!discList.length")
        Loading(:title="'飞速加载中...'")
    router-view
</template>

<script>
  import Slider from 'base/slider/slider'
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { mapMutations } from 'vuex'
  export default {
    components: {
      Slider, Scroll, Loading
    },
    data () {
      return {
        recommends: [],
        discList: []
      }
    },
    mounted () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((rep) => {
          if (rep.code === ERR_OK) {
            this.recommends = rep.data.slider
          }
        })
      },

      _getDiscList() {
        getDiscList().then((rep) => {
          if (rep.code === ERR_OK) {
            this.discList = rep.data.list
          }
        })
      },

      // 一旦有图片加载成功，重新计算滚动高度
      imgLoading() {
        if (!this.load) {
          // 保证只调用一次
          this.load = true
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20);
        }
      },

      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },

      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
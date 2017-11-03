<template lang='jade'>
  transition(name="slide")
    .add-song(v-show="showFlag" @click.stop="")
      .header
        h1.title 添加歌曲到列表
        .close(@click="hide")
          i.icon-close
      .search-box-wrapper
        SearchBox(placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox")
      .shortcut(v-show="!query")
        Switches(:currentIndex="currentIndex", :switches="switches" @switch="switchItem")
        .list-wrapper
          Scroll.list-scroll(v-if="currentIndex === 0", :data="playHistory" ref="songList")
            .list-inner
              SongList(:songs="playHistory" @select="selectSong")
          Scroll.list-scroll(v-if="currentIndex === 1", :data="searchHistory", :refreshDelay="refreshDelay" ref="searchList")
            .list-inner
              SearchList(@delete="deleteSearchHistory" @select="addQuery", :searchs="searchHistory")
      .search-result(v-show="query")
        Suggest(:query="query", :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput")
      TopTip(ref="topTip")
        .tip-title
          i.icon-ok
          span.text 1首歌曲已经添加到播放列表
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import SongList from 'base/song-list/song-list'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Switches from 'base/switches/switches'
  import TopTip from 'base/top-tip/top-tip'
  import Suggest from 'components/suggest/suggest'
  import { searchMixin } from 'common/js/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Song from 'common/js/song'

  export default {
    mixins: [searchMixin],
    components: {
      SearchBox, Suggest, Switches, Scroll, SongList, SearchList, TopTip
    },
    data () {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          { name: '最近播放' },
          { name: '搜索历史' }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show() {
        this.showFlag = true
        this.refreshList()
      },
      hide() {
        this.showFlag = false
      },
      refreshList() {
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      selectSuggest() {
        this.saveSearch()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.$refs.topTip.show()
        }
      },
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
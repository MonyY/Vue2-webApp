<template lang='jade'>
  .search
    .search-box-wrapper
      Search(ref="searchQuery" @query="onQueryChange")
    .shortcut-wrapper(v-show="!query" ref="shortcutWrapper")
      Scroll.shortcut(:data="shortcut" ref="shortcut", :refreshDelay="refreshDelay")
        div
          .hot-key
            h1.title 热门搜索
            ul 
              li.item(v-for="item in hotKey" @click="addQuery(item.k)")
                span {{item.k}}
          .search-history(v-show="searchHistory.length")
            h1.title
              span.text 搜索历史
              span.clear(@click="showConfirm")
                i.icon-clear
            SearchList(:searchs="searchHistory" @select="addQuery" @delete="deleteSearchHistory")
    .search-result(v-show="query" ref="searchResult")
      Suggest(:query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest")
    Confirm(ref="confirm" text="是否清空所有搜索历史?" @confirm="clearSearchHistory")
    router-view
</template>

<script>
  import Search from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import { mapActions } from 'vuex'
  import { playlistMixin, searchMixin } from 'common/js/mixin'

  export default {
    mixins: [playlistMixin, searchMixin],
    components: {
      Search, Suggest, SearchList, Confirm, Scroll
    },
    created() {
      this._getHotKey()
    },
    data () {
      return {
        hotKey: []
      }
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      },
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '80px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if(res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    }
  }
</script>

<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
<template lang='jade'>
  .singer
    Listview(:data="singers" @select="selectSinger")
    router-view
</template>

<script>
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import { mapMutations } from 'vuex'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10 // 热门数据数量

  export default {
    components: {
      Listview
    },

    data () {
      return {
        singers: []
      }
    },

    mounted() {
      this._getSingerList()
    },

    methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },

      _getSingerList() {
        getSingerList().then((rep) => {
          if( rep.code === ERR_OK ) {
            this.singers = this._normalizeSinger(rep.data.list)
          }
        })
      },

      // 格式化歌手数据
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }  
        }

        list.forEach((item, index) => {
          if ( index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          
          // 根据姓名首字母做聚类
          const key = item.Findex
          // 创建字母分类歌手数组
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        // 将对象中热门和字母分别放在两个数组里
        for( let key in map) {
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // 排序字母数组
        ret.sort( (a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },

      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style lang='stylus' scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
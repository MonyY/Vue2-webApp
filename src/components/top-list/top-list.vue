<template lang='jade'>
  transition(name="slide")
    MusicList(:title="title", :bg-image="bgImage", :songs="songs", :rank="rank")
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getMusicList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  export default {
    components: {
      MusicList
    },
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret.splice(0, 100)
      }
    }
  }
</script>

<style lang='stylus' scoped>
  .slide-enter-active, .slide-leave-active
    transition: all .3s ease
  
  .slide-enter, .slide-leave-to 
    transform: translate3d(100%, 0, 0)
</style>
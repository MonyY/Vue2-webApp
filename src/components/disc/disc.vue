<template lang='jade'>
  transition(name="slide")
    MusicList(:title="title", :bg-image="bgImage", :songs="songs")
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  export default {
    components: {
      MusicList
    },
    data () {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods: {
      _getSongList() {
        getSongList(this.disc.dissid).then((res) => {
          if (!this.disc.dissid) {
            this.$router.push('/recommend')
            return
          }
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style lang='stylus' scoped>
  .slide-enter-active, .slide-leave-active
    transition: all .3s
  
  .slide-enter, .slide-leave-to 
    transform: translate3d(100%, 0, 0)
</style>
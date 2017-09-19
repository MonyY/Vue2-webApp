<template lang='jade'>
  #app
    MHeeder
    Tab
    keep-alive
      router-view
    Player
</template>

<script>
  import MHeeder from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'
  export default {
    components: {
      MHeeder, Tab, Player
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang='stylus' scoped>

</style>
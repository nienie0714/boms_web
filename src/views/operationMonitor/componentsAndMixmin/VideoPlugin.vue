<template>
  <div id="runtimePlayers">
    <div id="vxg_media_player1" class="vxgplayer"></div>
  </div>
</template>

<script>
export default {
  created() {
    this.$nextTick(() => {
      vxgplayer('vxg_media_player1', {
        url: 'rtsp://3.84.6.190/vod/mp4:BigBuckBunny_115k.mov',
        nmf_path: 'media_player.nmf',
        nmf_src: '/media_player.nmf',
        latency: 300000,
        aspect_ratio_mode: 1,
        autohide: 3,
        autostart: true,
        controls: true,
        connection_timeout: 5000,
        connection_udp: 0,
        custom_digital_zoom: false
      }).ready(function () {
        vxgplayer('vxg_media_player1').play()
      })
    })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
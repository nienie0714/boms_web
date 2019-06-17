module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.255.1.4:8989/',
        // target: 'http://10.254.1.16:8888/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        },
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/style/global.scss";
        `
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': '@/assets',
        '@img': '@/assets/img',
        '@icon': '@/assets/img/icon',
        '@lug': '@/assets/img/icon/lug',
        '@mixin': '@/components/mixin',
        '@view': '@/components/view'
      }
    }
  }
}
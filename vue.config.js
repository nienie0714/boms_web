const path = require('path')
const Timestamp = new Date().getTime()
process.env.VUE_APP_Version = 'v1.0'
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.255.1.14:8989/',
        // target: 'http://10.255.1.9:8080/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        },
      },
      '/foo': {
        target: '<other_url>'
      }
    },
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "~@/style/global.scss";
        `
      }
    }
    // extract: true,
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
      },
    },
    stats: {
      warningsFilter: (warning) => /Conflicting order between/gm.test(warning),
      children: false
    },
    output: {
      filename: `js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
      chunkFilename: `js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
    }
  },
  // chainWebpack: config => {
  //   const oneOfsMap = config.module.rule('scss').oneOfs.store
  //   oneOfsMap.forEach(item => {
  //     item
  //       .use('sass-resources-loader')
  //       .loader('sass-resources-loader')
  //       .options({
  //         // Provide path to the file with resources
  //         resources: path.resolve('./src/style/global.scss')
  //       })
  //       .end()
  //   })
  // }
}
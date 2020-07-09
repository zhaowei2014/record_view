const path = require('path');
const programName = process.argv[process.argv.length - 1];
const userInfo = require('./mock/info');
const logout = require('./mock/logout');
const shareList = require('./mock/share/list.json');
const district = require('./mock/district');
const order = require('./mock/order');
const succ = require('./mock/succ.json');


module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  pwa: {
    name: 'dj_admin_view',
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  // 将启动参数复制给全局环境变量
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0]['process.env'], {
        name: JSON.stringify(programName)
      });
      return definitions;
    });
  },
  devServer: {
    proxy: {
      "/dj_admin": {
        target: "http://localhost:40060",
        changeOrigin: true
      },
      "/dj_task": {
        target: "http://localhost:40150",
        changeOrigin: true
      },
      "/fdfs": {
        target: "http://192.168.6.182:8880",
        changeOrigin: true
      }
    },
    port: 8081,
    before(app) {
      app.get('/dj_admin/activity/share/list', (req, res) => {
        res.json(shareList);
      });
      app.post('/dc/user/login', (req, res) => {
        res.json(userInfo);
      });
      app.post('/dc/user/check', (req, res) => {
        res.json(userInfo);
      });
      app.post('/dc/user/info', (req, res) => {
        res.json(userInfo);
      });
      app.post('/dc/user/logout', (req, res) => {
        res.json(logout);
      });
      app.get("/dj_admin/common/district/list", (req, res) => {
        res.json(district)
      });
      app.get("/dj_admin/activity/order/list", (req, res) => {
        res.json(order)
      });
      app.get("/dj_admin/config/version/query", (req, res) => {
        res.json(succ)
      })
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/common/styles/_variables.scss'),
        path.resolve(__dirname, 'src/common/styles/_mixins.scss')
      ]
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'none',
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // 拆分Vue
          vue: {
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            name: 'chunk-vue'
          },
          // 拆分Element
          element: {
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            name: 'chunk-element'
          }
        }
      }
    }
  }
};

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: 'script.js'
    }
  },
  css: {
    extract: {
      filename: 'styles.css'
    }
  },
  publicPath: ''
};
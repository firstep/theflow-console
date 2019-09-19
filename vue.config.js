module.exports = {
  lintOnSave: false,
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'test',
  devServer: {
    port: 8808
  }
}

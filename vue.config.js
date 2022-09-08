const { defineConfig } = require('@vue/cli-service')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
        customFileProtocol: './',
        builderOptions: {
            publish: ['github'],
            productName: "SAS Code Generator",
        },
    },
},
configureWebpack: {
    plugins: [
        new MiniCssExtractPlugin()
    ]
  }
})

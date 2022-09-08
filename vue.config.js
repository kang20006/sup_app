const { defineConfig } = require('@vue/cli-service')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
        customFileProtocol: './',
        builderOptions: {
            publish: {
              "provider": "github",
              "owner": "kang20006",
              "repo": "sup_app"
            },
            productName: "Supa App",
        },
    },
},
configureWebpack: {
    plugins: [
        new MiniCssExtractPlugin()
    ]
  }
})

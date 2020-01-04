/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const express = require('express')
var proxy = require('http-proxy-middleware')
const { createBundleRenderer } = require('vue-server-renderer')

const devServerBaseURL = process.env.DEV_SERVER_BASE_URL || 'http://localhost'
const devServerPort = process.env.DEV_SERVER_PORT || 8080

const app = express()

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    runInNewContext: false
  }))
}
const templatePath = path.resolve(__dirname, './src/index.template.html')

const bundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync(templatePath, 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = createRenderer(bundle, {
  template,
  clientManifest
})

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.use('/js/main*', proxy({
    target: `${devServerBaseURL}/${devServerPort}`,
    changeOrigin: true,
    pathRewrite: function (path) {
      return path.includes('main')
        ? '/main.js'
        : path
    },
    prependPath: false
  }))

  app.use('/*hot-update*', proxy({
    target: `${devServerBaseURL}/${devServerPort}`,
    changeOrigin: true
  }))

  app.use('/sockjs-node', proxy({
    target: `${devServerBaseURL}/${devServerPort}`,
    changeOrigin: true,
    ws: true
  }))
}

app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
app.use('/css', express.static(path.resolve(__dirname, './dist/css')))

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')

  const context = {
    title: 'Vue HN',
    url: req.url
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.url) {
        res.redirect(err.url)
      } else {
        // Render Error Page or Redirect
        res.status(500).end('500 | Internal Server Error')
        console.error(`error during render : ${req.url}`)
        console.error(err.stack)
      }
    }
    if (context.renderState) {
      context.renderState()
    }
    res.status(context.HTTPStatus || 200)
    res.send(html)
  })
})

module.exports = app

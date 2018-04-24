import http from 'http'
import express from 'express'
import throng from 'throng'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'
import config from './config'

const log         = bunyan.createLogger(config.logger.options)
const app         = express()
const httpServer  = http.Server(app)

// entry point to clustering (non-sticky) web server
throng({
  workers:  config.server.concurrency,
  lifetime: Infinity,
  grace:    8000,
  start:    startApp
})


//FUNCTIONS
function startApp() {
  app.use(bodyParser.urlencoded({extended:true, limit:'1mb'}))
  app.use(bodyParser.json({limit:'1mb'}))

  // Enable CORS for all routes
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Max-Age", "600")

    // Handles preflight request for CORS
    if (req.method.toLowerCase() === 'options')
      return res.sendStatus(200)

    next()
  })

  // Error handling for any previous middleware
  app.use(function(err, req, res, next) {
    if (err) {
      log.error(`Error in express middleware:`, err)
      return res.status(422).json({ error: `Error in express middleware: ${err.toString()}` })
    }
    next()
  })

  app.post('/useriq', function useriqRoute(req, res) {
    log.info(`Got event from useriq:`, req.body.useriq_event)
    res.sendStatus(200)
  })

  httpServer.listen(config.server.port, () => log.info(`listening on *: ${config.server.port}`))
}

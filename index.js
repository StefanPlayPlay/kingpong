let express = require('express')
let http = require('http')
let path = require('path')

let app = express()

app.get('/', function(req, res, next) {
  let  data = {
    content: 'Hello world!',
    title: 'Bootstrap example'
  }
  return res.json({"body":"coucou"});
})

let server = http.createServer(app)

server.listen('3000', () => {
  console.log('Listening on port 3000')
})
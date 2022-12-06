let express = require('express')
let http = require('http')
let path = require('path')
const bodyParser = require('body-parser');


let app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

let server = http.createServer(app)

server.listen('3000', () => {
  console.log('Listening on port 3000')
})
require('dotenv').config();

const { NEXMO_API_KEY, NEXMO_API_SECRET } = process.env;

const express = require('express');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

const app = express();

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname + '/public'));

const nexmo = new Nexmo(
  {
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
  },
  { debug: true }
);

// Middleware
app.use(express.json());

// Landing page
app.get('/', (req, res) => {
  res.render('index');
});

// Catch submit here..
app.post('/', (req, res) => {
  // console.log(req.body);
  const recipient = req.body.recipient;
  const msg = req.body.msg;

  nexmo.message.sendSms(
    'NEXMO',
    recipient,
    msg,
    { type: 'unicode' },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        // Emit some data
        const data = {
          id: responseData.messages[0]['message-id'],
          recipient: responseData.messages[0]['to']
        };
        io.emit('smsIshatupwa', data);
        // Go catch that on the client side..
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Sms server started on port ${PORT}..`);
});

// Connect to socket.io
const io = socketio(server);
io.on('connection', socket => {
  console.log('Socket io connected..');
});
io.on('disconnect', () => {
  console.log('Socket io disconnected!');
});

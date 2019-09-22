const numberInput = document.getElementById('cell'),
  textInput = document.getElementById('msg'),
  sendButton = document.getElementById('send'),
  rpt1 = document.querySelector('.rpt1'),
  rpt2 = document.querySelector('.rpt2');

sendButton.addEventListener('click', send, false);

const socket = io();
socket.on('smsIshatupwa', function(data) {
  rpt1.innerHTML =
    ' sent to +' + data.recipient + ' <i class="fa fa-check"></i>';
  rpt2.innerHTML =
    'Your message was successfuly sent to +' +
    data.recipient +
    ' <i class="fa fa-check"></i>';
  setTimeout(clearRpt, 5000);
});

function clearRpt() {
  rpt1.innerHTML = '';
  rpt2.innerHTML = '';
}

function send() {
  const recipient = numberInput.value.replace(/\D/g, ''); // Remove non-numerics
  const msg = textInput.value;

  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ recipient, msg })
  })
    .then(function(res) {
      console.log(res);
    })
    .catch(function(error) {
      console.log(error);
    });
}

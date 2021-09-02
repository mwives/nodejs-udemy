const socket = io();

const $msgForm = document.querySelector('#msg-form');
const $msgFormInput = $msgForm.querySelector('#msg-input');
const $msgFormBtn = $msgForm.querySelector('#send-msg-btn');
const $sendLocationBtn = document.querySelector('button#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  // Get last message height and it's margin bottom
  const lastMsg = $messages.lastElementChild;
  const lastMsgMargin = window.getComputedStyle(lastMsg.lastElementChild).marginBottom;

  const msgHeight = lastMsg.offsetHeight + parseInt(lastMsgMargin)
  const containerHeight = $messages.offsetHeight;
  const scrollHeight = $messages.scrollHeight;
  const scrollPosition = $messages.scrollTop;
    
  if (scrollHeight - (msgHeight + scrollPosition) <= containerHeight) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('printMessage', (msg) => {
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    msg: msg.text,
    createdAt: moment(msg.createdAt).format('HH:mm')
  });

  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', (msg) => {
  console.log(msg);

  const html = Mustache.render(locationTemplate, {
    username: msg.username,
    url: msg.url,
    createdAt: moment(msg.createdAt).format('HH:mm')
  });

  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  $sidebar.innerHTML = html;
});

$msgForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $msgFormBtn.setAttribute('disabled', 'disabled');

  const msg = e.target.elements.msgInput.value;

  socket.emit('sendMessage', msg, (error) => {
    $msgFormBtn.removeAttribute('disabled');
    $msgFormInput.value = '';
    $msgFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered');
  });
});

$sendLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is no supported in you browser.');
  }

  $sendLocationBtn.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('location', {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }, (msg) => {
      $sendLocationBtn.removeAttribute('disabled');
      console.log(msg);
    });
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
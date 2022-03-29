const socket = io.connect();

const cargarMensaje = (e)=> {
  e.preventDefault();
 
  const fecha = new Date().toLocaleString();
  const mensaje = {
      email: document.getElementById('chatInputEmail').value,
      message: document.getElementById('chatInputMessage').value,
      timestamp: fecha 
  }
  document.getElementById('chatInputMessage').value='';
  socket.emit('new-message', mensaje);

  return false;
}

const renderMensajes = (mensajes) => {
  mensajes.reverse();
  const html = mensajes.map((mensaje) => {
      return(`
          <div class='mensaje' id='mensaje-${mensaje.id}'>
              <p class='mensajetext mensajetext--user'>${mensaje.email} </p>
              <p class='mensajetext mensajetext--date'>[${mensaje.timestamp}]: </p>
              <p class='mensajetext mensajetext--message'>${mensaje.message} </p>
          </div>
      `)
  }).join(' ');
  document.getElementById('chat').innerHTML = html;
}

const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', cargarMensaje);


socket.on('messages', (data) => {
  renderMensajes(data)
})
// Obtener el div del footer
const footer = document.querySelector('footer');

// Crear un elemento canvas y agregarlo al div del footer
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
footer.querySelector('.minijuego').appendChild(canvas);

const ctx = canvas.getContext('2d');

// Posición inicial de la bola
let x = 50;
let y = 50;
const radius = 20;

function drawBall() {
  // Dibujar la bola
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2);
  ctx.fillStyle = 'red';
  ctx.fill();
}

let joystick = { x: 0, y: 0 };

canvas.addEventListener('mousemove', function(event) {
  // Actualizar la posición del joystick
  const rect = canvas.getBoundingClientRect();
  joystick.x = event.clientX - rect.left;
  joystick.y = event.clientY - rect.top;
});

function update() {
  // Calcular la distancia entre la bola y el joystick
  const dx = joystick.x - x;
  const dy = joystick.y - y;
  const distance = Math.sqrt(dx*dx + dy*dy);

  // Mover la bola hacia el joystick
  const speed = 5;
  if (distance > radius) {
    x += speed * dx / distance;
    y += speed * dy / distance;
  }
}

function gameLoop() {
  // Borrar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la bola
  drawBall();

  // Actualizar la posición de la bola
  update();

  // Volver a llamar al bucle de animación
  requestAnimationFrame(gameLoop);
}

// Iniciar el bucle de animación
gameLoop();
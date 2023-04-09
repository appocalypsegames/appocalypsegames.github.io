
// Crear un elemento canvas y agregarlo al div del footer
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = 50;
document.getElementById("minijuego").appendChild(canvas);

const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'images/ranapepe.jpg';
// Posición inicial de la bola
let x = 50;
let y = 50;
const radius = 50;
let text = 0;
function drawBall() {
  // Dibujar la bola
  ctx.drawImage(img, x, y, radius, img.height * (radius / img.width));
}

const SQUARE_SIZE = 10;
let xCuadrado = Math.random() * canvas.width-10;

// Calcular altura aleatoria para el cuadrado
let yCuadrado = Math.random() * canvas.height-10;
function pintarCuadrado() {
  // Dibujar cuadrado amarillo
  ctx.fillStyle = 'black';
  ctx.fillRect(xCuadrado, yCuadrado, SQUARE_SIZE, SQUARE_SIZE);
}

let joystick = { x: 0, y: 0 };

canvas.addEventListener('mousemove', function(event) {
  // Actualizar la posición del joystick
  const rect = canvas.getBoundingClientRect();
  joystick.x = event.clientX - rect.left;
  joystick.y = event.clientY - rect.top;
});

canvas.addEventListener('touchstart', function(event) {
  // Actualizar la posición del joystick
  const rect = canvas.getBoundingClientRect();
  joystick.x = event.touches[0].clientX - rect.left;
  joystick.y = event.touches[0].clientY - rect.top;

  // Marcar el joystick como presionado
  joystickPressed = true;
});

canvas.addEventListener('touchmove', function(event) {
  // Actualizar la posición del joystick
  const rect = canvas.getBoundingClientRect();
  joystick.x = event.touches[0].clientX - rect.left;
  joystick.y = event.touches[0].clientY - rect.top;
});

canvas.addEventListener('touchend', function(event) {
  // Marcar el joystick como no presionado
  joystickPressed = false;
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

  /*pintarCuadrado();
  if (x > xCuadrado - 5 && x < xCuadrado + 15 &&
	y > yCuadrado - 5 && y < yCuadrado + 15) {
	xCuadrado = Math.random() * canvas.width-10;

	// Calcular altura aleatoria para el cuadrado
	yCuadrado = Math.random() * canvas.height-10;
	text++;
  }
  
	// Configurar fuente y tamaño de letra
	ctx.font = '20px Arial';

	
	ctx.fillStyle = 'black';
	ctx.fillText(text, 10, 30);
	*/
  // Actualizar la posición de la bola
  update();

  // Volver a llamar al bucle de animación
  requestAnimationFrame(gameLoop);
}

img.onload = function() {
  gameLoop();
}

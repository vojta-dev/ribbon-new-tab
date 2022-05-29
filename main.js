const options = {
  waves: 3,
  width: 400,
  speed: [0.004, 0.008],
  rainbowSpeed: 0.5,
};

const waves = {
  waves: [],
  hue: Math.random() * 12,
  holder: document.querySelector('#holder'),
  canvas: document.createElement('canvas'),
};

waves.holder.appendChild(waves.canvas);
waves.ctx = waves.canvas.getContext('2d');

resize();
window.addEventListener('resize', resize);

function update() {
  waves.hue += 0.01;

  if (waves.hue > 360) {
    waves.hue = 360;
    waves.waves = false;
  }

  const color = (hue) => Math.floor(127 * Math.sin(options.rainbowSpeed * waves.hue + hue) + 128);
  waves.color = `rgba(${color(0)}, ${color(2)}, ${color(4)}, 0.1)`;

  waves.ctx.clearRect(0, 0, waves.width, waves.height);

  const gradient = waves.ctx.createLinearGradient(0, 0, 0, waves.height);
  gradient.addColorStop(0, 'black');
  gradient.addColorStop(1, waves.color);
  waves.ctx.fillStyle = gradient;

  waves.ctx.fillRect(0, 0, waves.width, waves.height);

  waves.waves.forEach((wave) => {
    wave.update();
    wave.draw();
  });

  window.requestAnimationFrame(update);
}

function resize() {
  waves.scale = window.devicePixelRatio || 1;
  waves.width = waves.holder.offsetWidth * waves.scale;
  waves.height = waves.holder.offsetHeight * waves.scale;
  waves.canvas.width = waves.width;
  waves.canvas.height = waves.height;
  waves.canvas.style.width = waves.holder.offsetWidth + 'px';
  waves.canvas.style.height = waves.holder.offsetHeight + 'px';
  waves.radius = Math.sqrt(waves.width * waves.width + waves.height * waves.height) / 2;
  waves.centerX = waves.width / 2;
  waves.centerY = waves.height / 2;
}

class Wave {
  constructor() {
    this.lines = [];
    this.angle = [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2];
    this.speed = [
      (options.speed[0] + Math.random() * (options.speed[1] - options.speed[0])) * (Math.random() > 0.5 ? 1 : -1),
      (options.speed[0] + Math.random() * (options.speed[1] - options.speed[0])) * (Math.random() > 0.5 ? 1 : -1),
      (options.speed[0] + Math.random() * (options.speed[1] - options.speed[0])) * (Math.random() > 0.5 ? 1 : -1),
      (options.speed[0] + Math.random() * (options.speed[1] - options.speed[0])) * (Math.random() > 0.5 ? 1 : -1),
    ];
  }

  update() {
    this.lines.push(new Line(this, waves.color));

    if (this.lines.length > options.width) this.lines.shift();
  }

  draw() {
    this.lines.forEach((line) => {
      waves.ctx.strokeStyle = line.color;
      waves.ctx.beginPath();
      waves.ctx.moveTo(
        waves.centerX - waves.radius * Math.cos(line.angle[0] * 0.3 + (Math.PI * 45) / 180),
        waves.centerY - waves.radius * Math.sin(line.angle[0] * 0.3 + (Math.PI * 45) / 180)
      );
      waves.ctx.bezierCurveTo(
        waves.centerX - (waves.radius / 3) * Math.cos(line.angle[1] * 0.3 * 2),
        waves.centerY - (waves.radius / 3) * Math.sin(line.angle[1] * 0.3 * 2),
        waves.centerX + (waves.radius / 3) * Math.cos(line.angle[2] * 0.3 * 2),
        waves.centerY + (waves.radius / 3) * Math.sin(line.angle[2] * 0.3 * 2),
        waves.centerX + waves.radius * Math.cos(line.angle[3] * 0.3 + (Math.PI * 45) / 180),
        waves.centerY + waves.radius * Math.sin(line.angle[3] * 0.3 + (Math.PI * 45) / 180)
      );
      waves.ctx.stroke();
    });
  }
}

class Line {
  constructor(wave, color) {
    this.angle = [
      Math.sin((wave.angle[0] += wave.speed[0])),
      Math.sin((wave.angle[1] += wave.speed[1])),
      Math.sin((wave.angle[2] += wave.speed[2])),
      Math.sin((wave.angle[3] += wave.speed[3])),
    ];
    this.color = color;
  }
}

for (let i = 0; i < options.waves; i++) waves.waves[i] = new Wave();

waves.waves.forEach((wave) => {
  for (let i = 0; i < options.width; i++) wave.update();
});

update();

document.body.style.opacity = '1';

let lastX, lastY;
let droplets = [];

function setup() {
  createCanvas(400, 400);
  background(220);
  noFill();
  lastX = lastY = 0;
}

function draw() {
  // Only draw if the mouse has moved
  if (lastX === 0 || lastY === 0) {
    lastX = mouseX;
    lastY = mouseY;
  } else if (mouseX !== lastX || mouseY !== lastY) {
    drawBrush(lastX, lastY, mouseX, mouseY);
    lastX = mouseX;
    lastY = mouseY;
  }
  
  // Update and draw droplets
  updateDroplets();
}

function drawBrush(x1, y1, x2, y2) {
  let bristleCount = 15;
  let bristleLength = 30;
  let brushWidth = 45;
  
  for (let i = 0; i < bristleCount; i++) {
    let t = i / (bristleCount - 1);
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    
    let angle = atan2(y2 - y1, x2 - x1);
    let perpendicular = angle + PI/2;
    
    for (let j = 0; j < 4; j++) {
      let bristleOffset = random(-brushWidth/2, brushWidth/2);
      let startX = x + cos(perpendicular) * bristleOffset;
      let startY = y + sin(perpendicular) * bristleOffset;
      
      let endX = startX + cos(angle) * bristleLength;
      let endY = startY + sin(angle) * bristleLength;
      
      stroke(0, 0, 0, random(15, 40));
      strokeWeight(random(8, 15));
      line(startX, startY, endX, endY);
      
      // Add paint droplets (reduced frequency)
      if (random() < 0.01) {
        droplets.push({
          x: endX,
          y: endY,
          size: random(2, 5),
          speed: random(0.1, 0.3),
          viscosity: random(0.97, 0.99),
          opacity: random(15, 40)
        });
      }
    }
  }
}

function updateDroplets() {
  for (let i = droplets.length - 1; i >= 0; i--) {
    let droplet = droplets[i];
    stroke(0, 0, 0, droplet.opacity);
    strokeWeight(droplet.size);
    
    let curve = sin(frameCount * 0.05 + droplet.x * 0.05) * 0.5;
    line(droplet.x, droplet.y, droplet.x + curve, droplet.y + droplet.speed);
    
    droplet.y += droplet.speed;
    droplet.x += curve * 0.01;
    
    droplet.speed *= droplet.viscosity;
    droplet.speed += 0.005 * (1 - droplet.viscosity);
    
    // Gradually reduce size and opacity
    droplet.size *= 0.995;
    droplet.opacity *= 0.995;
    
    if (droplet.y > height || droplet.speed < 0.01 || droplet.size < 0.5 || droplet.opacity < 5) {
      droplets.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    background(220);
    droplets = [];
  }
}
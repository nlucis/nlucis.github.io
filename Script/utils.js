// Utility for cleanly separating drawing "layers"
Illustrate = (drawingInstructions = () => {}) => {
  push();
  drawingInstructions();
  pop();
}

// Utility for creating a radial gradient
function radialGradient (toColor, fromColor, coords = {x: xCenter, y: yCenter}, stepRadius, bands) {
  colorMode(RGB);
  stroke(255);

  let lerpRate = 1 / bands; // To get the decimal step percentage from 0% to 100% per band.
  let lerpPhase = lerpRate; //  Start at the first

  let relRadii = bands * stepRadius; //  starts at full radius
  
  for (let bandNumber = bands; bandNumber >= 1; bandNumber--) {
    let fillColor = bandNumber === bands ? fromColor // if its the first band, use the from color
      :
      bandNumber === 1 ? toColor             //  if its the last band, use the to color
      :
      lerpColor(fromColor, toColor, lerpPhase);           // otherwise interpolate color by phase
 
      fill(fillColor); // Get the color value object
      ellipse(coords.x, coords.y, relRadii, relRadii);

    lerpPhase = lerpPhase + lerpRate;
    relRadii = relRadii - stepRadius; // reduce by 1 step
  }
}

// Applies post-processing effects & filters
function applyPostProcess() {
  const finalImage = new Image();

  container.appendChild(postProcessLayer);

  // Slow down the request using the cache buster to ensure the video has time to stop (this is a hack)
  finalImage.src = p5Canvas.toDataURL();
  finalImage.onload = () => {
    // ppContext.canvas.width = image.naturalWidth;
    // ppContext.canvas.height = image.naturalHeight;
    ppContext.drawImage(finalImage, 0, 0);
    const imageData = ppContext.getImageData(0, 0, ppContext.canvas.width, ppContext.canvas.height);
    const data = imageData.data; // RGBA
    for (let i = chromaticAberrationPhase % 4; i < data.length; i += 4) {
      // Setting the start of the loop to a different integer will change the aberration color, but a start integer of 4n-1 will not work
      data[i] = data[i + 4 * chromaticAberrationStrength];
    }
    ppContext.putImageData(imageData, 0, 0);
  };
}

// Draws a ringlyph
function drawGlyph(xPos, yPos, radius) {
  push();
  // draw the component border
  circle(xPos, yPos, radius / 2);
  
  // create the pin point nodes
  let currentAngle = degrees(0);
  translate(xPos, yPos);
  
  // anode select
  let anodes = [];
  
  for (let pinNumber = 1; pinNumber <= 6; pinNumber++) {
    let x = (radius / 2) * sin(currentAngle);
    let y = (radius / 2) * cos(currentAngle);
    anodes.push([x, y]);
    currentAngle += step;
  }
  let anodeCoords = anodes[round(random(0, anodes.length-1))];
  line(anodeCoords[0], anodeCoords[1], anodeCoords[0] + ((radius / 2) * sin(currentAngle)), anodeCoords[1] - ((radius / 2) * cos(currentAngle)));
  
  // cathode select
  let cathodes = [];
  
  for (let pinNumber = 1; pinNumber <= stepFactor / 2; pinNumber++) {
    let x = (radius - (radius / 4)) * sin(currentAngle);
    let y = (radius - (radius / 4)) * cos(currentAngle);
    cathodes.push([x, y]);
    currentAngle += step;
  }
  
  fill(0);
  let cathodeCoords = cathodes[round(random(0, cathodes.length-1))];
  circle(cathodeCoords[0], cathodeCoords[1], radius / 6);
  pop();

  return [anodeCoords, cathodeCoords];
}
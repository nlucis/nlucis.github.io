class Spirograph {
  // The object for managing spirographic illustrations
  constructor(coordinates = {x: width / 2, y: height / 2}, radius, ratio, percentage, stroke = [0, 0, 0], strokeWeight = 1) {

    this.sineQuantity = 2;
    this.sines = new Array(this.sineQuantity);
    this.cycleRate = 3;

    // These can be changed on a per-instance basis
    this.cRadius = radius ? radius : 32;
    this.ratio = ratio ? ratio : 1.44;
    this.location = coordinates;
    this.innerRadiusPercentage = percentage ? percentage : 1;
    this.strokeColor = stroke;
    this.strokeSize = strokeWeight;

    for (let i = 0; i < this.sines.length; i++) {
      this.sines[i] = PI; // start EVERYBODY facing NORTH
    }
  }

  sineQuantity;              // how many of these things can we do at once?
  sines;                     // an array to hold all the current angles
  cRadius;                   // an initial radius value for the central sine
  cycleRate;                 // the speed of the central sine
  ratio;                     // what multiplier for speed is each additional sine?
  location = {x: -1, y: -1}; // The centerpoint of the Spirograph
  innerRadiusPercentage;
  strokeSize;
  strokeColor;

  generate() {
    push(); // start a transformation matrix
    stroke(this.strokeColor[0], this.strokeColor[1], this.strokeColor[2]);
    strokeWeight(this.strokeSize);
    translate(this.location.x, this.location.y); // move to location
    
    for (let i = 0; i < this.sines.length; i++) {
      let erad = 0.5; // radius for small "point" within circle... this is the 'pen' when tracing
      
      // setup for tracing
      erad = (0.25 - float(i) / this.sines.length); // pen width will be related to which sine
      let radius = this.cRadius / (i + this.innerRadiusPercentage); // radius for circle itself - the torus inner diameter
      rotate(this.sines[i]); // rotate circle
      
      push(); // go up one level
      translate(0, radius); // move to sine edge

      // draw every sine except the first since its just a ring
      if (i > 0) {
        ellipse(0, 0, erad, erad);
      }
      
      pop(); // go down one level
      translate(0, radius); // move into position for next sine
      this.sines[i] = (this.sines[i] + (this.cycleRate + (this.cycleRate * i * this.ratio))) % TWO_PI; // update angle based on fundamental
    }
    pop();
  pop(); // pop down final transformations
  } // Draw next frame when called again...
}


class Ankh {
  constructor(locationX, locationY) {
    strokeWeight(4);
    fill(0);
    stroke(255);

    let rayLength = 6;

    // Draw the left ray
    line(locationX, locationY, locationX - rayLength, locationY);

    // Draw the right ray
    line(locationX, locationY, locationX + rayLength, locationY);

    // Draw the base
    line(locationX, locationY, locationX, locationY + (rayLength * 2));

    // Draw the ellipse
    noFill();
    ellipse(locationX, locationY - rayLength, rayLength, rayLength * 2);
  }
}
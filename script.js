// script.js

var volumeValue = 1;

speechSynthesis.addEventListener('voiceschanged', function() {
  let selector = document.getElementById('voice-selection');
  selector.disabled = false;

  let voice = speechSynthesis.getVoices();

  selector.remove(voice[0]);

  for(let i = 0; i < voice.length; i++) {
    var option = document.createElement('option');
    option.textContent = voice[i].name + '(' + voice[i].lang + ')';

    if(voice[i].default) {
      option.textContent += '--DEFAULT';
    }

    option.setAttribute('data-lang', voice[i].lang);
    option.setAttribute('data-name', voice[i].name);
    selector.appendChild(option);
  }
});

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  let elem = document.getElementById('user-image');
  let ctx = elem.getContext('2d');
  ctx.clearRect(0, 0, 400, 400);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 400, 400);

  let obj = getDimmensions(400, 400, img.width, img.height);

  ctx.drawImage(img, obj.startX, obj.startY, obj.width, obj.height);

  document.querySelector("button[type='submit']").disabled = false;
  document.querySelector("button[type='reset']").disabled = true;
  document.querySelector("button[type='button']").disabled = true;

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const changeImg = document.getElementById('image-input');
changeImg.addEventListener('change', () =>{
  let sorc = changeImg.files[0];
  let imgURL = URL.createObjectURL(sorc);
  img.src = imgURL;

  var filename = url.substring(imgURL);
  img.alt = filename;
});

const submitInput = document.getElementById("generate-meme");
submitInput.addEventListener('submit', event =>{
  let elem = document.getElementById('user-image');
  let ctx = elem.getContext('2d');
  
  let top = document.getElementById('text-top');
  let bot = document.getElementById('text-bottom');

  ctx.fillStyle = 'white';
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.font = 'bold 25px serif';
  ctx.fillText(top.value, 200, 10);

  ctx.fillStyle = 'white';
  ctx.textBaseline = "bottom";
  ctx.textAlign = "center";
  ctx.font = 'bold 25px serif';
  ctx.fillText(bot.value, 200, 390);

  document.querySelector("button[type='submit']").disabled = true;
  document.querySelector("button[type='reset']").disabled = false;
  document.querySelector("button[type='button']").disabled = false;
  
  event.preventDefault();
});

const buttonClear = document.querySelector("button[type='reset']");
buttonClear.addEventListener('click', () => {
  let elem = document.getElementById('user-image');
  let ctx = elem.getContext('2d');
  ctx.clearRect(0, 0, 400, 400);

  document.querySelector("button[type='submit']").disabled = false;
  document.querySelector("button[type='reset']").disabled = true;
  document.querySelector("button[type='button']").disabled = true;
});

const readText = document.querySelector("button[type='button']");
readText.addEventListener('click', () => {
  let selector = document.getElementById('voice-selection');
  let voice = speechSynthesis.getVoices();
  let top = document.getElementById('text-top');
  let bot = document.getElementById('text-bottom');

  let topSpeak = new SpeechSynthesisUtterance(top.value);
  let botSpeak = new SpeechSynthesisUtterance(bot.value);

  let selected = selector.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voice.length; i++){
    if(voice[i].name == selected){
      topSpeak.voice = voice[i];
      botSpeak.voice = voice[i];
    }
  }

  topSpeak.volume = volumeValue;
  botSpeak.volume = volumeValue;

  speechSynthesis.speak(topSpeak);
  speechSynthesis.speak(botSpeak);

});

const volumeSlider = document.getElementById("volume-group");
volumeSlider.addEventListener('input', () => {
  let vol = document.querySelector("input[type='range']").value;
  volumeValue = vol / 100;

  let pic = document.querySelector("img");

  if(vol >= 67){
    pic.src = "icons/volume-level-3.svg";
  }
  else if (vol <= 66 && vol >= 34) {
    pic.src = "icons/volume-level-2.svg";
  } 
  else if (vol <= 33 && vol >= 1){
    pic.src = "icons/volume-level-1.svg";
  }
  else {
    pic.src = "icons/volume-level-0.svg";
  }

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

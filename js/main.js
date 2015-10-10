document.addEventListener("DOMContentLoaded", function() {


var contextA; 
window.addEventListener('load', init, false); 
function init() { 
    try { 
        window.AudioContext = window.AudioContext || 
                        window.webkitAudioContext; 
        contextA = new AudioContext(); 
        loadSound();
    } catch(e) { 
        //alert('Web Audio API is not supported in this browser'); 
    } 
} 

var soundBuffer;

function loadSound() {
  var request = new XMLHttpRequest();
  request.open('GET', './sounds/duck.mp3', true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
      contextA.decodeAudioData(request.response, function(buffer)  {
        soundBuffer = buffer;

      }, request.onError);
  }
  request.send();
}

function playSound(buffer, keyNum) {
  // creates a sound source
  var source = contextA.createBufferSource(); 

  // tell the source which sound to play
  source.buffer = buffer;               

  // connect the source to the context's destination (the speakers)     
  source.connect(contextA.destination);       
  source.playbackRate.value = 0.2263*Math.exp(0.1205*keyNum)
  // play the source now
  source.start(0);                     
}


var elem = document.getElementById('myCanvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];

    base_image = new Image();
    base_image.src = './images/pelican.png';
    context.drawImage(base_image, 0, 0);
    renderKeys();
// Add event listener for `click` events.
elem.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    console.log(x, y);
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
            //alert('clicked an element');

            playSound(soundBuffer, element.keyNum);
        }
    });

}, false);



function renderKeys() {

i = 1;
while (i < 25){
// Add element.
elements.push({
    colour: '#05EFFF',
    width: 38.2,
    height: 300,
    top: 0,
    left: ((i-1)*38.2)+5,
    keyNum: i
});
i++;
}

// Render elements.
elements.forEach(function(element) {
    context.fillStyle = element.colour;
    context.rect(element.left, element.top, element.width, element.height);
    context.stroke();
});

}


});
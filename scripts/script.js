const FREQUENCY = 1000;

var DOT_TIME = 60;
var DASH_TIME = DOT_TIME * 3;
var SYMBOL_BREAK = DOT_TIME * 0.8;
var LETTER_BREAK = DOT_TIME * 2;
var WORD_BREAK = LETTER_BREAK * 2.5;

let note_context;
let note_node;
let gain_node;
let audioContextInitialized = false;
let currentWord = '';
let started = false;
let container = document.getElementById("container");
let isPlayingSound = false;

function initializeAudioContext() {
  note_context = new AudioContext();
  note_context.resume();
  note_node = note_context.createOscillator();
  gain_node = note_context.createGain();
  note_node.frequency.value = FREQUENCY.toFixed(2);
  gain_node.gain.value = 0;
  note_node.connect(gain_node);
  gain_node.connect(note_context.destination);
  note_node.start();
  audioContextInitialized = true;
}

function startNotePlaying() {
  if (!audioContextInitialized) {   
    initializeAudioContext();    
  }
  gain_node.gain.setTargetAtTime(0.1, 0, 0.001);
}

function stopNotePlaying() {
  gain_node.gain.setTargetAtTime(0, 0, 0.001);
}

function restart() {
  let morse = document.getElementById('morse');
  let randomWord = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
  let morseWord = translateToMorse(randomWord);
  currentWord = randomWord;
  morse.innerText = morseWord;
  playWord(morseWord);
}

function replay() {
  playWord(translateToMorse(currentWord));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playTone(duration) {  
  startNotePlaying();
  await sleep(duration);
  stopNotePlaying();
}

async function playLetter(letter) {
  if (!audioContextInitialized) {
    initializeAudioContext();
  }
  for (let i = 0; i < letter.length; i++) {    
    if (letter[i] == '-') {
      await playTone(DASH_TIME);
    } else if (letter[i] == '.') {
      await playTone(DOT_TIME);
    }
    await sleep(SYMBOL_BREAK);
  }
}

async function playWord(word) {
  for (let i = 0; i < word.length; i++) {    
    await playLetter(word[i]);
    await sleep(LETTER_BREAK);
  }
}

async function playSentence(sentence) {  
  await sleep(LETTER_BREAK);
  for (let i = 0; i < sentence.length; i++) {    
    await playWord(sentence[i]);
    await sleep(WORD_BREAK);
  }
}

let currentAnswer = '';
// const button = document.getElementById('button');
// button.addEventListener('mousedown', restart);
// signalButton.addEventListener('mouseup', stopNotePlaying);
document.addEventListener('keydown', (event) => {
  let textInput = document.getElementById('text-input');
  let key = event.key.toLowerCase();
  let text = textInput.innerText;
  switch(key) {
    case 'backspace':
      currentAnswer = currentAnswer.slice(0, text.length - 1);
      textInput.innerText = currentAnswer;
      break;
    case 'enter':
      if(!started) {
        started = true
        restart()
      }
      else if(currentAnswer == currentWord) {
        currentAnswer = '';
        textInput.innerText = '';
        restart()
      } else {
        replay();
      }
      break;
    default:
      if(key.length == 1 && currentAnswer.length < currentWord.length) {
        // if(typeof keyToMorseChar[key] !== 'undefined') {
        //   key = keyToMorseChar[key];
        // }
        currentAnswer += key;
        textInput.innerText = currentAnswer;
      }
  }
})

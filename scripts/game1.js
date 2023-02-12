class Game1 {

    currentTask = ''
    currentMorseCode = ''
    currentAnswer = ''

    constructor(firstField, secondField, audio, translator) {
        this.firstField = firstField
        this.secondField = secondField
        this.audio = audio
        this.translator = translator
    }

    start() {        
        let randomWord = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)]
        let morseWord = this.translator.translateToMorse(randomWord)
        this.currentTask = randomWord
        this.currentMorseCode = morseWord
        this.firstField.innerText = morseWord
        this.audio.playSentence(morseWord)
    }

    replay() {
        this.audio.isPlaying = true
        this.audio.playSentence(this.currentMorseCode)
    }

    stop() {
        
    }

    keyboardHandler(event) {                
        let key = event.key.toLowerCase() 
        let text = this.secondField.innerText
        switch(key) {
            case 'backspace':
                this.currentAnswer = this.currentAnswer.slice(0, text.length - 1)
                this.secondField.innerText = this.currentAnswer
                break
            case 'enter':
                if(!this.started) {
                    this.started = true
                    this.start()
                }
                else if(this.currentAnswer == this.currentTask) {
                    this.currentAnswer = ''
                    this.secondField.innerText = ''
                    this.start()
                } else {
                    this.replay()
                }
                break
            default:
                if(key.length == 1) {
                // if(key.length == 1 && this.currentAnswer.length < this.currentTask.length) {
                    // if(typeof keyToMorseChar[key] !== 'undefined') {
                    //   key = keyToMorseChar[key]
                    // }
                    this.currentAnswer += key
                    this.secondField.innerText = this.currentAnswer
                }
        }          
    }
}
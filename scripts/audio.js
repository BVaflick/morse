class MorseAudioPlayer {

    FREQUENCY = 1000
    DOT_TIME = 60;
    DASH_TIME = this.DOT_TIME * 3
    SYMBOL_BREAK = this.DOT_TIME * 0.8
    LETTER_BREAK = this.DOT_TIME * 2
    WORD_BREAK = this.LETTER_BREAK * 2.5
    isPlaying = false

    initializeAudioContext() {
        this.note_context = new AudioContext()
        this.note_node = this.note_context.createOscillator()
        this.gain_node = this.note_context.createGain()
        this.note_node.frequency.value = this.FREQUENCY.toFixed(2)
        this.gain_node.gain.value = 0
        this.note_node.connect(this.gain_node)
        this.gain_node.connect(this.note_context.destination)
        this.note_node.start()
        this.audioContextInitialized = true
    }

    startNotePlaying() {
        if (!this.audioContextInitialized) {
            this.initializeAudioContext();
        }
        this.gain_node.gain.setTargetAtTime(0.1, 0, 0.001)
    }

    stopNotePlaying() {
        this.gain_node.gain.setTargetAtTime(0, 0, 0.001)
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
  
    async playTone(duration) {      
        this.startNotePlaying();
        await this.sleep(duration);
        this.stopNotePlaying();
    }

    async playLetter(letter) {
        for (let i = 0; i < letter.length; i++) {   
            if(this.isPlaying) {
                this.isPlaying = false
                this.stopNotePlaying()
                return
            } 
            if (letter[i] == '-') {
                await this.playTone(this.DASH_TIME);
            } else if (letter[i] == '.') {
                await this.playTone(this.DOT_TIME);
            }
            await this.sleep(this.SYMBOL_BREAK);
        }
    }

    async playWord(word) {
        for (let i = 0; i < word.length; i++) {    
            if(this.isPlaying) {
                this.isPlaying = false
                this.stopNotePlaying()
                return
            }
            await this.playLetter(word[i]);
            await this.sleep(this.LETTER_BREAK);
        }
    }

    async playSentence(sentence) {  
        let words = sentence.split(' ');
        await this.sleep(this.WORD_BREAK);
        for (let i = 0; i < words.length; i++) {
            if(this.isPlaying) {
                this.isPlaying = false
                this.stopNotePlaying()
                return
            }
            await this.playWord(words[i]);
            await this.sleep(this.WORD_BREAK);
        }
    }
}
class MorseAudioPlayer {

    FREQUENCY = 1000    
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
  
    async playMorseSymbol(duration) {      
        this.startNotePlaying();
        await this.sleep(duration);
        this.stopNotePlaying();
    }
}
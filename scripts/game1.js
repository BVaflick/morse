class Game1 {

    currentTask = ''
    currentMorseCode = ''
    currentAnswer = ''
    
    /*
    * EASY  =>  чтение (очень лёгкие слова (до 2 букв включительно), состоящие из букв, закодированых не более 3 символами 
                аудирование - 1 буква, не более 2 символов на букву 
                выбор ответа
    * MEDIUM => чтение (легкие слова) + ввод ответа
    *           аудирование (легкие слова) + выбор ответа
    * HARD  =>  аудирование (предложения из легких слов) + ввод ответа
    *           фонарь (легкие слова) + выбор ответа
    * HELL  =>  аудирование (любое предложение) + ввод ответа
    *           фонарик (любое предложение) + ввод ответа 
    * 
    */

    constructor(firstField, secondField, audio, translator) {
        this.firstField = firstField
        this.secondField = secondField
        this.audio = audio
        this.translator = translator
    }

    start() {        
        let randomWord = EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)]
        let morseWord = this.translator.translateToMorse(randomWord)
        this.currentTask = randomWord
        this.currentMorseCode = morseWord       
        
        this.mode = Math.floor(Math.random() * 2)
        // this.mode = 1
        let container = document.getElementById('container')
        switch(this.mode) {
            case 0:
                console.log(randomWord, "режим: аудио + выбор") 
                container.style.backgroundColor = '#64AAAA'
                this.playSentence(morseWord, false)                
                this.showAnswers()                
                break 
            case 1:
                console.log(randomWord, "режим: аудио + ввод")
                container.style.backgroundColor = '#9664AA'
                this.secondField.innerText = "_".repeat(randomWord.length)
                this.playSentence(morseWord, false)                
                break
            case 2:
                console.log(randomWord, "режим: чтение + выбор")
                container.style.backgroundColor = '#AA6464'
                this.firstField.innerText = morseWord
                this.showAnswers()                
                break
            case 3:
                console.log(randomWord, "режим: мерцание")
                container.style.backgroundColor = '#64AA64'
                this.secondField.innerText = "_".repeat(randomWord.length)
                this.playSentence(morseWord, true)
                break
        }
        // this.playSentence(morseWord)
    }

    async blink(duration) {
        let color = this.firstField.style.backgroundColor
        this.firstField.style.backgroundColor = 'black'
        await this.sleep(duration * 2);
        this.firstField.style.backgroundColor = color
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    replay() {
        this.audio.isPlaying = true
        this.playSentence(this.currentMorseCode)
    }

    stop() {
        
    }   

    async playLetter(letter, blink) {
        for (let i = 0; i < letter.length; i++) {              
            if (letter[i] == '-') {
                if(blink) await this.blink(DASH_TIME)
                else await this.audio.playMorseSymbol(DASH_TIME);
            } else if (letter[i] == '.') {
                if(blink) await this.blink(DOT_TIME)
                else await this.audio.playMorseSymbol(DOT_TIME);
            }
            await this.sleep(SYMBOL_BREAK);
        }
    }

    async playWord(word, blink) {
        for (let i = 0; i < word.length; i++) {    
            await this.playLetter(word[i], blink);
            await this.sleep(LETTER_BREAK);
        }
    }

    async playSentence(sentence, blink) {
        let words = sentence.split(' ');
        await this.sleep(WORD_BREAK);
        for (let i = 0; i < words.length; i++) {            
            await this.playWord(words[i], blink);
            await this.sleep(WORD_BREAK);
        }
    }

    shuffle(arr) {
        // from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array#6274398
        let counter = arr.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
    
            // Decrease counter by 1
            counter--;
    
            // And swap the last element with it
            let temp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = temp;
        }
    
        return arr;
    };

    showAnswers() {
        let answers = EASY_WORDS.filter(word => word.length == this.currentTask.length);
        let buttons = [document.createElement("button"), document.createElement("button"), document.createElement("button"), document.createElement("button")]        
        buttons[0].innerHTML = this.currentTask
        buttons[1].innerHTML = answers[Math.floor(Math.random() * answers.length)]
        buttons[2].innerHTML = answers[Math.floor(Math.random() * answers.length)]
        buttons[3].innerHTML = answers[Math.floor(Math.random() * answers.length)]
        buttons = this.shuffle(buttons)
        buttons.forEach(b => {
            b.onclick = () => {
                if(b.textContent == this.currentTask){
                    this.currentAnswer = ''
                    this.secondField.innerText = ''
                    this.firstField.innerText = ''
                    this.start()
                }
            }
            this.secondField.appendChild(b)
        }) 
    }

    keyboardHandler(event) {                
        let key = event.key.toLowerCase() 
        let text = this.secondField.innerText
        switch(key) {
            case 'backspace':
                console.log(this.currentAnswer)
                this.currentAnswer = this.currentAnswer.slice(0, this.currentAnswer.length - 1)
                console.log(this.currentAnswer)
                this.secondField.innerText = this.currentAnswer + "_".repeat(this.currentTask.length - this.currentAnswer.length)
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
                    if(this.mode==3) this.playSentence(this.currentMorseCode, true)
                    else if(this.mode==1 || this.mode==0) this.playSentence(this.currentMorseCode, false)
                }
                break
            default:
                if(key.length == 1) {
                // if(key.length == 1 && this.currentAnswer.length < this.currentTask.length) {
                    // if(typeof keyToMorseChar[key] !== 'undefined') {
                    //   key = keyToMorseChar[key]
                    // }
                    if(this.currentAnswer.length != this.currentTask.length) {
                        this.currentAnswer += key
                        this.secondField.innerText = this.currentAnswer + "_".repeat(this.currentTask.length - this.currentAnswer.length)
                    }
                }
        }          
    }
}
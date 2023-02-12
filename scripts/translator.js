class Translator {    
    translateToMorse(word) {
        return Array.from(word).map(l => MORSE_MAP[l]).join(' ');
    }

    translateFromMorse(morseWord) {
        return morseWord.split(' ').map(l => Object.keys(MORSE_MAP).find(key => MORSE_MAP[key] === l)).join('')
    }
}
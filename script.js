const hiragana = [
    "あいうえお", "かきくけこ", "さしすせそ", "たちつてと", "なにぬねの",
    "はひふへほ", "まみむめも", "やゆよ", "らりるれろ", "わをん"
];
const symbols = [
    "@#/&_","DoKtg", "AjTpM", "sGhVz", "NndxU",
    "iLwvb", "JufkC", "Rqr", "BESeF", "%+<"
];

function autoTransform() {
    const inputText = document.getElementById('inputText').value;
    let shiftValue = document.getElementById('shiftValue').value;
    
    if (!shiftValue) {
        shiftValue = 0;
    }

    const shift = parseInt(shiftValue, 10);
    let result;
    
    if (isHiragana(inputText)) {
        result = encrypt(inputText, shift);
    } else if (isEncrypted(inputText)) {
        result = decrypt(inputText, shift);
    } else {
        result = "Error: 変換できません";
    }
    
    hackerEffect(result);
}

function isHiragana(text) {
    return /^[\u3040-\u309F]+$/.test(text);
}

function isEncrypted(text) {
    return /^[\w@#/&_+%-<>=]+.\d+$/.test(text);
}

function encrypt(text, shift) {
    let encryptedText = '';
    for (let char of text) {
        for (let i = 0; i < hiragana.length; i++) {
            let index = hiragana[i].indexOf(char);
            if (index !== -1) {
                let shiftedIndex = (index + shift) % hiragana[i].length;
                if (shiftedIndex < 0) shiftedIndex += hiragana[i].length;
                encryptedText += symbols[i][shiftedIndex];
                break;
            }
        }
    }
    return `${encryptedText}.${shift}`;
}

function decrypt(text, shift) {
    let [encryptedText, shiftValue] = text.split('.');
    shiftValue = parseInt(shiftValue, 10);
    let decryptedText = '';
    for (let char of encryptedText) {
        for (let i = 0; i < symbols.length; i++) {
            let index = symbols[i].indexOf(char);
            if (index !== -1) {
                let shiftedIndex = (index - shiftValue) % symbols[i].length;
                if (shiftedIndex < 0) shiftedIndex += symbols[i].length;
                decryptedText += hiragana[i][shiftedIndex];
                break;
            }
        }
    }
    return decryptedText;
}

function hackerEffect(finalText) {
    const resultElement = document.getElementById('result');
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#/&_+%-<>=';
    let iterations = 10;
    let interval = 30; // milliseconds
    let displayText = finalText.split('');
    let randomText = displayText.map(() => characters.charAt(Math.floor(Math.random() * characters.length)));
    
    let currentIteration = 0;

    let intervalId = setInterval(() => {
        randomText = randomText.map((char, index) => {
            if (currentIteration >= iterations || char === displayText[index]) {
                return displayText[index];
            } else {
                return characters.charAt(Math.floor(Math.random() * characters.length));
            }
        });

        resultElement.innerText = randomText.join('');

        if (currentIteration >= iterations) {
            clearInterval(intervalId);
            resultElement.innerText = finalText;
        }

        currentIteration++;
    }, interval);
}

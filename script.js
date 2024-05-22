const hiragana = [
    "あいうえお", "かきくけこ", "さしすせそ", "たちつてと", "なにぬねの",
    "はひふへほ", "まみむめも", "やゆよ", "らりるれろ", "わをん"
];
const symbols = [
    "@#/&_","DoKtg", "AjTpM", "sGhVz", "NndxU",
    "iLwvb", "JufkC", "Rqr", "BESeF", "%+<"
];
const dakutenMap = {
    'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
    'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
    'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
    'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ'
};
const handakutenMap = {
    'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ'
};

function performOperation() {
    const inputText = document.getElementById('inputText').value;
    const shiftValue = parseInt(document.getElementById('shiftValue').value, 10);
    const operation = document.getElementById('operation').value;
    const result = operation === 'encrypt' ? encrypt(inputText, shiftValue) : decrypt(inputText, shiftValue);
    document.getElementById('result').innerText = result;
}

function encrypt(text, shift) {
    let encryptedText = '';
    for (let char of text) {
        if (dakutenMap[char]) {
            char = dakutenMap[char];
            encryptedText += appendMark(encryptCharacter(char, shift), 5);
        } else if (handakutenMap[char]) {
            char = handakutenMap[char];
            encryptedText += appendMark(encryptCharacter(char, shift), 8);
        } else {
            encryptedText += encryptCharacter(char, shift);
        }
    }
    return `${encryptedText}.${shift}`;
}

function encryptCharacter(char, shift) {
    for (let i = 0; i < hiragana.length; i++) {
        let index = hiragana[i].indexOf(char);
        if (index !== -1) {
            let shiftedIndex = (index + shift) % symbols[i].length;
            return symbols[i][shiftedIndex];
        }
    }
    return char;
}

function decrypt(text, shift) {
    let [encryptedText, shiftValue] = text.split('.');
    shiftValue = parseInt(shiftValue, 10);
    let decryptedText = '';
    let skip = 0;
    for (let i = 0; i < encryptedText.length; i++) {
        if (skip > 0) {
            skip--;
            continue;
        }
        let char = encryptedText[i];
        if (char === '<') {
            decryptedText += removeMark(decryptCharacter(encryptedText.substr(i - 1, 1), shiftValue));
            skip = 1;
        } else {
            decryptedText += decryptCharacter(char, shiftValue);
        }
    }
    return decryptedText;
}

function decryptCharacter(char, shift) {
    for (let i = 0; i < symbols.length; i++) {
        let index = symbols[i].indexOf(char);
        if (index !== -1) {
            let shiftedIndex = (index - shift + symbols[i].length) % symbols[i].length;
            return hiragana[i][shiftedIndex];
        }
    }
    return char;
}

function appendMark(char, mark) {
    return `${char}<${mark}`;
}

function removeMark(char) {
    return char.replace(/<\d+/, '');
}

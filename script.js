const hiragana = [
    "あいうえお", "かきくけこ", "さしすせそ", "たちつてと", "なにぬねの",
    "はひふへほ", "まみむめも", "やゆよ", "らりるれろ", "わをん"
];
const symbols = [
    "@#/&_","DoKtg", "AjTpM", "sGhVz", "NndxU",
    "iLwvb", "JufkC", "Rqr", "BESeF", "%+<"
];

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
        for (let i = 0; i < hiragana.length; i++) {
            let index = hiragana[i].indexOf(char);
            if (index !== -1) {
                let shiftedIndex = (index + shift) % symbols[i].length;
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
                let shiftedIndex = (index - shiftValue + symbols[i].length) % symbols[i].length;
                decryptedText += hiragana[i][shiftedIndex];
                break;
            }
        }
    }
    return decryptedText;
}

const hiragana = [
    "あいうえお", "かきくけこ", "さしすせそ", "たちつてと", "なにぬねの",
    "はひふへほ", "まみむめも", "やゆよ", "らりるれろ", "わをん", "ー、。！？"
];
const symbols = [
    "@#/&_","DoKtg", "AjTpM", "sGhVz", "NndxU",
    "iLwvb", "JufkC", "Rqr", "BESeF", "%+<", "[:\\=|"
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
const smallMap = {
    'あ': 'ぁ', 'い': 'ぃ', 'う': 'ぅ', 'え': 'ぇ', 'お': 'ぉ',
    'つ': 'っ', 'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ', 'わ': 'ゎ'
};

const reverseDakutenMap = Object.fromEntries(Object.entries(dakutenMap).map(([k, v]) => [v, k]));
const reverseHandakutenMap = Object.fromEntries(Object.entries(handakutenMap).map(([k, v]) => [v, k]));
const reverseSmallMap = Object.fromEntries(Object.entries(smallMap).map(([k, v]) => [v, k]));

let randomSeedEnabled = false;
const randomSeedButton = document.getElementById('randomSeed');

randomSeedButton.addEventListener('click', () => {
    randomSeedEnabled = !randomSeedEnabled;
    randomSeedButton.classList.toggle('button-on', randomSeedEnabled);
    randomSeedButton.classList.toggle('button-off', !randomSeedEnabled);
    if (randomSeedEnabled) {
        setRandomSeed();
    }
});

document.getElementById('inputText').addEventListener('input', () => {
    if (randomSeedEnabled) {
        setRandomSeed();
    }
    autoTransform();
});

function setRandomSeed() {
    const randomSeed = Math.floor(Math.random() * 10);
    animateSeedChange(randomSeed);
}

function animateSeedChange(finalSeed) {
    const seedInput = document.getElementById('shiftValue');
    let iterations = 10;
    let interval = 40; // milliseconds
    let currentIteration = 0;

    let intervalId = setInterval(() => {
        const randomSeed = Math.floor(Math.random() * 10);
        seedInput.value = randomSeed;

        if (currentIteration >= iterations) {
            clearInterval(intervalId);
            seedInput.value = finalSeed;
            autoTransform(); // シードが最終的に確定したら再変換
        }

        currentIteration++;
    }, interval);
}

function autoTransform() {
    const inputText = document.getElementById('inputText').value;
    let shiftValue = document.getElementById('shiftValue').value;

    if (!shiftValue) {
        shiftValue = 0;
    }

    const shift = parseInt(shiftValue, 10);
    let result;

    if (isHiragana(inputText)) {
        result = postProcessEncrypt(encrypt(inputText, shift));
    } else if (isEncrypted(inputText)) {
        result = decrypt(preProcessDecrypt(inputText), shift);
    } else {
        result = "Error: 変換できません";
    }

    hackerEffect(result);
}

function isHiragana(text) {
    return /^[\u3040-\u309Fー、。！？]+$/.test(text);
}

function isEncrypted(text) {
    return /^[\w@#/&_+%-<>=\[\]:\\|]+\.\d+$/.test(text);
}

function encrypt(text, shift) {
    let encryptedText = '';
    for (let char of text) {
        let mark = '';
        if (reverseDakutenMap[char]) {
            mark = '5';
            char = reverseDakutenMap[char];
        } else if (reverseHandakutenMap[char]) {
            mark = '8';
            char = reverseHandakutenMap[char];
        } else if (reverseSmallMap[char]) {
            mark = '6';
            char = reverseSmallMap[char];
        }
        for (let i = 0; i < hiragana.length; i++) {
            let index = hiragana[i].indexOf(char);
            if (index !== -1) {
                let shiftedIndex = (index + shift) % hiragana[i].length;
                if (shiftedIndex < 0) shiftedIndex += hiragana[i].length;
                encryptedText += symbols[i][shiftedIndex] + mark;
                break;
            }
        }
    }
    return `${encryptedText}.${shift}`;
}

function postProcessEncrypt(text) {
    return text;
}

function preProcessDecrypt(text) {
    return text;
}

function decrypt(text, shift) {
    let [encryptedText, shiftValue] = text.split('.');
    shiftValue = parseInt(shiftValue, 10);
    let decryptedText = '';
    for (let i = 0; i < encryptedText.length; i++) {
        let char = encryptedText[i];
        let mark = '';
        if (i + 1 < encryptedText.length && (encryptedText[i + 1] === '5' || encryptedText[i + 1] === '8' || encryptedText[i + 1] === '6')) {
            mark = encryptedText[i + 1];
            i++;
        }
        for (let j = 0; j < symbols.length; j++) {
            let index = symbols[j].indexOf(char);
            if (index !== -1) {
                let shiftedIndex = (index - shiftValue) % symbols[j].length;
                if (shiftedIndex < 0) shiftedIndex += symbols[j].length;
                let decryptedChar = hiragana[j][shiftedIndex];
                if (mark === '5') {
                    decryptedChar = dakutenMap[decryptedChar] || decryptedChar;
                } else if (mark === '8') {
                    decryptedChar = handakutenMap[decryptedChar] || decryptedChar;
                } else if (mark === '6') {
                    decryptedChar = smallMap[decryptedChar] || decryptedChar;
                }
                decryptedText += decryptedChar;
                break;
            }
        }
    }
    return decryptedText;
}

function hackerEffect(finalText) {
    const resultElement = document.getElementById('result');
    const originalText = resultElement.textContent;
    resultElement.textContent = finalText;
    resultElement.addEventListener('click', copyToClipboard);
    resultElement.style.cursor = 'pointer';

    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#/&_+%-<>=[]:\\|';
    let iterations = 10;
    let interval = 40; // milliseconds
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

        resultElement.textContent = randomText.join('');

        if (currentIteration >= iterations) {
            clearInterval(intervalId);
            resultElement.textContent = finalText;
        }

        currentIteration++;
    }, interval);
}

function copyToClipboard() {
    const resultElement = document.getElementById('result');
    const tempInput = document.createElement('textarea');
    tempInput.value = resultElement.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('結果がクリップボードにコピーされました');
}

// 入力フォームの動き
const inputText = document.getElementById('inputText');
const shiftValue = document.getElementById('shiftValue');

function shakeInputs() {
    const randomX = Math.floor(Math.random() * 21) - 10;
    const randomY = Math.floor(Math.random() * 21) - 10;
    inputText.style.transform = `translate(${randomX}px, ${randomY}px)`;
    shiftValue.style.transform = `translate(${randomX}px, ${randomY}px)`;
    setTimeout(resetInputs, 100);
}

function resetInputs() {
    inputText.style.transform = 'none';
    shiftValue.style.transform = 'none';
}

setInterval(shakeInputs, 5000);

// 画面のちらつき
function flickerScreen() {
    const flicker = document.createElement('div');
    flicker.style.position = 'fixed';
    flicker.style.top = '0';
    flicker.style.left = '0';
    flicker.style.width = '100%';
    flicker.style.height = '100%';
    flicker.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    flicker.style.zIndex = '9999';
    document.body.appendChild(flicker);
    setTimeout(() => {
        document.body.removeChild(flicker);
    }, 100);
}

setInterval(flickerScreen, 3000);

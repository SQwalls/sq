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
    resultElement.textContent = finalText;
    resultElement.addEventListener('click', copyToClipboard);
    resultElement.style.cursor = 'pointer';

    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#/&_+%-<>=';
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

    let animationId;

    function drawMatrix() {
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;
        const cols = Math.floor(width / 20); // 列数の上限設定
        const yuansu = [';', '/', '~', '?', '%', '#', '+', '=', '-', '_', '(', ')', '{', '}', '[', ']', '|'];

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0f0';
        ctx.font = '20px monospace';

        for (let i = 0; i < cols; i++) {
            const text = Array(Math.floor(Math.random() * height / 20) + 10)
                .fill()
                .map(() => yuansu[Math.floor(Math.random() * yuansu.length)])
                .join('');
            ctx.fillText(text, i * 20, Math.random() * height);
        }

        animationId = requestAnimationFrame(drawMatrix);
    }

    function startMatrix() {
        const canvas = document.getElementById('matrix');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        animationId = requestAnimationFrame(drawMatrix);
    }

    function stopMatrix() {
        cancelAnimationFrame(animationId);
    }

    // ページ読み込み時にマトリックスを開始
    window.addEventListener('load', startMatrix);

    // リサイズ時にキャンバスのサイズを更新
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('matrix');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
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

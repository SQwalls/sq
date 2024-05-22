const cipherTable = {
    'あ': '@', 'い': '#', 'う': '/', 'え': '&', 'お': '_',
    'か': 'D', 'き': 'o', 'く': 'K', 'け': 't', 'こ': 'g',
    'さ': 'A', 'し': 'j', 'す': 'T', 'せ': 'p', 'そ': 'M',
    'た': 's', 'ち': 'G', 'つ': 'h', 'て': 'V', 'と': 'z',
    'な': 'N', 'に': 'n', 'ぬ': 'd', 'ね': 'x', 'の': 'U',
    'は': 'i', 'ひ': 'L', 'ふ': 'w', 'へ': 'v', 'ほ': 'b',
    'ま': 'J', 'み': 'u', 'む': 'f', 'め': 'k', 'も': 'C',
    'や': 'R', 'ゆ': 'q', 'よ': 'r',
    'ら': 'B', 'り': 'E', 'る': 'S', 'れ': 'e', 'ろ': 'F',
    'わ': '%', 'を': '+', 'ん': '<',
};

const reverseCipherTable = {};
for (const [key, value] of Object.entries(cipherTable)) {
    if (!reverseCipherTable[value]) {
        reverseCipherTable[value] = [];
    }
    reverseCipherTable[value].push(key);
}

function shiftCharacterEncrypt(char, shift) {
    const values = Object.keys(cipherTable).filter(key => cipherTable[key] === char);
    if (!values.length) {
        return char; // If character not found, return as is
    }
    const index = (values.length + shift) % values.length;
    return values[index];
}

function shiftCharacterDecrypt(char, shift) {
    const values = reverseCipherTable[char];
    if (!values) {
        return char; // If character not found, return as is
    }
    const index = (values.length - shift + values.length) % values.length;
    return values[index];
}

function transformText() {
    const inputText = document.getElementById('inputText').value;
    const shiftValue = parseInt(document.getElementById('shiftValue').value, 10);
    const operation = document.getElementById('operation').value;

    let outputText;
    if (operation === 'encrypt') {
        outputText = inputText.split('').map(char => {
            const mappedChar = cipherTable[char] || char;
            return shiftCharacterEncrypt(mappedChar, shiftValue);
        }).join('');
    } else {
        outputText = inputText.split('').map(char => shiftCharacterDecrypt(char, shiftValue)).join('');
    }
    
    document.getElementById('outputText').value = outputText;
}



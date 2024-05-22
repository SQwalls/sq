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

const hiraganaList = Object.keys(cipherTable);
const symbolList = Object.values(cipherTable);

function shiftCharacterEncrypt(char, shift) {
    const index = hiraganaList.indexOf(char);
    if (index === -1) {
        return char; // If character not found, return as is
    }
    const shiftedIndex = (index + shift) % hiraganaList.length;
    return cipherTable[hiraganaList[shiftedIndex]];
}

function shiftCharacterDecrypt(char, shift) {
    const index = symbolList.indexOf(char);
    if (index === -1) {
        return char; // If character not found, return as is
    }
    const shiftedIndex = (index - shift + hiraganaList.length) % hiraganaList.length;
    return hiraganaList[shiftedIndex];
}

function transformText() {
    const inputText = document.getElementById('inputText').value;
    const shiftValue = parseInt(document.getElementById('shiftValue').value, 10);
    const operation = document.getElementById('operation').value;

    let outputText;
    if (operation === 'encrypt') {
        outputText = inputText.split('').map(char => shiftCharacterEncrypt(char, shiftValue)).join('');
    } else {
        outputText = inputText.split('').map(char => shiftCharacterDecrypt(char, shiftValue)).join('');
    }
    
    document.getElementById('outputText').value = outputText;
}

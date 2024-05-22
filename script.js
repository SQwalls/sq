const cipherTable = {
    'あ': ['@', '#', '/', '&', '_'],
    'か': ['D', 'o', 'K', 't', 'g'],
    'さ': ['A', 'j', 'T', 'p', 'M'],
    'た': ['s', 'G', 'h', 'V', 'z'],
    'な': ['N', 'n', 'd', 'x', 'U'],
    'は': ['i', 'L', 'w', 'v', 'b'],
    'ま': ['J', 'u', 'f', 'k', 'C'],
    'や': ['R', 'q', 'r'],
    'ら': ['B', 'E', 'S', 'e', 'F'],
    'わ': ['%', '+', '<'],
    'い': ['#', '/', '&', '_', '@'],
    'き': ['o', 'K', 't', 'g', 'D'],
    'し': ['j', 'T', 'p', 'M', 'A'],
    'ち': ['G', 'h', 'V', 'z', 's'],
    'に': ['n', 'd', 'x', 'U', 'N'],
    'ひ': ['L', 'w', 'v', 'b', 'i'],
    'み': ['u', 'f', 'k', 'C', 'J'],
    'ゆ': ['q', 'r', 'R'],
    'り': ['E', 'S', 'e', 'F', 'B'],
    'を': ['+', '<', '%'],
    'う': ['/', '&', '_', '@', '#'],
    'く': ['K', 't', 'g', 'D', 'o'],
    'す': ['T', 'p', 'M', 'A', 'j'],
    'つ': ['h', 'V', 'z', 's', 'G'],
    'ぬ': ['d', 'x', 'U', 'N', 'n'],
    'ふ': ['w', 'v', 'b', 'i', 'L'],
    'む': ['f', 'k', 'C', 'J', 'u'],
    'よ': ['r', 'R', 'q'],
    'る': ['S', 'e', 'F', 'B', 'E'],
    'ん': ['<', '%', '+'],
    'え': ['&', '_', '@', '#', '/'],
    'け': ['t', 'g', 'D', 'o', 'K'],
    'せ': ['p', 'M', 'A', 'j', 'T'],
    'て': ['V', 'z', 's', 'G', 'h'],
    'ね': ['x', 'U', 'N', 'n', 'd'],
    'へ': ['v', 'b', 'i', 'L', 'w'],
    'め': ['k', 'C', 'J', 'u', 'f'],
    'れ': ['e', 'F', 'B', 'E', 'S'],
    'お': ['_', '@', '#', '/', '&'],
    'こ': ['g', 'D', 'o', 'K', 't'],
    'そ': ['M', 'A', 'j', 'T', 'p'],
    'と': ['z', 's', 'G', 'h', 'V'],
    'の': ['U', 'N', 'n', 'd', 'x'],
    'ほ': ['b', 'i', 'L', 'w', 'v'],
    'も': ['C', 'J', 'u', 'f', 'k'],
    'ろ': ['F', 'B', 'E', 'S', 'e'],
};

function shiftCharacterEncrypt(char, shift) {
    const values = cipherTable[char];
    if (!values) {
        return char; // If character not found, return as is
    }
    const index = (shift % values.length + values.length) % values.length;
    return values[index];
}

function shiftCharacterDecrypt(char, shift) {
    for (const [key, values] of Object.entries(cipherTable)) {
        const index = values.indexOf(char);
        if (index !== -1) {
            const originalIndex = (index - shift + values.length) % values.length;
            return key;
        }
    }
    return char; // If character not found, return as is
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

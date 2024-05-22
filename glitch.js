document.addEventListener('DOMContentLoaded', function () {
  const glitchText = document.getElementById('glitch-text');
  const text = glitchText.textContent;
  glitchText.innerHTML = '';

  for (let i = 0; i < text.length; i++) {
    const char = document.createElement('span');
    char.textContent = text[i];
    char.style.position = 'relative';
    char.classList.add('char-glitch');
    glitchText.appendChild(char);
  }

  function randomGlitch() {
    const chars = document.querySelectorAll('.char-glitch');
    const glitchCount = Math.floor(Math.random() * 5) + 1; 
    for (let i = 0; i < glitchCount; i++) {
      const glitchChar = chars[Math.floor(Math.random() * chars.length)];
      const originalChar = glitchChar.textContent;

      const randomChar = String.fromCharCode(33 + Math.random() * 94); // ランダムな文字を生成
      glitchChar.textContent = randomChar;

      setTimeout(() => {
        glitchChar.textContent = originalChar;
      }, 50); 
    }

    setTimeout(randomGlitch, Math.random() * 2000 + 100); 
  }

  setTimeout(randomGlitch, Math.random() * 200); 
});

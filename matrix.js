document.addEventListener('DOMContentLoaded', function () {
  const matrix = document.getElementById('matrix');
  const columns = 50; // 列数を減らす

  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    column.style.left = `${i * 2}%`; // 列間のスペースを広げる
    column.style.animationDuration = `${Math.random() * 5 + 5}s`;

    const rows = Math.floor(Math.random() * 40) + 5; // 行数を減らす

    for (let j = 0; j < rows; j++) {
      const letter = document.createElement('div');
      letter.classList.add('letter');
      const charCode = Math.random() < 0.5 ? 65 + Math.random() * 26 : 97 + Math.random() * 26; // A-Zまたはa-zを生成
      letter.textContent = String.fromCharCode(charCode);
      letter.style.animationDelay = `${Math.random() * 3}s`;
      column.appendChild(letter);
    }
    matrix.appendChild(column);
  }

  function animate() {
    requestAnimationFrame(animate);
  }

  animate();
});

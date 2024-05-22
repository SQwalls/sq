document.addEventListener('DOMContentLoaded', function () {
  const matrix = document.getElementById('matrix');
  const columns = 80; // 列数

  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    column.style.left = `${i * 1.25}%`; // 調整して列が画面に収まるようにする
    column.style.animationDuration = `${Math.random() * 5 + 5}s`;

    const rows = Math.floor(Math.random() * 50) + 10; // 行数をランダムに設定（10から60の範囲）

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
});

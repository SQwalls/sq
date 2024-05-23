document.addEventListener('DOMContentLoaded', function () {
  const matrix = document.getElementById('matrix');
  const columns = 80; // 列数

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>?/`~'; // 追加する文字

  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    column.style.left = `${i * 1.25}%`; // 調整して列が画面に収まるようにする
    column.style.animationDuration = `${Math.random() * 5 + 5}s`;

    const rows = Math.floor(Math.random() * 50) + 10; // 行数をランダムに設定（10から60の範囲）

    for (let j = 0; j < rows; j++) {
      const letter = document.createElement('div');
      letter.classList.add('letter');
      const randomChar = characters.charAt(Math.floor(Math.random() * characters.length)); // ランダムな文字を生成
      letter.textContent = randomChar;
      letter.style.animationDelay = `${Math.random() * 3}s`;
      column.appendChild(letter);
    }
    matrix.appendChild(column);
  }
});

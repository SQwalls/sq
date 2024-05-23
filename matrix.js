document.addEventListener('DOMContentLoaded', function () {
  const matrix = document.getElementById('matrix');
  matrix.style.fontSize = '12px';
  matrix.style.fontFamily = 'monospace';
  matrix.style.color = '#00ff00';

  const containerWidth = matrix.offsetWidth; // 親要素の幅を取得
  const columnWidth = 12; // 列の幅をピクセル単位で指定
  const columns = Math.floor(containerWidth / columnWidth); // 列数を計算

  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    column.style.left = `${i * columnWidth}px`; // 列の位置を設定

    const rows = Math.floor(Math.random() * 60) + 20;

    for (let j = 0; j < rows; j++) {
      const letter = document.createElement('div');
      letter.classList.add('letter');
      letter.textContent = String.fromCharCode(33 + Math.floor(Math.random() * 94));
      letter.style.animationDelay = `${Math.random() * 5}s`;

      column.appendChild(letter);
    }

    matrix.appendChild(column);
  }

  function animate() {
    requestAnimationFrame(animate);
  }

  animate();
});

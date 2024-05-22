<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>暗号変換サイト</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>暗号変換サイト</h1>
        <label for="inputText">変換したい文字列</label>
        <input type="text" id="inputText" placeholder="※テキストを入力" oninput="autoTransform()">
        
        <label for="shiftValue">Seed</label>
        <input type="number" id="shiftValue" placeholder="0" oninput="autoTransform()">
        
        <h2>生成結果</h2>
        <div id="result"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>

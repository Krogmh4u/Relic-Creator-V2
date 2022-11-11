<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Relic Creator V1.3</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="main.js"></script>
</head>
<body>
    <label for="wType">Weapon Type:</label>
      <select id="wType" name="wType"></select>

    <label for="wId">Weapon Skin:</label>
      <select id="wId" name="wId"></select>

    <button id="btn">generate</button>
    <br>
    <input type="radio" name = "rColor" id="c_red" class="rColor" value="red" checked />
    <label for="c_red">red</label>

    <input type="radio" name = "rColor" id="c_yellow" class="rColor" value="yellow" />
    <label for="c_yellow">yellow</label>

    <input type="radio" name = "rColor" id="c_green" class="rColor" value="green" />
    <label for="c_green">green</label>

    <input type="radio" name = "rColor" id="c_blue" class="rColor" value="blue" />
    <label for="c_blue">blue</label>

    <input type="radio" name = "rColor" id="c_purple" class="rColor" value="purple" />
    <label for="c_purple">purple</label>

    <br>
    <img id="rPreview" alt="Relic Preview"></img>
</body>
</html>

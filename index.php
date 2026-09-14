<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <title>Windy bubble shooter</title>
</head>

<body class="flex flex-col items-center justify-center h-screen">
  <div id="gameCanvas"
    class="relative h-4/5 max-w-8xl border-2 border-zinc-300 bg-linear-to-bl from-[#09082C] via-[#1B0F40] to-[#2B124D] ">
    <?php include 'components/mainGame.php'; ?>
  </div>
  <script type="module" src="js/game.js"></script>
</body>

</html>

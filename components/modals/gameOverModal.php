<dialog
    class="absolute inset-0 z-50 m-0 flex h-full w-full max-w-none items-center justify-center bg-black/30 backdrop-blur-md p-4 hidden"
    id="GameOverModal">
    <div
        class="flex min-h-[400px] w-full max-w-md flex-col items-center justify-center gap-4 border-2 border-sky-800 bg-white/5 rounded-lg backdrop-blur-md p-4 text-white">
        <h1 class="text-center text-3xl font-bold">time's up! Game Over</h1>
        <p class="text-yellow-400 font-medium text-xl">Your score: <span id="finalScore">0</span></p>
        <button id="playAgain" class="bg-sky-600 shadow-lg px-4 py-2 mt-4 font-medium textmd text-white w-full rounded-full">
            Play Again
        </button>
    </div>
</dialog>
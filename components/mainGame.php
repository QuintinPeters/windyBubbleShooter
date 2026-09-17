<div class="grid grid-cols-4 w-full h-full">
    <div class="grid-col-1 p-8">
        <div class="px-4">
            <h2 class="text-center text-3xl font-bold text-white/70">Score:</h2>
            <p id="score" class="text-center text-3xl font-semibold text-yellow-400">0</p>
        </div>
        <div class="px-4 mt-8">
            <h2 class="text-center text-3xl font-bold text-white/70">Timer</h2>
            <div class="flex gap-3 items-center mt-4">

                <div class="h-5 w-full overflow-hidden rounded-full bg-white/20 ">
                    <div id="timer-bar" class="h-full w-3/4 rounded-full bg-yellow-400 transition-all duration-1000">
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px"
                    fill="white">
                    <path
                        d="M600-160q-134 0-227-93t-93-227q0-133 93-226.5T600-800q133 0 226.5 93.5T920-480q0 134-93.5 227T600-160Zm0-80q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Zm91-91 57-57-108-108v-144h-80v177l131 132ZM80-600v-80h160v80H80ZM40-440v-80h200v80H40Zm40 160v-80h160v80H80Zm520-200Z" />
                </svg>
            </div>
        </div>
        <div class="flex justify-center">
            <?php include 'components/windIndicator.php'; ?>
        </div>
    </div>
    <canvas class="grid-col-2 col-span-2 border-zinc-200 border-2 w-2xl h-full" id="gameField">

    </canvas>

    <div class="grid-col-4 p-8">
        <button id="pauseButton" class="border-slate-700 border-3 bg-white/30 text-black font-bold p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="white">
                <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
            </svg>
        </button>
        <?php include 'components/modals/pauseModal.php'; ?>
    </div>
</div>
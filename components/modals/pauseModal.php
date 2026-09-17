<dialog
    class="absolute inset-0 z-50 m-0 flex h-full w-full max-w-none items-center justify-center bg-black/20 backdrop-blur-lg p-4 hidden"
    id="pauseModal">
    <div
        class="flex min-h-[400px] w-full max-w-md flex-col items-center justify-center gap-4 border-2 border-sky-800 bg-white/5 rounded-lg backdrop-blur-md p-4 text-white">
        <h1 class="text-center text-3xl font-bold">Windy Bubble Shooter</h1>
        <p class="text-center">
            Use the mouse to aim and shoot bubbles. Match 4 or more of the same
            color to clear them!
        </p>

        <button id="continueButton" class="bg-sky-600 px-4 py-2 mt-4 text-white w-full rounded-full">
            Continue Game
        </button>
        <button id="restartButton"
            class="border-sky-600 border shadow-md px-4 py-2 text-white w-full rounded-full">
            Restart Game
        </button>

        <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#fefefe">
            <path
                d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
        </svg>
    </div>
</dialog>
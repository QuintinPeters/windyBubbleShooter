<?php

const activeWindColor = "bg-sky-300";
const inactiveWindColor = "bg-zinc-300/50";



?>
<div id="wind-indicator" class="w-3xs border-3 rounded-lg border-sky-400 px-4 py-2 mt-8">
    <div class="flex items-center gap-2">
        <svg class="fill-sky-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
            width="24px">
            <path
                d="M460-160q-50 0-85-35t-35-85h80q0 17 11.5 28.5T460-240q17 0 28.5-11.5T500-280q0-17-11.5-28.5T460-320H80v-80h380q50 0 85 35t35 85q0 50-35 85t-85 35ZM80-560v-80h540q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43h-80q0-59 40.5-99.5T620-840q59 0 99.5 40.5T760-700q0 59-40.5 99.5T620-560H80Zm660 320v-80q26 0 43-17t17-43q0-26-17-43t-43-17H80v-80h660q59 0 99.5 40.5T880-380q0 59-40.5 99.5T740-240Z" />
        </svg>
        <h3>
            <span id="wind-label" class="text-sky-300 text-lg font-bold">Wind force</span>
        </h3>
    </div>
    <div class="flex gap-2 items-center justify-center mt-4 ">
        <div class="flex gap-1">
            <?php for ($i = 0; $i < 3; $i++) { ?>
                <div id="wind-left-<?php echo $i; ?>" class="w-4 h-5 bg-zinc-300/50 rounded-xs"></div>

            <?php } ?>
        </div>
        <svg id="wind-direction" class="fill-sky-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
            width="24px">
            <path d="m200-120-40-40 320-720 320 720-40 40-280-120-280 120Z" />
        </svg>
        <div class="flex gap-1">
            <?php for ($i = 0; $i < 3; $i++) { ?>
                <div id="wind-right-<?php echo $i; ?>" class="w-4 h-5 bg-zinc-300/50 rounded-xs"></div>
            <?php } ?>
        </div>
    </div>
</div>
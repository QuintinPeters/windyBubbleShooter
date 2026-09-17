export function createTimer(timerBar, onComplete, totalTime = 90) {
  let timeLeft = totalTime;
  let timer = null;
  const update = () => {
    timerBar.style.width = `${(timeLeft / totalTime) * 100}%`;
  };
  const start = () => {
    timer = setInterval(() => {
      timeLeft -= 1;
      update();
      if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        timerBar.style.width = "0%";
        onComplete();
      }
    }, 1000);
  };
  update();
  start();
  return {
    pause() {
      if (timer) clearInterval(timer);
      timer = null;
    },
    resume() {
      if (!timer && timeLeft > 0) start();
    },
  };
}

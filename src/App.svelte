<script>
  import "typeface-roboto-mono";
  import Scrambo from "scrambo";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sv.js")
      .then(() => console.log("Service Worker Registered!"));
  }

  const scrambo = new Scrambo();
  let scramble = scrambo.get();

  let times = localStorage.getItem("times") || [];
  let hidden = false;

  let precision = 2;
  let timerID = 0;
  let timer = new Date(0);
  let startTime = new Date();

  let threshold = 500;
  let thresholdTimer = 0;

  function runTimer() {
    const current = new Date();
    timer = new Date(current - startTime);
    timerID = setTimeout(runTimer, 100);
  }

  function startTimer() {
    if (thresholdTimer === 0) {
      if (!timerID) {
        thresholdTimer = new Date();
      } else {
        // stop timer
        const current = new Date();
        timer = new Date(current - startTime);
        times = [...times, { time: timer, scramble }];
        clearTimeout(timerID);
        timerID = 0;
        precision = 2;
        scramble = scrambo.get();
        hidden = false;
      }
    } else {
      const now = new Date();
      if (now - thresholdTimer > threshold) {
        timer = new Date(0);
        hidden = true;
      }
    }
  }

  function stopTimer() {
    if (thresholdTimer !== 0) {
      const now = new Date();
      if (now - thresholdTimer > threshold) {
        precision = 1;
        thresholdTimer = 0;
        startTime = new Date();
        hidden = true;
        runTimer();
      } else {
        thresholdTimer = 0;
      }
    }
  }

  function handleKeydown({ key }) {
    if (key === " ") {
      startTimer();
    }
  window.times = times;
  }

  function handleKeyup({ key }) {
    if (key === " ") {
      stopTimer();
    }
  }

  function formatTime(time, precision) {
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    return `${seconds}${(milliseconds / 1000).toFixed(precision).substr(1)}`;
  }

  function getPB(times) {
    if (times.length === 0) {
      return "-";
    } else {
      const pb = times.reduce(
        (prev, curr) => (curr.time < prev ? curr.time : prev),
        Infinity
      );
      return formatTime(pb, 2);
    }
  }

  function getAO(times, n) {
    if (times.length < n) {
      return "-";
    } else {
      const tail = times.map(t => t.time.getTime()).slice(-n)
      const high = Math.max(...tail);
      const low = Math.min(...tail);
      const filtered = tail.filter(t => t !== high && t !== low);
      const avg = filtered.reduce((acc, curr) => acc + curr) / (n - 2);
      const ao = new Date(avg)
      return formatTime(ao, 2);
    }
  }

</script>

<style>
  main {
    font-family: Roboto Mono, monospace;
    margin: auto;
    padding: 1em;

    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
  }

  timer {
    font-size: 5em;
    -webkit-user-select: none;
  }

  .dim {
    color: #868686;
  }

  bottom {
    max-width: 420px;
    width: 100%;
    -webkit-user-select: none;
    display: flex;
    justify-content: space-between;
  }

  value {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  value name {
    font-size: 1.4em;
  }

  .hidden {
    transition: 0.05s ease-out;
    opacity: 0;
  }

  scramble, bottom {
    transition: 0.1s ease-out;
  }
</style>

<svelte:window
  on:keypress={handleKeydown}
  on:keyup={handleKeyup}
  on:touchstart={startTimer}
  on:touchend={stopTimer} />

<main>
  <scramble class:hidden>{scramble}</scramble>
  <timer class:dim={thresholdTimer}>{formatTime(timer, precision)}</timer>
  <bottom class:hidden>
    <value>
      <name>PB</name>
      {getPB(times)}
    </value>
    <value>
      <name>ao5</name>
      {getAO(times, 5)}
    </value>
  </bottom>
</main>

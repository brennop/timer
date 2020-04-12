<script>
  import "typeface-roboto-mono";
  import Scrambo from "scrambo";

  const scrambo = new Scrambo();
  let scramble = scrambo.get();

  let times = localStorage.getItem("times") || [];

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
        times = [...times, { time: timer }];
        clearTimeout(timerID);
        timerID = 0;
        precision = 2;
        scramble = scrambo.get();
      }
    } else {
      const now = new Date();
      if (now - thresholdTimer > threshold) {
        timer = new Date(0);
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
      return formatTime(pb, 3);
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }

  :global(body) {
    padding: 0;
  }

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
  }

  .dim {
    color: #868686;
  }

  bottom {
    max-width: 320px;
    width: 100%;
  }

  values {
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

  history {
  }
</style>

<svelte:window
  on:keypress={handleKeydown}
  on:keyup={handleKeyup}
  on:touchstart={startTimer}
  on:touchend={stopTimer} />

<main>
  <scramble>{scramble}</scramble>
  <timer class:dim={thresholdTimer}>{formatTime(timer, precision)}</timer>
  <bottom>
    <values>
      <value>
        <name>PB</name>
        {getPB(times)}
      </value>
      <value>
        <name>ao5</name>
        -
      </value>
    </values>
    <history />
  </bottom>
</main>

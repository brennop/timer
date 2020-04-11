<script>
  import "typeface-roboto-mono";

  let times = localStorage.getItem('times') || [];

  let precision = 3;
  let timerID = 0;
  let timer = new Date(0);
  let startTime = new Date();

  let threshold = 500;
  let thresholdTimer = 0;

  function runTimer() {
    const current = new Date()
    timer = new Date(current - startTime);
    timerID = setTimeout(runTimer, 100)
     
  }

  function handleKeydown({key}) {
    if(key === ' ') {
      if(thresholdTimer === 0) {
        if(!timerID) {
          thresholdTimer = new Date();
        } else {
          // stop timer
          const current = new Date()
          timer = new Date(current - startTime);
          times = [...times, { time: timer }]
          clearTimeout(timerID);
          timerID = 0;
          precision = 3;
        }
      } else {
        const now = new Date();
        if(now - thresholdTimer > threshold) {
          timer = new Date(0);
        }
      }
    }
  }

  function handleKeyup({key}) {
    if(key === ' ') {
      if(thresholdTimer !== 0) {
        const now = new Date();
        if(now - thresholdTimer > threshold) {
          precision = 1;
          thresholdTimer = 0;
          startTime = new Date();
          runTimer()
        }
      }
    }
  }

  function formatTime(time, precision) {
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    
    return `${seconds}.${(milliseconds + "0").substr(0,
        precision)}`
  }

  function getPB(times) {
    if (times.length === 0) {
      return '-'
    } else {
      const pb = times.reduce((prev, curr) => curr.time < prev ? curr.time : prev , Infinity);
      return formatTime(pb, 3);
    }
  }

</script>

<svelte:window on:keypress={handleKeydown} on:keyup={handleKeyup}/>

<main>
  <timer>{formatTime(timer, precision)}</timer>
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
    <history></history>
  </bottom>
</main>

<style>
	main {
    font-family: Roboto Mono, monospace;
    margin: auto;
		padding: 1em;
		max-width: 320px;
	}

	timer {
		font-size: 5em;
    text-align: center;
	}

  bottom {
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

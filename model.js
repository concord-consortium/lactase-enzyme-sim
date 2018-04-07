const STEP_INTERVAL = 150; // ms
const SPEED_RATIO = 100; // 50x faster than real time
const MIN_PER_STEP = STEP_INTERVAL / (60 * 1000) * SPEED_RATIO;
const MAX_TIME = 10; // min

class Model {
  constructor () {
    // Inputs:
    this.ph = 7;
    this.lactose = 500;
    this.temperature = 55;
    this.phFuncDef = [];
    this.temperatureFuncDef = [];
    this.phFunc = null;
    this.temperatureFunc = null;
    // Outputs:
    this.time = 0;
    this.glucose = 0;

    this.step = this.step.bind(this);
  }

  get experimentFinished () {
    return this.lactose <= 0 || this.time > MAX_TIME
  }

  start () {
    this.phFunc = d3.scaleLinear()
      .domain(this.phFuncDef.map(p => p[0]))
      .range(this.phFuncDef.map(p => p[1]));
    this.temperatureFunc = d3.scaleLinear()
      .domain(this.temperatureFuncDef.map(p => p[0]))
      .range(this.temperatureFuncDef.map(p => p[1]));

    this._intId = setInterval(this.step, STEP_INTERVAL);
    window.document.body.style.background = 'red';
    this.startCallback();
  }

  stop () {
    clearInterval(this._intId);
    window.document.body.style.background = 'white';
    this.stopCallback();
  }

  getSpeed () {
    return (0.3 + (Math.random() * 0.3 - 0.15)) * this.temperatureFunc(this.temperature) * this.phFunc(this.ph);
  }

  step () {
    if (this.experimentFinished) {
      this.stop();
      return;
    }
    this.time += MIN_PER_STEP;
    const speed = this.getSpeed();
    const diff = this.lactose * speed * MIN_PER_STEP;
    this.glucose += diff;
    this.lactose -= diff;
    this.stepCallback();
  }
}

window.model = new Model();

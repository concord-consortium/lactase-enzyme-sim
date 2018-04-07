const MIN_PER_STEP = 0.03;
const TICK_INTERVAL = 10;

class Model {
  constructor () {
    this.setInitialProps();

    this.ph = 7;
    this.lactose = 500;
    this.temperature = 55;
    this.phFuncDef = [];
    this.temperatureFuncDef = [];
    this.phFunc = null;
    this.temperatureFunc = null;

    this.step = this.step.bind(this);
  }

  setInitialProps () {
    this.time = 0;
    this.glucose = 0;
    this.stepIdx = 0;
  }

  start () {
    this.phFunc = d3.scaleLinear()
      .domain(this.phFuncDef.map(p => p[0]))
      .range(this.phFuncDef.map(p => p[1]));
    this.temperatureFunc = d3.scaleLinear()
      .domain(this.temperatureFuncDef.map(p => p[0]))
      .range(this.temperatureFuncDef.map(p => p[1]));

    this._raf = window.requestAnimationFrame(this.step);
    window.document.body.style.background = 'red';
    this.startCallback();
  }

  stop () {
    window.cancelAnimationFrame(this._raf);
    window.document.body.style.background = 'white';
    this.stopCallback();
  }

  getSpeed () {
    return 0.01 * this.temperatureFunc(this.temperature) * this.phFunc(this.ph) + (Math.random() * 0.02 - 0.01);
  }

  step () {
    this._raf = window.requestAnimationFrame(this.step);

    this.stepIdx += 1;
    this.time += MIN_PER_STEP;
    const speed = this.getSpeed();
    const diff = this.lactose * speed;
    this.glucose += diff;
    this.lactose -= diff;

    if (this.lactose <= 0 || this.time > 10) {
      this.stop();
    }

    if (this.stepIdx % TICK_INTERVAL === 0) {
      this.stepCallback();
    }
  }
}

window.model = new Model();

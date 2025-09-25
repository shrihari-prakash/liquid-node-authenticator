/**
 * A simple retry utility class
 */
class Retry {
  /**
   * @param {Object} options
   * @param {number} options.attempts - Max number of attempts.
   * @param {number} options.interval - Initial delay in ms.
   * @param {'linear'|'exponential'} options.mode - Retry mode.
   * @param {number} [options.factor=2] - Growth factor for exponential mode.
   * @param {Function} [options.onRejection] - Callback for each rejection.
   */
  constructor({
    attempts,
    interval,
    mode = "linear",
    factor = 2,
    onRejection = () => true,
  }) {
    this.attempts = attempts;
    this.interval = interval;
    this.mode = mode;
    this.factor = factor;
    this.onRejection = onRejection;
  }

  async execute(fn) {
    let attempt = 0;
    let delay = this.interval;

    while (attempt < this.attempts) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt >= this.attempts || !this.onRejection(err, attempt)) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (this.mode === "linear") {
          delay += this.interval;
        } else if (this.mode === "exponential") {
          delay *= this.factor;
        }
      }
    }
  }
}

export default Retry

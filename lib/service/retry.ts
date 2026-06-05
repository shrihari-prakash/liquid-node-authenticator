/**
 * A simple retry utility class
 */
interface RetryOptions {
  attempts: number;
  interval: number;
  mode?: 'linear' | 'exponential';
  factor?: number;
  onRejection?: (err: Error, attempt: number) => boolean;
}

class Retry {
  attempts: number;
  interval: number;
  mode: 'linear' | 'exponential';
  factor: number;
  onRejection: (err: Error, attempt: number) => boolean;

  /**
   * @param {RetryOptions} options
   */
  constructor ({
    attempts,
    interval,
    mode = 'linear',
    factor = 2,
    onRejection = () => true
  }: RetryOptions) {
    this.attempts = attempts
    this.interval = interval
    this.mode = mode
    this.factor = factor
    this.onRejection = onRejection
  }

  async execute<T> (fn: () => Promise<T> | T): Promise<T> {
    let attempt = 0
    let delay = this.interval

    while (attempt < this.attempts) {
      try {
        return await fn()
      } catch (err: any) {
        attempt++
        if (attempt >= this.attempts || !this.onRejection(err, attempt)) {
          throw err
        }
        await new Promise((resolve) => setTimeout(resolve, delay))

        if (this.mode === 'linear') {
          delay += this.interval
        } else if (this.mode === 'exponential') {
          delay *= this.factor
        }
      }
    }
    throw new Error('Retry limit reached without returning')
  }
}

export default Retry

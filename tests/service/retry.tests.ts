import { expect } from 'chai';
import sinon from 'sinon';
import Retry from '../../lib/service/retry';

describe('Retry', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  it('should execute successfully on the first try', async () => {
    const retry = new Retry({ attempts: 3, interval: 1000 });
    const fn = sinon.stub().resolves('success');
    
    const result = await retry.execute(fn);
    
    expect(result).to.equal('success');
    expect(fn.calledOnce).to.be.true;
  });

  it('should retry on failure and succeed', async () => {
    const retry = new Retry({ attempts: 3, interval: 1000, mode: 'linear' });
    const fn = sinon.stub()
      .onFirstCall().rejects(new Error('fail 1'))
      .onSecondCall().resolves('success');
    
    const promise = retry.execute(fn);
    
    await clock.tickAsync(1000);
    
    const result = await promise;
    expect(result).to.equal('success');
    expect(fn.calledTwice).to.be.true;
  });

  it('should throw an error after max attempts', async () => {
    const retry = new Retry({ attempts: 2, interval: 1000, mode: 'linear' });
    const fn = sinon.stub().rejects(new Error('fail'));
    
    const promise = retry.execute(fn);
    
    await clock.tickAsync(1000);
    
    try {
      await promise;
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.equal('fail');
    }
    expect(fn.calledTwice).to.be.true;
  });

  it('should apply exponential backoff correctly', async () => {
    const retry = new Retry({ attempts: 3, interval: 1000, mode: 'exponential', factor: 2 });
    const fn = sinon.stub()
      .onFirstCall().rejects(new Error('fail 1'))
      .onSecondCall().rejects(new Error('fail 2'))
      .onThirdCall().resolves('success');
    
    const promise = retry.execute(fn);
    
    await clock.tickAsync(1000); // Wait for first retry (1000ms delay)
    await clock.tickAsync(2000); // Wait for second retry (2000ms delay)
    
    const result = await promise;
    expect(result).to.equal('success');
    expect(fn.callCount).to.equal(3);
  });

  it('should abort if onRejection returns false', async () => {
    const onRejection = sinon.stub().returns(false);
    const retry = new Retry({ attempts: 5, interval: 1000, onRejection });
    const fn = sinon.stub().rejects(new Error('fail'));
    
    try {
      await retry.execute(fn);
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.equal('fail');
    }
    
    expect(fn.calledOnce).to.be.true; // Didn't retry
    expect(onRejection.calledOnce).to.be.true;
    expect(onRejection.firstCall.args[0].message).to.equal('fail');
    expect(onRejection.firstCall.args[1]).to.equal(1); // attempt 1
  });
});

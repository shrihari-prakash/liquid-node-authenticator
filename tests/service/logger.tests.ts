import { expect } from 'chai';
import sinon from 'sinon';
import Logger from '../../lib/service/logger';

describe('Logger', () => {
  let consoleLogStub: sinon.SinonStub;
  let consoleWarnStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
    consoleWarnStub = sinon.stub(console, 'warn');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should not log when debugging is false', () => {
    const logger = new Logger(false);
    
    logger.debug('test message');
    logger.info('test message');
    logger.warn('test message');
    logger.error('test message');

    expect(consoleLogStub.called).to.be.false;
    expect(consoleWarnStub.called).to.be.false;
    expect(consoleErrorStub.called).to.be.false;
  });

  it('should log when debugging is true', () => {
    const logger = new Logger(true);
    
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(consoleLogStub.calledTwice).to.be.true; // debug and info use console.log
    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleErrorStub.calledOnce).to.be.true;
    
    // Verify prefix
    const prefix = '[Liquid Node Connector] : ';
    expect(consoleLogStub.firstCall.args).to.deep.equal([prefix, 'debug message']);
    expect(consoleLogStub.secondCall.args).to.deep.equal([prefix, 'info message']);
    expect(consoleWarnStub.firstCall.args).to.deep.equal([prefix, 'warn message']);
    expect(consoleErrorStub.firstCall.args).to.deep.equal([prefix, 'error message']);
  });
});

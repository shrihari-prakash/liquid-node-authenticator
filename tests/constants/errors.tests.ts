import { expect } from 'chai';
import {
  ForbiddenError,
  UnauthorizedError,
  NetworkError,
  CustomError,
  isLiquidError
} from '../../lib/constants/errors';

describe('Errors', () => {
  it('should correctly instantiate ForbiddenError', () => {
    const error = new ForbiddenError('Forbidden access');
    expect(error.message).to.equal('Forbidden access');
    expect(error.code).to.equal(403);
    expect(error.name).to.equal('ForbiddenError');
    expect(error).to.be.instanceOf(Error);
  });

  it('should correctly instantiate UnauthorizedError', () => {
    const error = new UnauthorizedError('Unauthorized access');
    expect(error.message).to.equal('Unauthorized access');
    expect(error.code).to.equal(401);
    expect(error.name).to.equal('UnauthorizedError');
    expect(error).to.be.instanceOf(Error);
  });

  it('should correctly instantiate NetworkError', () => {
    const error = new NetworkError('Network failed');
    expect(error.message).to.equal('Network failed');
    expect(error.code).to.equal(503);
    expect(error.name).to.equal('NetworkError');
    expect(error).to.be.instanceOf(Error);
  });

  it('should correctly instantiate CustomError', () => {
    const error = new CustomError('MyError', 500, 'My custom message');
    expect(error.message).to.equal('My custom message');
    expect(error.code).to.equal(500);
    expect(error.name).to.equal('MyError');
    expect(error).to.be.instanceOf(Error);
  });

  describe('isLiquidError', () => {
    it('should return true for ForbiddenError', () => {
      expect(isLiquidError(new ForbiddenError())).to.be.true;
    });

    it('should return true for UnauthorizedError', () => {
      expect(isLiquidError(new UnauthorizedError())).to.be.true;
    });

    it('should return true for NetworkError', () => {
      expect(isLiquidError(new NetworkError())).to.be.true;
    });

    it('should return false for CustomError', () => {
      expect(isLiquidError(new CustomError('E', 500))).to.be.false;
    });

    it('should return false for generic Error', () => {
      expect(isLiquidError(new Error())).to.be.false;
    });

    it('should return false for null or undefined', () => {
      expect(isLiquidError(null)).to.be.false;
      expect(isLiquidError(undefined)).to.be.false;
    });
  });
});

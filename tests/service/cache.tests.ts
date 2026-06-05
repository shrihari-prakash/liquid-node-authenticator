import { expect } from 'chai';
import sinon from 'sinon';
import Cache from '../../lib/service/cache';

describe('Cache', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: sinon.stub(),
      set: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should not throw if cacheOptions are omitted', () => {
    const cache = new Cache();
    expect(cache.cacheClient).to.be.undefined;
  });

  describe('get', () => {
    it('should return null if no client is configured', async () => {
      const cache = new Cache();
      const result = await cache.get('key');
      expect(result).to.be.null;
    });

    it('should query the redis client and parse JSON', async () => {
      mockClient.get.resolves(JSON.stringify({ hello: 'world' }));
      const cache = new Cache({ client: mockClient });
      
      const result = await cache.get('mykey');
      
      expect(result).to.deep.equal({ hello: 'world' });
      expect(mockClient.get.calledOnceWith('liquid_node_connector:mykey')).to.be.true;
    });

    it('should return undefined if cache result is null/empty', async () => {
      mockClient.get.resolves(null);
      const cache = new Cache({ client: mockClient });
      
      const result = await cache.get('mykey');
      
      expect(result).to.be.undefined;
    });
  });

  describe('set', () => {
    it('should return undefined immediately if no client is configured', async () => {
      const cache = new Cache();
      const result = await cache.set('key', { data: 123 });
      expect(result).to.be.undefined;
    });

    it('should stringify JSON and set on redis client with EX expiry', async () => {
      mockClient.set.resolves('OK');
      const cache = new Cache({ client: mockClient, expire: 100 });
      
      const result = await cache.set('mykey', { val: 1 });
      
      expect(result).to.equal('OK');
      expect(mockClient.set.calledOnceWith(
        'liquid_node_connector:mykey',
        JSON.stringify({ val: 1 }),
        'EX',
        100
      )).to.be.true;
    });

    it('should default expiry to 300 (FIVE_MINUTES)', async () => {
      mockClient.set.resolves('OK');
      const cache = new Cache({ client: mockClient });
      
      await cache.set('mykey', { val: 1 });
      
      expect(mockClient.set.calledOnceWith(
        'liquid_node_connector:mykey',
        JSON.stringify({ val: 1 }),
        'EX',
        300
      )).to.be.true;
    });
  });
});

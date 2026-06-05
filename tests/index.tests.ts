import { expect } from 'chai';
import sinon from 'sinon';
import LiquidNodeAuthenticator from '../lib/index';
import { ForbiddenError, UnauthorizedError, NetworkError } from '../lib/constants/errors';

describe('LiquidNodeAuthenticator', () => {
  let fetchStub: sinon.SinonStub;
  let originalFetch: any;
  let authenticator: LiquidNodeAuthenticator;
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchStub = sinon.stub();
    global.fetch = fetchStub as any;
    // Ensure ScopeManager's initial fetch doesn't throw or hang
    fetchStub.withArgs('http://liquid-server/user/scopes', sinon.match.any).resolves({
      ok: true,
      json: async () => ({ data: { scopes: {} } })
    } as Response);
    // Also match when called with 1 arg
    fetchStub.withArgs('http://liquid-server/user/scopes').resolves({
      ok: true,
      json: async () => ({ data: { scopes: {} } })
    } as Response);

    authenticator = new LiquidNodeAuthenticator({
      host: 'http://liquid-server',
      clientId: 'mock-client',
      clientSecret: 'mock-secret',
      scope: ['read:all', 'write:all'],
      debugging: false
    });
    
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    sinon.restore();
    clock.restore();
  });

  describe('getAccessToken', () => {
    it('should hit remote /oauth/token if access token is null/expired', async () => {
      fetchStub.withArgs('http://liquid-server/oauth/token', sinon.match.any).resolves({
        status: 200,
        json: async () => ({
          access_token: 'new-token-123',
          expires_in: 3600
        })
      } as Response);

      const result = await authenticator.getAccessToken();

      expect(result.accessToken).to.equal('new-token-123');
      // Token expiry should be exactly 3600 seconds from now
      expect(result.accessTokenExpiry.getTime()).to.equal(3600000);
      expect(fetchStub.calledWith('http://liquid-server/oauth/token', sinon.match.any)).to.be.true;
    });

    it('should return from memory if token is valid', async () => {
      authenticator.accessToken = 'mem-token';
      authenticator.accessTokenExpiry = new Date(Date.now() + 50000);

      const result = await authenticator.getAccessToken();

      expect(result.accessToken).to.equal('mem-token');
      expect(fetchStub.calledWith('http://liquid-server/oauth/token', sinon.match.any)).to.be.false;
    });

    it('should throw UnauthorizedError if server returns 401', async () => {
      fetchStub.withArgs('http://liquid-server/oauth/token', sinon.match.any).resolves({
        status: 401
      } as Response);

      try {
        await authenticator.getAccessToken();
        expect.fail('Should throw');
      } catch (err: any) {
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should throw NetworkError if fetch throws', async () => {
      fetchStub.withArgs('http://liquid-server/oauth/token', sinon.match.any).rejects(new Error('Connection timeout'));

      try {
        await authenticator.getAccessToken();
        expect.fail('Should throw');
      } catch (err: any) {
        expect(err).to.be.instanceOf(NetworkError);
      }
    });
  });

  describe('authenticate', () => {
    beforeEach(() => {
      // Mock getAccessToken to return a valid dummy token to bypass the token refresh loop
      sinon.stub(authenticator, 'getAccessToken').resolves({
        accessToken: 'service-token',
        accessTokenExpiry: new Date(Date.now() + 3600000)
      });
      // Mock cache methods since we might not have initialized cache correctly for testing
      sinon.stub(authenticator.cache, 'get').resolves(null);
      sinon.stub(authenticator.cache, 'set').resolves();
    });

    it('should throw ForbiddenError if no token is provided', async () => {
      try {
        await authenticator.authenticate('');
        expect.fail('Should throw');
      } catch (err: any) {
        expect(err).to.be.instanceOf(ForbiddenError);
      }
    });

    it('should return token info from cache if available and ok', async () => {
      (authenticator.cache.get as sinon.SinonStub).resolves({
        ok: 1,
        data: { tokenInfo: { userId: '123' } }
      });

      const result = await authenticator.authenticate('cached-token');
      
      expect(result).to.deep.equal({ userId: '123' });
    });

    it('should throw ForbiddenError if cache has token but it is not ok', async () => {
      (authenticator.cache.get as sinon.SinonStub).resolves({ ok: 0 });

      try {
        await authenticator.authenticate('bad-cached-token');
        expect.fail('Should throw');
      } catch (err: any) {
        expect(err).to.be.instanceOf(ForbiddenError);
      }
    });

    it('should hit /oauth/introspect and cache the result if valid', async () => {
      fetchStub.withArgs('http://liquid-server/oauth/introspect', sinon.match.any).resolves({
        status: 200,
        ok: true,
        json: async () => ({ ok: true, data: { tokenInfo: { userId: '999' } } })
      } as Response);

      const result = await authenticator.authenticate('valid-token');
      
      expect(result).to.deep.equal({ userId: '999' });
      expect(fetchStub.calledWith('http://liquid-server/oauth/introspect', sinon.match.any)).to.be.true;
      expect((authenticator.cache.set as sinon.SinonStub).calledWith('token:valid-token')).to.be.true;
    });

    it('should throw ForbiddenError and clear internal token if introspect returns 401', async () => {
      authenticator.accessToken = 'service-token-123';
      fetchStub.withArgs('http://liquid-server/oauth/introspect', sinon.match.any).resolves({
        status: 401,
        ok: false,
        json: async () => ({ ok: false })
      } as Response);

      try {
        await authenticator.authenticate('invalid-token');
        expect.fail('Should throw');
      } catch (err: any) {
        expect(err).to.be.instanceOf(ForbiddenError);
      }

      // It should have wiped its own access token
      expect(authenticator.accessToken).to.be.null;
    });
  });

  describe('checkTokenScope', () => {
    it('should forward to scopeManager', () => {
      const scopeStub = sinon.stub(authenticator.scopeManager, 'checkTokenScope').returns(true);
      
      const result = authenticator.checkTokenScope('admin', { scope: ['admin'] });
      
      expect(result).to.be.true;
      expect(scopeStub.calledOnceWith('admin', { scope: ['admin'] })).to.be.true;
    });
  });
});

import { expect } from 'chai';
import sinon from 'sinon';
import ScopeManager from '../../lib/service/scope-manager';

describe('ScopeManager', () => {
  let mockLogger: any;
  let fetchStub: sinon.SinonStub;
  let originalFetch: any;

  const mockScopes = {
    'read:user': { name: 'read:user', description: 'Read user info', parent: null },
    'write:user': { name: 'write:user', description: 'Write user info', parent: 'read:user' },
    'admin': { name: 'admin', description: 'Admin access', parent: null },
    'superadmin': { name: 'superadmin', description: 'Super admin access', parent: 'admin' }
  };

  beforeEach(() => {
    mockLogger = {
      debug: sinon.stub(),
      info: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub()
    };
    originalFetch = global.fetch;
    fetchStub = sinon.stub();
    global.fetch = fetchStub as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    sinon.restore();
  });

  describe('Initialization', () => {
    it('should initialize scopes successfully', async () => {
      fetchStub.resolves({
        ok: true,
        json: async () => ({ data: { scopes: mockScopes } })
      } as Response);

      const manager = new ScopeManager('http://mock-host', mockLogger);
      
      // Since initialization is triggered in constructor via async retry,
      // we can't easily wait for it without polling or exporting the promise.
      // But we can call initializeScopes manually to test it reliably.
      await manager.initializeScopes();

      expect(fetchStub.called).to.be.true;
      expect(
        mockLogger.info.args.some((args: any[]) =>
          args[0] && args[0].startsWith('Scopes initialized.')
        )
      ).to.be.true;
    });

    it('should throw an error if fetch fails', async () => {
      fetchStub.resolves({
        ok: false,
        status: 500
      } as Response);

      const manager = new ScopeManager('http://mock-host', mockLogger);

      try {
        await manager.initializeScopes();
        expect.fail('Should have thrown an error');
      } catch (err: any) {
        expect(err.message).to.equal('Failed to fetch scopes. Status: 500');
        expect(mockLogger.error.calledWith('Error initializing scopes:', err.message)).to.be.true;
      }
    });
  });

  describe('getScopeTree', () => {
    it('should correctly build a scope tree', () => {
      const manager = new ScopeManager('http://mock-host', mockLogger);
      const scopesArr = Object.values(mockScopes);
      
      const tree = manager.getScopeTree(scopesArr, undefined); // using undefined for root
      // We expect 'read:user' and 'admin' to be root level, since they don't have parents.
      expect(tree).to.deep.equal({
        'read:user': {
          'write:user': {}
        },
        'admin': {
          'superadmin': {}
        }
      });
    });
  });

  describe('isScopeAllowed & checkTokenScope', () => {
    let manager: ScopeManager;

    beforeEach(async () => {
      manager = new ScopeManager('http://mock-host', mockLogger);
      // Manually inject scopes for synchronous testing
      manager.scopes = mockScopes;
    });

    it('should return false if requested scope is completely unknown', () => {
      const result = manager.isScopeAllowed('unknown:scope', ['read:user']);
      expect(result).to.be.false;
      expect(mockLogger.warn.calledWith('Unknown scope unknown:scope. Did you forget to configure this scope in your Liquid server?')).to.be.true;
    });

    it('should return true if token explicitly has the exact requested scope', () => {
      expect(manager.isScopeAllowed('read:user', ['read:user'])).to.be.true;
    });

    it('should return true if token has the parent of the requested scope', () => {
      // If token has read:user, they can access write:user? Wait, the logic in scope-manager says:
      // if (allowedScopes.includes(scopeObject.name) || (scopeObject.parent && allowedScopes.includes(scopeObject.parent)))
      // Let's test what the actual logic does:
      expect(manager.isScopeAllowed('write:user', ['read:user'])).to.be.true;
    });

    it('should recursively check for a top-level parent scope', () => {
      // add a deep scope
      manager.scopes['deep:scope'] = { name: 'deep:scope', description: '', parent: 'write:user' };
      // User only has read:user
      expect(manager.isScopeAllowed('deep:scope', ['read:user'])).to.be.true;
    });

    it('should return false if token does not have any related scope', () => {
      expect(manager.isScopeAllowed('admin', ['read:user'])).to.be.false;
      expect(manager.isScopeAllowed('superadmin', ['read:user', 'write:user'])).to.be.false;
    });

    it('checkTokenScope should wrap isScopeAllowed and extract token.scope', () => {
      const token = { scope: ['admin'] };
      expect(manager.checkTokenScope('superadmin', token)).to.be.true;
      expect(manager.checkTokenScope('read:user', token)).to.be.false;
    });

    it('checkTokenScope should return false if scopes are not initialized', () => {
      manager.scopes = null as any; // simulate not ready
      const token = { scope: ['admin'] };
      expect(manager.checkTokenScope('admin', token)).to.be.false;
      expect(mockLogger.warn.calledWith('Scope list not ready')).to.be.true;
    });
  });
});

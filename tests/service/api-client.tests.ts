import { expect } from 'chai';
import sinon from 'sinon';
import { ApiClient } from '../../lib/service/api-client';
import { NetworkError, UnauthorizedError } from '../../lib/constants/errors';

describe('ApiClient', () => {
  let fetchStub: sinon.SinonStub;
  let originalFetch: any;
  let apiClient: ApiClient;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchStub = sinon.stub();
    global.fetch = fetchStub as any;
    apiClient = new ApiClient({ host: 'http://liquid-server' });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    sinon.restore();
  });

  describe('introspectToken', () => {
    it('should introspect token successfully', async () => {
      fetchStub.resolves({
        status: 200,
        json: async () => ({ ok: true, data: { tokenInfo: 'info' } })
      } as Response);

      const response = await apiClient.introspectToken('my-token', 'client-token');
      expect(response.status).to.equal(200);
      expect(response.result.data.tokenInfo).to.equal('info');
      expect(fetchStub.calledOnce).to.be.true;
      
      const args = fetchStub.firstCall.args;
      expect(args[0]).to.equal('http://liquid-server/oauth/introspect');
      expect(args[1].headers.Authorization).to.equal('Bearer client-token');
    });

    it('should throw NetworkError on fetch failure', async () => {
      fetchStub.rejects(new Error('fetch failed'));

      try {
        await apiClient.introspectToken('my-token', 'client-token');
        expect.fail('Should throw');
      } catch (err) {
        expect(err).to.be.instanceOf(NetworkError);
      }
    });
  });

  describe('getClientCredentials', () => {
    it('should fetch credentials successfully', async () => {
      fetchStub.resolves({
        status: 200,
        json: async () => ({ access_token: 'new-token', expires_in: 3600 })
      } as Response);

      const result = await apiClient.getClientCredentials('client1', 'secret1', 'read write');
      expect(result.access_token).to.equal('new-token');
      expect(result.expires_in).to.equal(3600);
      
      const args = fetchStub.firstCall.args;
      expect(args[0]).to.equal('http://liquid-server/oauth/token');
      expect(args[1].body.get('grant_type')).to.equal('client_credentials');
    });

    it('should throw UnauthorizedError if status is not 200', async () => {
      fetchStub.resolves({
        status: 401
      } as Response);

      try {
        await apiClient.getClientCredentials('client1', 'secret1', 'read');
        expect.fail('Should throw');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedError);
      }
    });

    it('should throw NetworkError on fetch failure', async () => {
      fetchStub.rejects(new Error('Network disconnected'));

      try {
        await apiClient.getClientCredentials('client1', 'secret1', 'read');
        expect.fail('Should throw');
      } catch (err) {
        expect(err).to.be.instanceOf(NetworkError);
      }
    });
  });
});

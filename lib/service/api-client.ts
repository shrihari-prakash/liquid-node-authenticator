import { NetworkError, UnauthorizedError, CustomError } from '../constants/errors';

export interface ApiClientOptions {
  host: string;
}

export class ApiClient {
  private host: string;

  constructor(options: ApiClientOptions) {
    this.host = options.host;
  }

  /**
   * Introspect a token to validate it and get its associated info.
   *
   * @param token The token to introspect.
   * @param clientToken A valid client access token used for authorization.
   * @returns The introspected token information.
   */
  async introspectToken(token: string, clientToken: string): Promise<any> {
    const api = `${this.host}/oauth/introspect`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`
    };
    const body = JSON.stringify({ token });

    let response: Response;
    try {
      response = await fetch(api, { method: 'POST', headers, body });
    } catch {
      throw new NetworkError();
    }

    const result = await response.json();

    return {
      status: response.status,
      result
    };
  }

  /**
   * Retrieves an access token using client credentials.
   *
   * @param clientId The client ID.
   * @param clientSecret The client secret.
   * @param scope The requested scopes.
   * @returns The access token response containing `access_token` and `expires_in`.
   */
  async getClientCredentials(clientId: string, clientSecret: string, scope: string): Promise<any> {
    const api = `${this.host}/oauth/token`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
    body.append('scope', scope);

    let response: Response;
    try {
      response = await fetch(api, { method: 'POST', headers, body });
    } catch {
      throw new NetworkError();
    }

    if (response.status !== 200) {
      throw new UnauthorizedError();
    }

    return await response.json();
  }
}

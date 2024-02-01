interface TokenInfo {
  accessToken: string;
  accessTokenExpiresAt: string;
  scope: string;
  user: {
    [key: string]: any;
  };
}

interface TokenResponse {
  accessToken: string;
  accessTokenExpiry: number;
}

interface CacheOptions {
  client: any;
  expire: number;
}

interface ConnectorOptions {
  host: string;
  clientId: string;
  clientSecret: string;
  cacheOptions?: CacheOptions;
  scope?: string | string[];
  debugging?: boolean;
}

class UnauthorizedError extends Error {
  name = "UnauthorizedError";
}

declare module "liquid-node-authenticator" {
  export default class LiquidNodeAuthenticator {
    constructor(options: ConnectorOptions);
    authenticate(token: string): Promise<TokenInfo>;
    getAccessToken(): Promise<TokenResponse>;
    checkTokenScope(scope: string, token: TokenInfo): boolean;
  }
}

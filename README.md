## 📦 Liquid Node Authenticator

A Node.js client for [Liquid](https://github.com/shrihari-prakash/liquid) authentication services. You can use this library to:

- Authenticate and validate user tokens arriving at your microservice, including checking for specific scopes.
- Manage client credentials and automatically cache access tokens for your microservice to talk directly to Liquid APIs (for retrieving user info, handling subscriptions, pushing custom data, etc).

Requires Node 18+.

### Installation

Run `npm i liquid-node-authenticator`.

### Usage

#### Initialization

```js
import LiquidAuthenticator from "liquid-node-authenticator";

const liquidAuthenticator = new LiquidAuthenticator({
  host: "host_address_of_your_liquid_instance",
  clientId: "your_liquid_client_id",
  clientSecret: "your_liquid_client_secret",
  scope: "scope1,scope2,scope3",
  // Optional
  cacheOptions: {
    client: RedisClient,
    expire: 300, // 5 minutes
  },
  // Optional
  debugging: true, // Print console logs
});
```

#### Authenticate a user connecting to your microservice

```js
const tokenDetails = await liquidAuthenticator.authenticate(token);

// Now use tokenDetails.user in the rest of your logic.
```

#### Get access token for accessing client level APIs

```js
const { accessToken } = await liquidAuthenticator.getAccessToken();
// Make APIs calls that requires client authentication.
```

#### Check if a scope is allowed for a token

Read more about configuring scopes and access control in the [Liquid documentation](https://liquid.shrihariprakasam.in/Understanding-Access-Control-and-Integrating-with-Other-Microservices).

```js
const allowed = liquidAuthenticator.checkTokenScope(
  "your:scope:name",
  token /* tokenDetails object acqurired in authenticate() function */,
);

if (allowed) {
  // Scope is allowed, continue with action
} else {
  // Scope is NOT allowed, send insufficient priviledge error
}
```

## 📦 Liquid Node Authenticator

A Node.js connector library to integrate your microservices with [Liquid](https://github.com/shrihari-prakash/liquid) authentication services. This library requires Node version 18 or above.

### Installation

Run `npm i liquid-node-connector`.

### Usage

#### Initialization

```js
import LiquidConnector from "liquid-node-connector";

const liquidConnector = new LiquidConnector({
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
const tokenDetails = await liquidConnector.authenticate(token);

// Now use tokenDetails.user in the rest of your logic.
```

#### Get access token for accessing client level APIs

```js
const { accessToken } = await liquidConnector.getAccessToken();
// Make APIs calls that requires client authentication.
```

#### Check if a scope is allowed for a token

```js
const allowed = await liquidConnector.checkTokenScope(
  "your:scope:name",
  token /* tokenDetails object acqurired in authenticate() function */
);

if (allowed) {
  // Scope is allowed, continue with action
} else {
  // Scope is NOT allowed, send insufficient priviledge error
}
```

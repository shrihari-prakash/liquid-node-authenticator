# Contributing to Liquid Node Authenticator

Thank you for your interest in contributing to the `liquid-node-authenticator`!

## Getting Started

1. Clone the repository locally.
2. Run `npm ci` to install dependencies cleanly.
3. Make your modifications to the source files in the `lib` directory.

## Testing

Please make sure all existing and newly written tests pass before submitting a pull request.
We use `mocha` and `chai` for testing with `sinon` for mocking.

- To run the test suite: `npm test`
- To run tests with coverage reporting: `npm run test:coverage`

Ensure that the overall coverage remains above 95% for any new features added.

## Publishing

If you are an admin or maintainer looking to publish a new version of the package to the NPM registry, follow these steps:

1. **Verify State**: Ensure you are on the `master` or `develop` branch, the working directory is clean (`git status`), and the GitHub Actions pipeline is green.
2. **Build the Package**: Run the TypeScript compiler to prepare the `dist/` bundle:
   ```bash
   npm run build
   ```
3. **Run Final Tests**: Verify everything is working:
   ```bash
   npm run test:coverage
   ```
4. **Bump Version**: Bump the package version (e.g., `patch`, `minor`, or `major`). This will automatically update `package.json` and create a git commit/tag:
   ```bash
   npm version patch
   ```
5. **Publish to NPM**: Publish the package to the public registry. (Make sure you are authenticated with `npm login` if you haven't already):
   ```bash
   npm publish
   ```
6. **Push to GitHub**: Push your commits and the newly created release tags to the repository:
   ```bash
   git push origin main --follow-tags
   ```

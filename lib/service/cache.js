const FIVE_MINUTES = 300

/**
 * Cache class for storing and retrieving data with an external redis instance.
 *
 * @class
 */
class Cache {
  /**
     * Creates an instance of the Cache class.
     *
     * @constructor
     * @param {Object} [cacheOptions] - Options for configuring the cache.
     * @param {Object} [cacheOptions.client] - The caching client (e.g., Redis client) to use.
     * @param {number} [cacheOptions.expire] - The expiration time for cached items in seconds.
     */
  constructor (cacheOptions) {
    if (cacheOptions) {
      this.cachePrefix = 'liquid_node_connector:'
      this.cacheClient = cacheOptions.client
      this.cacheExpiry = cacheOptions.expire || FIVE_MINUTES
    }
  }

  /**
     * Retrieves data from the cache using the specified key.
     *
     * @async
     * @param {string} key - The key used to retrieve data from the cache.
     * @returns {Promise<Object|null>} The cached data, or null if the cache is not configured.
     */
  async get (key) {
    if (!this.cacheClient) {
      return null
    }
    const cacheResult = await this.cacheClient.get(`${this.cachePrefix}${key}`)
    if (cacheResult) {
      return JSON.parse(cacheResult)
    }
  }

  /**
     * Stores data in the cache with the specified key.
     *
     * @async
     * @param {string} key - The key used to store data in the cache.
     * @param {Object} data - The JSON data to be stored in the cache.
     * @returns {Promise<undefined>} A Promise indicating the completion of the set operation.
     */
  async set (key, data) {
    if (!this.cacheClient) {
      return
    }
    return await this.cacheClient.set(`${this.cachePrefix}${key}`, JSON.stringify(data), 'EX', this.cacheExpiry)
  }
}

export default Cache

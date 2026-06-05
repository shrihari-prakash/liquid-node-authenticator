const FIVE_MINUTES = 300

/**
 * Cache class for storing and retrieving data with an external redis instance.
 *
 * @class
 */
interface CacheOptions {
  client: any;
  expire?: number;
}

class Cache {
  cachePrefix?: string;
  cacheClient?: any;
  cacheExpiry?: number;

  /**
   * @param {CacheOptions} [cacheOptions]
   */
  constructor (cacheOptions?: CacheOptions) {
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
  async get (key: string): Promise<any | null> {
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
  async set (key: string, data: any): Promise<any> {
    if (!this.cacheClient) {
      return
    }
    return await this.cacheClient.set(`${this.cachePrefix}${key}`, JSON.stringify(data), 'EX', this.cacheExpiry)
  }
}

export default Cache

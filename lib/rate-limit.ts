import LRUCache from "lru-cache"

interface RateLimitOptions {
  interval: number // in milliseconds
  uniqueTokenPerInterval: number
}

interface RateLimitInfo {
  count: number
  lastReset: number
}

export function rateLimit(options: RateLimitOptions) {
  const tokens = new LRUCache<string, RateLimitInfo>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  })

  return {
    check: (token: string): boolean => {
      const now = Date.now()
      let tokenInfo = tokens.get(token)

      if (!tokenInfo || now - tokenInfo.lastReset > options.interval) {
        tokenInfo = { count: 0, lastReset: now }
        tokens.set(token, tokenInfo)
      }

      tokenInfo.count++
      return tokenInfo.count <= options.uniqueTokenPerInterval
    },
    limit: options.uniqueTokenPerInterval,
    remaining: (token: string): number => {
      const tokenInfo = tokens.get(token)
      return tokenInfo ? Math.max(0, options.uniqueTokenPerInterval - tokenInfo.count) : options.uniqueTokenPerInterval
    },
    reset: (token: string): number => {
      const tokenInfo = tokens.get(token)
      return tokenInfo ? tokenInfo.lastReset + options.interval : Date.now() + options.interval
    },
  }
}

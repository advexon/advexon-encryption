import { Redis } from "@upstash/redis"

// Create Redis client from environment variables
// This will use KV_REST_API_URL and KV_REST_API_TOKEN that were added by the Upstash integration
export const redis = Redis.fromEnv()

// Set a TTL (time-to-live) for stored snippets (7 days in seconds)
export const SNIPPET_TTL = 60 * 60 * 24 * 7

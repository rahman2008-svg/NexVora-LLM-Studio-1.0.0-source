/**
 * Optional third-party endpoints. NexVora LLM Studio does not bundle any server credentials or any
 * endpoint operated by the original AnythingLLM authors. Leave a value empty to keep that feature off.
 *
 * These values are compiled into the app. Do not put secrets here if you distribute the APK.
 */
export const ENDPOINTS: {
  searxngUrl: string;
  searxngKeyHeader: string;
  searxngKey: string;
  geolocationUrl: string;
} = {
  /**
   * Optional self-hosted SearXNG JSON search URL used as a fallback when the keyless You.com search
   * fails, e.g. 'https://search.example.com/search'. Empty = no fallback (no query leaves the device
   * except to You.com).
   */
  searxngUrl: '',
  /** Optional auth header name/value for the SearXNG instance above (leave empty if it is open). */
  searxngKeyHeader: '',
  searxngKey: '',
  /**
   * Optional IP-geolocation endpoint returning JSON in the ip-api.com shape
   * ({ city, regionName, country, ... }), e.g. your own HTTPS proxy. Empty = the get_location tool is
   * unavailable and no IP lookup is ever made.
   */
  geolocationUrl: '',
};

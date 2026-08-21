let accessToken = null;

const tokenManager = {
  /**
   * Stores access token in memory.
   * This token is intentionally not persisted.
   */
  setAccessToken(token) {
    accessToken = token;
  },

  /**
   * Returns current access token.
   */
  getAccessToken() {
    return accessToken;
  },

  /**
   * Clears access token from memory.
   */
  clearAccessToken() {
    accessToken = null;
  },

  /**
   * Checks whether an access token exists.
   */
  hasAccessToken() {
    return Boolean(accessToken);
  },
};

export default tokenManager;

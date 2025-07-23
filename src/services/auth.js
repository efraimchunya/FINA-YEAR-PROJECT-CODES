let _token = null;
export const setToken = t => { _token = t; };
export const authHeader = () => _token ? { Authorization: `Bearer ${_token}` } : {};

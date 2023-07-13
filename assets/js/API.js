class API {
  #apiKey;

  /**
   * Constructor for generic API class
   * @param {string} baseUrl Base URL of the API
   * @param {string} apiKeyName Parameter name of the API key
   * @param {string} apiKey API key
   */
  constructor(baseUrl, apiKeyName = "", apiKey = "") {
    this.baseUrl = baseUrl;
    this.apiKeyName = apiKeyName;
    this.#apiKey = apiKey;
  }

  /**
   * Construct URL for API call to resource with parameters
   * @param {string} resource Location of the requested resource
   * @param  {Array<Object>} params Additional parameters
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].val Value of the parameter
   * @returns {string} Constructed API URL
   */
  constructUrl(resource, ...params) {
    let url = this.baseUrl + resource;

    let params = [...params];
    if (this.#apiKey !== "") params.push(this.apiKeyName + this.#apiKey);

    if (params.length > 0) {
      url += "?";
      params.forEach(({ name, val }, index) => {
        if (index !== 0) url += "&";
        url += name + val;
      });
    }
    return url;
  }

  /**
   * Generic fetch response handler
   * @param {Response} response Response object from fetch promise
   * @returns Response body as JSON or throws an error with the response status
   */
  handleResponse(response) {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  }
}

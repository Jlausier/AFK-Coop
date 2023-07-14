class API {
  #apiKey;
  #headerAuth;

  /**
   * Constructor for generic API class
   * @param {string} baseUrl Base URL of the API
   * @param {Array<Object>} resources Available resources and their potential parameters
   * @param {string} resources[].name Name of the resource
   * @param {string} resources[].location Location of the resource
   * @param {Array<string>} resources[].params Potential parameters for the resource
   * @param {string} apiKeyName Parameter name of the API key
   * @param {string} apiKey API key
   */
  constructor(
    baseUrl,
    resources,
    apiKeyName = null,
    apiKey = null,
    headerAuth = null
  ) {
    this.baseUrl = baseUrl;
    this.resources = resources;
    this.apiKeyName = apiKeyName;
    this.#apiKey = apiKey;
    this.#headerAuth = headerAuth;
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
    if (this.#apiKey) params.push(this.apiKeyName + this.#apiKey);

    if (params.length > 0) {
      url += "?";
      params.forEach(({ name, val }, index) => {
        if (index !== 0) url += "&";
        url += name + "=" + val;
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

  /**
   * Checks if the resources and params are available, fetches a generic response
   * @param {string} resource Named resource
   * @param {Array<Object>} [params=[]] Parameters for the API call
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].val Value of the parameter
   * @returns {Promise<Object>} Generic fetch promise
   */
  async fetchResponse(resource, authType, params = []) {
    let availableResources = resources.filter((e) => e.name === resource);
    if (availableResources.length === 0) {
      throw new Error("Selected resource is not available");
    }

    params.filter((param) => {
      if (!availableResources[0].params.filter((e) => e === param.name)) {
        throw new Error("Parameter not found");
      }
      if (param.val !== "") return param;
    });

    let url = this.constructUrl(
      availableResources[0].location,
      availableResources[0].params
    );

    let headers = {
      accept: "application/json",
    };

    if (this.#headerAuth) {
      Object.keys(this.#headerAuth).forEach((key) => {
        headers[key] = this.#headerAuth[key];
      });
    }

    return fetch(url, {
      method: "GET",
      headers,
    }).then(this.handleResponse);
  }
}

class YelpAPI extends API {
  constructor() {
    super(
      "https://api.yelp.com/v3/",
      [
        {
          name: "businessesSearch",
          location: "businesses/search",
          params: ["location", "term", "categories", "sort_by", "limit"],
        },
      ],
      null,
      null,
      {
        Authorization:
          "Bearer NdsssKx2ir8nv7oCjugA6W3xuCcDKf8mWFYBsvGebSjzP2kEvWl08ihRgpQae9YjKprA-rKIG-ndVQorYhOFU2ByUfK_HiliUEIl_Fs1RsWxL4YbAwSfxodkBpKwZHYx",
      }
    );
  }

  fetchBusinessesSearch = async (location, categories) =>
    super
      .fetchResponse("businessesSearch", [
        {
          name: "location",
          value: location,
        },
        ...categories.map((cat) => {
          return {
            name: "categories",
            value: cat,
          };
        }),
        {
          name: "sort_by",
          value: "best_match",
        },
        {
          name: "limit",
          value: "20",
        },
      ])
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
}

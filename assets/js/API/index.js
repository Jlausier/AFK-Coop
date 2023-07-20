class API {
  static proxy = "https://floating-headland-95050.herokuapp.com/";
  client;
  apiKey;

  noResourceError(details = "") {
    return {
      title: "Information not Available",
      message: `The requested information is not available from the ${this.name} API, please try again.`,
      details,
    };
  }

  authenticationError(details = "") {
    return {
      title: "Authentication Issue",
      message: `Could not authenticate with the ${this.name} API, please try again.`,
      details,
    };
  }

  /**
   * Constructor for generic API class
   * @param {string} name Name of the API
   * @param {string} baseUrl Base URL of the API
   * @param {boolean} useProxy Whether to use proxy to bypass CORS issues
   * @param {Array<Object>} resources Available resources and their potential parameters
   * @param {string} resources[].location Location of the resource
   * @param {Array<string>} resources[].params Potential parameters for the resource
   * @param {Object} resources[].subResources Additional resources
   * @param {Object} headers Header fields to be present in every API call
   */
  constructor(name, baseUrl, useProxy, resources, headers = {}) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
    this.resources = resources;
    this.headers = headers;
    this.headers.accept = "application/json";
  }

  /**
   * Sets the client field and sets the client-id header field
   * @param {Object} client Client object with refresh information
   * @param {string} client.method REST method for client authorization
   * @param {string} client.id Client ID, attaches to header of all API calls
   * @param {string} client.secret Client secret
   * @param {function} client.url URL for client authorization
   */
  setClient(client) {
    this.client = client;
    this.headers["Client-ID"] = this.client.id;
  }

  /**
   * Refreshes authorization bearer token if necessary
   */
  async refreshToken() {
    // Gets the current token
    let token = JSON.parse(localStorage.getItem("token_" + this.name));
    let currTime = Date.now();

    // Checks if stored authorization is valid
    if (
      token &&
      !(typeof token === "undefined") &&
      currTime < token.expiration - 10000
    ) {
      // Sets the authorization header and returns a guaranteed promise
      this.headers.Authorization = token.value;
      return new Promise((resolve, _) => resolve());
    } else {
      // Asks client authorization server for a new bearer token
      return fetch(API.proxy + this.client.url(), {
        method: this.client.method,
      })
        .then(this.handleResponse)
        .then((data) => {
          // Sets the authorization header with the new bearer token
          this.headers.Authorization = "Bearer " + data["access_token"];
          // Stores the token and expiration time in local storage
          localStorage.setItem(
            "token_" + this.name,
            JSON.stringify({
              value: this.headers.Authorization,
              expiration: currTime + data["expires_in"] * 1000,
            })
          );
        })
        .catch((_) => {
          throw this.authenticationError(
            `There was an error while attempting to refresh the client authorization token for the ${this.name} API.`
          );
        });
    }
  }

  /**
   * Constructs URL for API call to resource with parameters
   * @param {string} resource Location of the requested resource
   * @param  {Array<Object>} params Additional parameters
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].value Value of the parameter
   * @returns {string} API URL with parameters
   */
  constructUrl(resource, params) {
    // Prepends URL with proxy if required
    let url = this.useProxy ? API.proxy : "";
    // Adds base URL and resource location
    url += this.baseUrl + resource;

    if (params.length > 0) {
      url += "?";
      // Adds each parameter to URL
      params.forEach((option, index) => {
        if (index !== 0) url += "&";
        url += option.name + "=" + option.val;
      });
    }
    return url;
  }

  /**
   * Constructs URP for API call to resource with parameters and API key
   * @param {string} resource Location of the requested resource
   * @param  {Array<Object>} params Additional parameters
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].value Value of the parameter
   * @returns API URL with parameters and key
   */
  constructUrlWithKey(resource, params) {
    let validParams = params;
    // Checks if API key exists
    if (this.apiKey && "name" in this.apiKey && "value" in this.apiKey) {
      validParams.push(this.apiKey); // Adds API key to parameters
    }
    // Returns result of basic URL constructor with key as parameter
    return this.constructUrl(resource, validParams);
  }

  /**
   * Handles generic fetch response
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
  validateCall(resource, subResource, params = [], subResourceParameters = []) {
    // Validates base resource
    if (!(resource in this.resources && "location" in this.resources[resource]))
      throw this.noResourceError(
        `The ${resource} resource was not found in the list of available resources for the ${this.name} API.`
      );

    // Gets the resource and resource location
    let validResource = this.resources[resource];
    let validResourceLocation = validResource.location;
    // Gets the REST method or defaults to GET
    let method = "method" in validResource ? validResource.method : "GET";
    // Starts building available parameters array
    let availableParams = validResource.params || [];

    if (subResource !== "") {
      // Validates subresource
      if (
        !(
          "subResources" in validResource &&
          subResource in validResource.subResources
        )
      )
        throw this.noResourceError(
          `The ${subResource} subresource was not found in the list of available subresources for the ${this.name} API.`
        );

      // Gets the subresource
      let validSubresource = validResource.subResources[subResource];
      // Adds subresource's available parameters
      if ("params" in validSubresource)
        availableParams.push(...validSubresource.params);
      // Adds resource specifier to location
      validResourceLocation += validSubresource.specifyResource(
        ...subResourceParameters
      );
      // Sets the method to the specific subresource method if necessary
      if ("method" in validSubresource) method = validSubresource.method;
    }

    // Validates requested parameters against available parameters
    let validParams = params.filter((param) => {
      if (!availableParams.includes(param.name)) {
        throw {
          title: "Search Parameters Invalid",
          message: `The search parameters were invalid for the ${this.name} API, please try again.`,
          details: `Parameter ${param.name} was not found in the list of available params for the ${resource} resource in the ${this.name} API.`,
        };
      } else if (param.val !== "") return param; // Adds validated parameter
    });

    // Returns validated API call information
    return {
      location: validResourceLocation,
      parameters: validParams,
      method,
    };
  }

  /**
   * Validates requested resource, constructs fetch request,
   *  and fetches data
   *
   * @param {string} resource Named resource
   * @param {string} subResource Named subresource
   * @param {Array<any>} subResourceParameters Arguments to generate subresource location
   * @param {Array<Object>} [params=[]] Parameters for the API call
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].val Value of the parameter
   * @param {Object} headerOptions Header keys and values
   * @param {Object} body Body of the header
   * @returns {Promise<Object>} Fetch promise
   */
  async getData(
    resource,
    subResource,
    subResourceParameters = [],
    params = [],
    headerOptions = {},
    body = null
  ) {
    // Validates resource
    let { location, parameters, method } = this.validateCall(
      resource,
      subResource,
      params,
      subResourceParameters
    );
    // Constructs URL
    let url = this.constructUrl(location, parameters);
    // Constructs headers
    let headersObject = this.headers;
    Object.keys(headerOptions).forEach((option) => {
      headersObject[option] = headerOptions[option];
    });
    // Fetches data and returns promise
    return fetch(url, {
      method,
      headers: headersObject,
      body,
    });
  }

  /**
   * Wrapper for getData that refreshes client token before call
   * @param {string} resource Named resource
   * @param {string} subResource Named subresource
   * @param {Array<any>} subResourceParameters Arguments to generate subresource location
   * @param {Array<Object>} [params=[]] Parameters for the API call
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].val Value of the parameter
   * @param {Object} headerOptions Header keys and values
   * @param {Object} body Body of the header
   * @returns {Promise<Object>} Fetch promise
   */
  async getDataWithToken(
    resource,
    subResource,
    subResourceParameters = [],
    params = [],
    headerOptions = {},
    body = null
  ) {
    // Refreshes client token before call
    return this.refreshToken().then(() => {
      // Returns getData promise
      return this.getData(
        resource,
        subResource,
        subResourceParameters,
        params,
        headerOptions,
        body
      );
    });
  }
}

/**
 * Communicates with the Yelp Fusion API
 * Documentation: https://docs.developer.yelp.com/docs/fusion-intro
 * Authentication: Static bearer token
 * Rate Limit:
 *  - Unknown QPS rate limit
 *  - 500 requests per 24 hours (resets at 00:00 UTC)
 */
class YelpAPI extends API {
  /**
   * Instantiates a new YelpAPI
   */
  constructor() {
    // Calls API class constructor with static properties
    super(
      "Yelp Fusion",
      "https://api.yelp.com/v3/",
      true,
      {
        businesses: {
          location: "businesses/",
          subResources: {
            searchByCategory: {
              method: "GET",
              specifyResource: () => "search",
              params: ["location", "term", "categories", "sort_by", "limit"],
            },
            searchById: {
              method: "GET",
              specifyResource: (id) => id,
              params: ["locale"],
            },
          },
        },
      },
      {
        Authorization:
          "Bearer NdsssKx2ir8nv7oCjugA6W3xuCcDKf8mWFYBsvGebSjzP2kEvWl08ihRgpQae9YjKprA-rKIG-ndVQorYhOFU2ByUfK_HiliUEIl_Fs1RsWxL4YbAwSfxodkBpKwZHYx",
      }
    );
  }

  /**
   * Fetches businesses in a geographic area with the categories provided
   * @param {string} location Geographic area to be used when searching
   * @param {Array<string>} categories Categories to filter search results with
   * @returns {Promise<Array<Object>>} Promise with array of business objects
   */
  async fetchBusinessesByCategories(location, categories) {
    return super
      .getData(
        "businesses",
        "searchByCategory",
        [],
        [
          {
            name: "location",
            val: location.replace(/ /g, "%20"),
          },
          ...categories.map((cat) => {
            return {
              name: "categories",
              val: cat,
            };
          }),
          {
            name: "sort_by",
            val: "best_match",
          },
          {
            name: "limit",
            val: "20",
          },
        ]
      )
      .then(super.handleResponse)
      .then((data) => data.businesses)
      .catch((error) => {
        throw {
          title: "Unable to Find Businesses",
          message:
            "There was an error while fetching businesses from the Yelp Fusion API, please try again.",
          details: error,
        };
      });
  }

  /**
   * Fetches a business by it's ID
   * @param {string} id ID of the business
   * @returns {Promise<Object>} Promise with business object
   */
  fetchBusinessById = async (id) =>
    super
      .getData("businesses", "searchById", [id])
      .then(super.handleResponse)
      .catch((error) => {
        throw {
          title: "Unable to Find Business",
          message: "We were unable to find that business, please try again.",
          details: error,
        };
      });
}

/**
 * Communicates with the IGDB API
 * Documentation: https://api-docs.igdb.com/
 * Authentication: Client authorized bearer token
 * Rate Limit:
 *  - 4 requests per second
 *  - 8 open requests at a time
 */
class GamesAPI extends API {
  /**
   * Instantiates a new GamesAPI and sets up client authorization
   */
  constructor() {
    // Calls API class constructor with static properties
    super("IGDB", "https://api.igdb.com/v4/", true, {
      games: {
        method: "POST",
        location: "games/",
      },
    });
    // Sets up client authorization
    this.setClient({
      method: "POST",
      url: () =>
        `https://id.twitch.tv/oauth2/token?client_id=${this.client.id}&client_secret=${this.client.secret}&grant_type=client_credentials`,
      id: "lawi0eumazvfp1qjuk5r4tgt2nx1w2",
      secret: "5wb2rf226eq4m5j6pnds140uzrsnta",
    });
  }

  /**
   * Fetches the genres and themes of the games provided
   * @param {Array<string>} names Names of the games
   * @param {boolean} isExact Specifies if the names are exact
   * @returns {Promise<Array<Object>>} Promise with array of objects with genres and themes arrays
   */
  fetchGameGenresAndThemes = async (names, isExact = false) => {
    // Joins the game names together for the request body
    let joinedNames = names.map((name) => `"${name}"`).join(",");
    return super
      .getDataWithToken(
        "games",
        "",
        [],
        [],
        {},
        `fields genres, themes, slug, keywords; where name = (${joinedNames});`
      )
      .then(super.handleResponse)
      .catch((error) => {
        throw {
          title: `Unable to Find Game${names.length === 0 ? "" : "s"}`,
          message:
            "There was an error while fetching game information from the IGDB API, please try again.",
          details: error,
        };
      });
  };
}

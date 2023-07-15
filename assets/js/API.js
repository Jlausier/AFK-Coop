class API {
  #proxy = "https://floating-headland-95050.herokuapp.com/";

  /**
   * Constructor for generic API class
   * @param {string} baseUrl Base URL of the API
   * @param {boolean} useProxy Whether to use proxy to bypass CORS issues
   * @param {Array<Object>} resources Available resources and their potential parameters
   * @param {string} resources[].location Location of the resource
   * @param {Array<string>} resources[].params Potential parameters for the resource
   * @param {Object} resources[].subResources Additional resources
   */
  constructor(
    baseUrl,
    useProxy,
    resources,
    headerAuth = null,
    apiKey = null,
    client = null
  ) {
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
    this.resources = resources;
    this.headerAuth = headerAuth;
    this.apiKey = apiKey;
    this.client = client;
    this.start = 0;

    if (this.client) {
      this.headerAuth = {
        "Client-ID": this.client.id,
      };
    }
  }

  /**
   * Refreshed auth token if necessary
   */
  async refreshToken() {
    let exp = JSON.parse(localStorage.getItem("token_expiration")) || 0;
    let token = localStorage.getItem("token");
    let currTime = Date.now();

    // Check if stored auth is valid
    if (token && !(typeof token === "undefined") && currTime < exp) {
      this.headerAuth.Authorization = token;
      return new Promise((resolve, _) => resolve("Valid token"));
    } else {
      return fetch(
        this.#proxy +
          this.client.urlConstructor(this.client.id, this.client.secret),
        {
          method: "POST",
        }
      )
        .then((response) => {
          if (!response.ok)
            throw new Error("Response is not ok:", response.status);
          return response.json();
        })
        .then((data) => {
          this.headerAuth.Authorization = "Bearer " + data["access_token"];
          localStorage.setItem(
            "token_expiration",
            JSON.stringify(currTime + data["expires_in"] * 1000)
          );
          localStorage.setItem("token", this.headerAuth.Authorization);
          return "Token refreshed";
        })
        .catch((error) => {
          throw new Error("Could not refresh auth token\n", error);
        });
    }
  }

  /**
   * Construct URL for API call to resource with parameters
   * @param {string} resource Location of the requested resource
   * @param  {Array<Object>} params Additional parameters
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].value Value of the parameter
   * @returns {string} Constructed API URL
   */
  constructUrl(resource, params) {
    let url = "";
    if (this.useProxy) url += this.#proxy;
    url += this.baseUrl + resource;

    if (params.length > 0) {
      url += "?";
      params.forEach((option, index) => {
        if (index !== 0) url += "&";
        url += option.name + "=" + option.val;
      });
    }
    return url;
  }

  /**
   * Construct URP for API call to resource with parameters and API key
   * @param {string} resource Location of the requested resource
   * @param  {Array<Object>} params Additional parameters
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].value Value of the parameter
   * @returns Constructed API URL
   */
  constructUrlWithKey(resource, params) {
    let validParams = params;
    if (
      this.apiKey &&
      this.apiKey.hasOwnProperty("name") &&
      this.apiKey.hasOwnProperty("value")
    ) {
      validParams.push(this.apiKey);
    }
    return this.constructUrl(resource, params);
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
  validateCall(resource, subResource, params = [], subResourceSpecifiers = []) {
    // Validate base resource
    if (!this.resources.hasOwnProperty(resource))
      throw new Error("Selected resource is not available");

    let method = "GET";
    let validResource = this.resources[resource];
    let validResourceLocation = validResource.location;

    if (validResource.hasOwnProperty("method")) method = validResource.method;

    let availableParams = validResource.params || [];
    if (subResource !== "") {
      // Validate subresource
      if (
        !(
          validResource.hasOwnProperty("subResources") &&
          validResource.subResources.hasOwnProperty(subResource)
        )
      )
        throw new Error("Selected subresource is not available");

      let validSubresource = validResource.subResources[subResource];
      // Add subresource's available params
      let availableSubResourceParams = validSubresource.params || [];
      availableParams.push(...availableSubResourceParams);
      // Add resource specifier to location
      validResourceLocation += validSubresource.specifyResource(
        ...subResourceSpecifiers
      );

      if (validSubresource.hasOwnProperty("method"))
        method = validSubresource.method;
    }

    // Get valid params
    let validParams = params.filter((param) => {
      if (!availableParams.includes(param.name)) {
        throw new Error("Parameter not found");
      }
      if (param.val !== "") return param;
    });

    return {
      location: validResourceLocation,
      parameters: validParams,
      method,
    };
  }

  /**
   *
   * @param {string} resource Named resource
   * @param {string} subResource Named subresource
   * @param {function} urlConstructor Method that returns a URL
   * @param {Object} headerOptions Header keys and values
   * @param {Array<Object>} [params=[]] Parameters for the API call
   * @param {string} params[].name Name of the parameter
   * @param {string} params[].val Value of the parameter
   * @returns {Promise<Object>} Generic fetch promise
   * @returns
   */
  async getData(
    resource,
    subResource,
    headerOptions = [],
    body = null,
    params = [],
    subResourceSpecifiers = []
  ) {
    let { location, parameters, method } = this.validateCall(
      resource,
      subResource,
      params,
      subResourceSpecifiers
    );

    let url = this.constructUrl(location, parameters);

    let headers = {
      accept: "application/json",
    };

    Object.keys(headerOptions).forEach((option) => {
      headers[option] = headerOptions[option];
    });

    if (this.headerAuth !== null) {
      Object.keys(this.headerAuth).forEach((key) => {
        headers[key] = this.headerAuth[key];
      });
    }

    return fetch(url, {
      method,
      headers,
      body,
    });
  }

  async getDataWithToken(
    resource,
    subResource,
    body = null,
    params = [],
    subResourceSpecifiers = []
  ) {
    return await this.refreshToken().then(async (res) => {
      return await this.getData(
        resource,
        subResource,
        [],
        body,
        params,
        subResourceSpecifiers
      );
    });
  }
}

class YelpAPI extends API {
  constructor() {
    super(
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

  async fetchBusinessesByCategory(location, categories) {
    return super
      .getData("GET", "businesses", "searchByCategory", {}, null, [
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
      ])
      .then(super.handleResponse)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchBusinessById = async (id) =>
    super
      .getData("businesses", "searchById", {}, null, [], [id])
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
}

class GamesAPI extends API {
  /**
   *
   */
  constructor() {
    super(
      "https://api.igdb.com/v4/",
      true,
      {
        games: {
          method: "POST",
          location: "games/",
        },
        genres: {
          method: "POST",
          location: "genres/",
        },
      },
      null,
      null,
      {
        method: "POST",
        urlConstructor: (id, secret) =>
          `https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`,
        id: "lawi0eumazvfp1qjuk5r4tgt2nx1w2",
        secret: "5wb2rf226eq4m5j6pnds140uzrsnta",
      }
    );
  }

  /**
   *
   * @param  {...string} names
   * @returns {Promise}
   */
  fetchGameGenresByNames = async (...names) => {
    let bodyNames = names
      .map((name) => {
        return `"${name}"`;
      })
      .join(",");
    return super
      .getDataWithToken(
        "games",
        "",
        `fields genres; where name = (${bodyNames});`
      )
      .then(super.handleResponse)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  /**
   *
   * @returns {Promise}
   */
  fetchGenres = async () => {
    return super
      .getDataWithToken("genres", "")
      .then(super.handleResponse)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
}

function mapGenresToCategories(genres) {}

class API {
  #apiKey;
  #headerAuth;
  #proxy = "https://floating-headland-95050.herokuapp.com/";

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
    useProxy,
    resources,
    apiKeyName = null,
    apiKey = null,
    headerAuth = null
  ) {
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
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
  constructUrl(resource, params) {
    let url = "";
    if (this.useProxy) url += this.#proxy;
    url += this.baseUrl + resource;
    let options = [...params];
    if (this.#apiKey && this.apiKeyName)
      params.push(this.apiKeyName + this.#apiKey);

    if (options.length > 0) {
      url += "?";
      options.forEach((option, index) => {
        if (index !== 0) url += "&";
        url += option.name + "=" + option.val;
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
  async fetchResponse(
    resource,
    subResource,
    subResourceSpecifiers = [],
    params = []
  ) {
    // Validate base resource
    if (!this.resources.hasOwnProperty(resource))
      throw new Error("Selected resource is not available");

    let validResource = this.resources[resource];
    let validResourceLocation = validResource.location;

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

      // Add subresource's available params
      let availableSubResourceParams =
        validResource.subResources[subResource].params || [];
      availableParams.push(...availableSubResourceParams);
      // Add resource specifier to location
      validResourceLocation += validResource.subResources[
        subResource
      ].specifyResource(...subResourceSpecifiers);
    }

    // Get valid params
    let validParams = [...params].filter((param) => {
      if (!availableParams.includes(param.name)) {
        throw new Error("Parameter not found");
      }
      if (param.val !== "") return param;
    });
    // Get valid URL
    let url = this.constructUrl(validResourceLocation, validParams);

    // Add headers
    let headers = {
      accept: "application/json",
    };
    // Add header auth
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
      true,
      {
        businesses: {
          location: "businesses/",

          subResources: {
            searchByCategory: {
              specifyResource: () => "search",
              params: ["location", "term", "categories", "sort_by", "limit"],
            },
            searchById: {
              specifyResource: (id) => id,
              params: ["locale"],
            },
          },
        },
      },
      null,
      null,
      {
        Authorization:
          "Bearer NdsssKx2ir8nv7oCjugA6W3xuCcDKf8mWFYBsvGebSjzP2kEvWl08ihRgpQae9YjKprA-rKIG-ndVQorYhOFU2ByUfK_HiliUEIl_Fs1RsWxL4YbAwSfxodkBpKwZHYx",
      }
    );
  }

  fetchBusinessesByCategory = async (location, categories) =>
    super
      .fetchResponse(
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
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });

  fetchBusinessById = async (id) =>
    super.fetchResponse("businesses", "searchById", [id]);
}

/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type { ApiConfig } from "./api.types"
import qs from "query-string"
import { Profile } from "../../models"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  client_id: Config.CLIENT_ID,
  client_secret: Config.CLIENT_SECRET,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  setRequestToken(token: string) {
    this.apisauce.setHeader("Authorization", `Bearer ${token}`)
  }

  async login(body: any): Promise<
    | {
        kind: "ok"
        data: {
          access_token: string
          refresh_token: string
          scope: string
          id_token: string
          token_type: string
          expires_in: number
        }
      }
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post(`/token`, qs.stringify(body), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      return { kind: "ok", data: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getProfile(): Promise<
    | {
        kind: "ok"
        data: Profile
      }
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/membership-service/1.2.0/users/me`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      return { kind: "ok", data: response.data.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getInvoices(
    params: {
      pageNum: number
      pageSize: number
      dateType: string
      sortBy: string
      ordering: string
    },
    orgToken: string,
  ): Promise<
    | {
        kind: "ok"
        data: Profile
      }
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(
      `/invoice-service/1.0.0/invoices`,
      params,
      { headers: { "org-token": orgToken } },
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      return { kind: "ok", data: response.data.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async addInvoice(
    body,
    orgToken: string,
  ): Promise<
    | {
        kind: "ok"
        data: Profile
      }
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post(
      `/invoice-service/2.0.0/invoices`,
      body,
      { headers: { "org-token": orgToken, Operation: "SYNC" } },
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      return { kind: "ok", data: response.data.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()

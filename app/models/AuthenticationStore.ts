import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { api } from "../services/api"
import { ProfileModel } from "./Profile"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    profile: types.maybe(ProfileModel),
    error: types.maybe(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    getProfile: async () => {
      store.error = ""
      const response = await api.getProfile()
      if (response.kind === "ok") {
        store.setProp("profile", response.data)
      } else {
        console.tron.error(`Error login: ${JSON.stringify(response)}`, [])
        if (response.error) {
          store.setProp("error", response.error)
        } else {
          store.setProp("error", "Something went wrong!")
        }
      }
    },
  }))
  .actions((store) => ({
    setApiToken: () => {
      api.setRequestToken(store.authToken)
    },
    login: async ({ email, password }: { email: string; password: string }) => {
      store.error = ""
      const response = await api.login({
        username: email,
        password,
        grant_type: "password",
        scope: "openid",
        client_id: api.config.client_id,
        client_secret: api.config.client_secret,
      })
      if (response.kind === "ok") {
        api.setRequestToken(response.data.access_token)
        store.setProp("authToken", response.data.access_token)
      } else {
        console.tron.error(`Error login: ${JSON.stringify(response)}`, [])
        if (response.error) {
          store.setProp("error", response.error)
        } else {
          store.setProp("error", "Something went wrong!")
        }
      }
    },
    logout() {
      store.authToken = undefined
      store.profile = undefined
      api.setRequestToken("")
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file

import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ProfileModel = types
  .model("Profile")
  .props({
    userId: types.string,
    userName: types.maybe(types.string),
    firstName: types.maybe(types.string),
    lastName: types.maybe(types.string),
    email: types.maybe(types.string),
    status: types.maybe(types.string),
    lastLoginAt: types.maybe(types.string),
    contacts: types.array(types.frozen()),
    addresses: types.array(types.frozen()),
    employmentDetails: types.array(types.frozen()),
    permissions: types.array(types.frozen()),
    memberships: types.array(types.frozen()),
    createdAt: types.maybe(types.string),
    passwordExpired: false,
    updatedAt: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Profile extends Instance<typeof ProfileModel> {}
export interface ProfileSnapshotOut extends SnapshotOut<typeof ProfileModel> {}
export interface ProfileSnapshotIn extends SnapshotIn<typeof ProfileModel> {}
export const createProfileDefaultModel = () => types.optional(ProfileModel, {})

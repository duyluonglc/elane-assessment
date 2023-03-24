import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const InvoiceModel = types
  .model("Invoice")
  .props({
    id: types.maybe(types.string),
    title: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Invoice extends Instance<typeof InvoiceModel> {}
export interface InvoiceSnapshotOut extends SnapshotOut<typeof InvoiceModel> {}
export interface InvoiceSnapshotIn extends SnapshotIn<typeof InvoiceModel> {}
export const createInvoiceDefaultModel = () => types.optional(InvoiceModel, {})

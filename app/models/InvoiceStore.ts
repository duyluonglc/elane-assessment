import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { InvoiceModel } from "./Invoice"

/**
 * Model description here for TypeScript hints.
 */
export const InvoiceStoreModel = types
  .model("InvoiceStore")
  .props({
    invoices: types.array(InvoiceModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async fetchInvoices({
      pageSize = 10,
      pageNum = 1,
      orgToken,
    }: {
      pageSize?: number
      pageNum?: number
      orgToken: string
    }) {
      const response = await api.getInvoices(
        {
          pageNum,
          pageSize,
          dateType: "INVOICE_DATE",
          sortBy: "CREATED_DATE",
          ordering: "ASCENDING",
        },
        orgToken,
      )
      if (response.kind === "ok") {
        self.setProp("invoices", response.invoices)
      } else {
        console.tron.error(`Error fetching episodes: ${JSON.stringify(response)}`, [])
      }
    },
    async addInvoice(invoiceData: any, orgToken: string) {
      const response = await api.addInvoice(invoiceData, orgToken)
      if (response.kind === "ok") {
        return null
      } else {
        console.tron.error(`Error fetching episodes: ${JSON.stringify(response)}`, [])
        return "Error while adding invoice"
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface InvoiceStore extends Instance<typeof InvoiceStoreModel> {}
export interface InvoiceStoreSnapshotOut extends SnapshotOut<typeof InvoiceStoreModel> {}
export interface InvoiceStoreSnapshotIn extends SnapshotIn<typeof InvoiceStoreModel> {}
export const createInvoiceStoreDefaultModel = () => types.optional(InvoiceStoreModel, {})

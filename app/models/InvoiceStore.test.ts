import { InvoiceStoreModel } from "./InvoiceStore"

test("can be created", () => {
  const instance = InvoiceStoreModel.create({})

  expect(instance).toBeTruthy()
})

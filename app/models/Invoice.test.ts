import { InvoiceModel } from "./Invoice"

test("can be created", () => {
  const instance = InvoiceModel.create({})

  expect(instance).toBeTruthy()
})

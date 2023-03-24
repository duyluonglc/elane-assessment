import { ProfileModel } from "./Profile"

test("can be created", () => {
  const instance = ProfileModel.create({})

  expect(instance).toBeTruthy()
})

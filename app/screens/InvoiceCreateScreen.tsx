// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://infinitered.github.io/ignite-cookbook/docs/MigratingToFlashList
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { useHeader } from "../utils/useHeader"

import { faker } from "@faker-js/faker"

// import { Formik } from "formik"
// import * as Yup from "yup"

// const validationSchema = Yup.object().shape({
//   firstName: Yup.string().required("First name address is required"),
//   lasttName: Yup.string().required("Last name address is required"),
// })

interface InvoiceCreateScreenProps extends AppStackScreenProps<"InvoiceList"> {}

export const InvoiceCreateScreen: FC<InvoiceCreateScreenProps> = observer(
  function InvoiceCreateScreen(_props) {
    const {
      invoiceStore: { addInvoice, fetchInvoices },
      authenticationStore: { profile },
    } = useStores()

    const invoiceData = {
      bankAccount: {
        bankId: "",
        sortCode: "09-01-01",
        accountNumber: faker.finance.account(8),
        accountName: faker.name.fullName(),
      },
      customer: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        contact: {
          email: faker.internet.email(),
          mobileNumber: faker.phone.number(),
        },
        addresses: [
          {
            premise: "CT11",
            countryCode: faker.address.countryCode(),
            postcode: faker.address.zipCode(),
            county: faker.address.county(),
            city: faker.address.city(),
          },
        ],
      },
      documents: [
        {
          documentId: faker.random.alphaNumeric(20),
          documentName: faker.name.fullName(),
          documentUrl: faker.internet.url(),
        },
      ],
      invoiceReference: "#" + faker.random.numeric(10).toString(),
      invoiceNumber: "INV" + faker.random.numeric(10).toString(),
      currency: faker.finance.currencyName(),
      invoiceDate: faker.date.past(),
      dueDate: faker.date.future(),
      description: faker.lorem.paragraph(),
      customFields: [
        {
          key: "invoiceCustomField",
          value: "value",
        },
      ],
      extensions: [
        {
          addDeduct: "ADD",
          value: 10,
          type: "PERCENTAGE",
          name: "tax",
        },
        {
          addDeduct: "DEDUCT",
          type: "FIXED_VALUE",
          value: 10.0,
          name: "discount",
        },
      ],
      items: [
        {
          itemReference: faker.random.alphaNumeric(10),
          description: faker.lorem.paragraph(),
          quantity: faker.random.numeric(2),
          rate: faker.random.numeric(3),
          itemName: faker.vehicle.vehicle(),
          itemUOM: "KG",
          customFields: [
            {
              key: "taxiationAndDiscounts_Name",
              value: "VAT",
            },
          ],
          extensions: [
            {
              addDeduct: "ADD",
              value: 10,
              type: "FIXED_VALUE",
              name: "tax",
            },
            {
              addDeduct: "DEDUCT",
              value: 10,
              type: "PERCENTAGE",
              name: "tax",
            },
          ],
        },
      ],
    }

    const { navigation } = _props

    useHeader({
      leftIcon: "back",
      onLeftPress: navigation.goBack,
      title: "Add Invoice",
    })

    const handleSubmit = async () => {
      const error = await addInvoice(
        {
          listOfInvoices: [invoiceData],
        },
        profile.memberships[0]?.organisationId || "",
      )
      if (!error) {
        fetchInvoices({ orgToken: profile.memberships[0]?.organisationId || "" })
        navigation.goBack()
      }
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ScrollView>
          <Text>{JSON.stringify(invoiceData, null, 2)}</Text>
        </ScrollView>
        <Button
          testID="login-button"
          text="Save invoice"
          // style={$tapButton}
          preset="reversed"
          onPress={handleSubmit}
        />
      </Screen>
    )
  },
)

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

// #endregion

// @demo remove-file

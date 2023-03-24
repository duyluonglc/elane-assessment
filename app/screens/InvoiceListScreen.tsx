// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://infinitered.github.io/ignite-cookbook/docs/MigratingToFlashList
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Card, EmptyState, Screen, Text } from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { Invoice } from "../models/invoice"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { useHeader } from "../utils/useHeader"

const rnrImage1 = require("../../assets/images/rnr-image-1.png")
const rnrImage2 = require("../../assets/images/rnr-image-2.png")
const rnrImage3 = require("../../assets/images/rnr-image-3.png")
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]

interface InvoiceListScreenProps extends AppStackScreenProps<"InvoiceList"> {}

export const InvoiceListScreen: FC<InvoiceListScreenProps> = observer(function InvoiceListScreen(
  _props,
) {
  const {
    invoiceStore,
    authenticationStore: { logout, profile, setApiToken, getProfile },
  } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const { navigation } = _props
  const navigateToCreateInvoice = () => navigation.navigate("InvoiceCreate")

  useHeader({
    leftTx: "common.logOut",
    onLeftPress: logout,
    rightText: "Add invoice",
    onRightPress: navigateToCreateInvoice,
    title: "Invoice list",
  })

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    setApiToken()
    async function load() {
      setIsLoading(true)
      await invoiceStore.fetchInvoices({ orgToken: profile.memberships[0]?.organisationId || "" })
      setIsLoading(false)
    }
    if (profile) {
      load()
    } else {
      getProfile()
    }
  }, [invoiceStore, profile])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([
      invoiceStore.fetchInvoices({ orgToken: profile.memberships[0]?.organisationId || "" }),
      delay(750),
    ])
    setRefreshing(false)
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <FlatList<Invoice>
        data={invoiceStore.invoices}
        contentContainerStyle={$flatListContentContainer}
        refreshing={refreshing}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              heading="No data available"
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        renderItem={({ item }) => <InvoiceCard key={item.id} invoice={item} />}
      />
    </Screen>
  )
})

const InvoiceCard = observer(function invoiceCard({ invoice }: { invoice: Invoice }) {
  const imageUri = useMemo(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)]
  }, [])

  // const handlePressCard = () => {
  //   openLinkInBrowser(invoice.link)
  // }

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      // onPress={handlePressCard}
      // onLongPress={handlePressFavorite}
      HeadingComponent={
        <View style={$metadata}>
          <Text style={$metadataText} size="xxs">
            {invoice.title}
          </Text>
        </View>
      }
      content={`${invoice.title}`}
      RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  // paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
}

const $item: ViewStyle = {
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.extraSmall,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.medium,
  marginBottom: spacing.extraSmall,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion

// @demo remove-file

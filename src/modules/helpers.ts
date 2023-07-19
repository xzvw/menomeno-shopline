import { BundleRow } from './parsers'

export type BundleItemMap = Record<
  string, // bundleName
  Array<Partial<{
    itemName: string
    itemNumber: string
    itemQuantity: number
    itemNote: string
  }>>
>

// @see `type BundleRow`
export function buildBundleItemMap(bundlesJson: Array<BundleRow>): BundleItemMap {
  const bundleItemMap: BundleItemMap = {}

  let currentBundleName = null
  let currentBundleNote = null

  // ignore the first row
  for (let i = 1; i < bundlesJson.length; i++) {
    const row = bundlesJson[i]

    if (row['商品編號欄位']) {
      // it's a new bundle
      currentBundleName = String(row['商品編號欄位'])
      currentBundleNote = String(row['請忽略'])
    }

    if (currentBundleName) {
      if (!(currentBundleName in bundleItemMap)) {
        bundleItemMap[currentBundleName] = []
      }

      bundleItemMap[currentBundleName].push({
        itemName: String(row.__EMPTY_1),
        itemNote: currentBundleNote || '',
        itemNumber: String(row['組合內容']),
        itemQuantity: Number(row['數量']),
      })
    }
  }

  return bundleItemMap
}

export function isSevenElevenStore(name?: string) {
  return typeof name === 'string' && name.startsWith('7-11')
}

export function isFamilyStore(name?: string) {
  return typeof name === 'string' && name.startsWith('全家')
}

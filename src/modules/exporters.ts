import XLSX from 'xlsx'
import { BundleItemMap, isFamilyStore, isSevenElevenStore } from './helpers'
import { OrderRow } from './parsers'

type DataToExport = {
  ordersJson: Array<OrderRow>
  bundleItemMap: BundleItemMap
  orderDate: string
}

export function exportToSevenElevenFormat(dataToExport: DataToExport) {
  const { ordersJson, bundleItemMap, orderDate } = dataToExport

  const newWorkBook = XLSX.utils.book_new()

  const filteredOrders = ordersJson.filter((row) =>
    isSevenElevenStore(row['門市名稱'])
  )

  const bundleExpandedOrders = []
  for (const row of filteredOrders) {
    const commonColumns = {
      訂單號碼: String(row['訂單編號']),
      訂單日期: orderDate,
      收件人: String(row['姓名']),
      收件人電話號碼: String(row['手機']),
      送貨方式: '711店配',
      // 訂單備註
      // 商品貨號
      // 商品名稱
      選項: '',
      // 數量
      完整地址: '台灣',
      門市名稱: String(row['門市名稱']),
      送貨編號: String(row['物流編號']),
      '全家服務編號 / 7-11 店號': String(row['門市代號']),
    }

    if (row['商品編號'] in bundleItemMap) {
      bundleItemMap[row['商品編號']].forEach((expandedBundle) => {
        bundleExpandedOrders.push({
          ...commonColumns,
          訂單備註: expandedBundle.itemNote || '',
          商品貨號: expandedBundle.itemNumber || '',
          商品名稱: expandedBundle.itemName || '',
          數量: typeof expandedBundle.itemQuantity === 'number' && Number.isFinite(Number(row['數量']))
            ? String(expandedBundle.itemQuantity * Number(row['數量']))
            : '發生錯誤',
        })
      })
    } else {
      bundleExpandedOrders.push({
        ...commonColumns,
        訂單備註: '',
        商品貨號: String(row['商品編號']),
        商品名稱: String(row['商品名稱']),
        數量: String(row['數量']),
      })
    }
  }

  XLSX.utils.book_append_sheet(
    newWorkBook,
    XLSX.utils.json_to_sheet(bundleExpandedOrders, {
      header: [
        '訂單號碼',
        '訂單日期',
        '收件人',
        '收件人電話號碼',
        '送貨方式',
        '訂單備註',
        '商品貨號',
        '商品名稱',
        '選項',
        '數量',
        '完整地址',
        '門市名稱',
        '送貨編號',
        '全家服務編號 / 7-11 店號',
      ],
    })
  )
  XLSX.writeFileXLSX(newWorkBook, '711出貨.xlsx')
}

export function exportToFamilyFormat(dataToExport: DataToExport) {
  const { ordersJson, bundleItemMap, orderDate } = dataToExport

  const newWorkBook = XLSX.utils.book_new()

  const filteredOrders = ordersJson.filter((row) =>
    isFamilyStore(row['門市名稱'])
  )

  const bundleExpandedOrders = []
  for (const row of filteredOrders) {
    const commonColumns = {
      訂單號碼: String(row['訂單編號']),
      訂單日期: orderDate,
      收件人: String(row['姓名']),
      收件人電話號碼: String(row['手機']),
      送貨方式: '全家店配',
      // 訂單備註
      // 商品貨號
      // 商品名稱
      選項: '',
      // 數量
      完整地址: '台灣',
      門市名稱: String(row['門市名稱']),
      送貨編號: String(row['物流編號']),
      '全家服務編號 / 7-11 店號': String(row['門市代號']),
    }

    if (row['商品編號'] in bundleItemMap) {
      bundleItemMap[row['商品編號']].forEach((expandedBundle) => {
        bundleExpandedOrders.push({
          ...commonColumns,
          訂單備註: expandedBundle.itemNote || '',
          商品貨號: expandedBundle.itemNumber || '',
          商品名稱: expandedBundle.itemName || '',
          數量: typeof expandedBundle.itemQuantity === 'number' && Number.isFinite(Number(row['數量']))
            ? String(expandedBundle.itemQuantity * Number(row['數量']))
            : '發生錯誤',
        })
      })
    } else {
      bundleExpandedOrders.push({
        ...commonColumns,
        訂單備註: '',
        商品貨號: String(row['商品編號']),
        商品名稱: String(row['商品名稱']),
        數量: String(row['數量']),
      })
    }
  }

  XLSX.utils.book_append_sheet(
    newWorkBook,
    XLSX.utils.json_to_sheet(bundleExpandedOrders, {
      header: [
        '訂單號碼',
        '訂單日期',
        '收件人',
        '收件人電話號碼',
        '送貨方式',
        '訂單備註',
        '商品貨號',
        '商品名稱',
        '選項',
        '數量',
        '完整地址',
        '門市名稱',
        '送貨編號',
        '全家服務編號 / 7-11 店號',
      ],
    })
  )
  XLSX.writeFileXLSX(newWorkBook, '全家出貨.xlsx')
}

export function exportToHomeDeliveryFormat(dataToExport: DataToExport) {
  const { ordersJson, bundleItemMap, orderDate } = dataToExport

  const newWorkBook = XLSX.utils.book_new()

  const filteredOrders = ordersJson.filter((row) => !isSevenElevenStore(row['門市名稱']) && !isFamilyStore(row['門市名稱']))

  const bundleExpandedOrders = []
  for (const row of filteredOrders) {
    const commonColumns = {
      訂單號碼: String(row['訂單編號']),
      訂單日期: orderDate,
      收件人: String(row['姓名']),
      收件人電話號碼: String(row['手機']),
      送貨方式: '宅配',
      出貨備註: '',
      // 訂單備註
      // 商品貨號
      // 商品名稱
      選項: '',
      // 數量
      代收款: '',
      完整地址: String(row['地址']),
    }

    if (row['商品編號'] in bundleItemMap) {
      bundleItemMap[row['商品編號']].forEach((expandedBundle) => {
        bundleExpandedOrders.push({
          ...commonColumns,
          訂單備註: expandedBundle.itemNote || '',
          商品貨號: expandedBundle.itemNumber || '',
          商品名稱: expandedBundle.itemName || '',
          數量: typeof expandedBundle.itemQuantity === 'number' && Number.isFinite(Number(row['數量']))
            ? String(expandedBundle.itemQuantity * Number(row['數量']))
            : '發生錯誤',
        })
      })
    } else {
      bundleExpandedOrders.push({
        ...commonColumns,
        訂單備註: '',
        商品貨號: String(row['商品編號']),
        商品名稱: String(row['商品名稱']),
        數量: String(row['數量']),
      })
    }
  }

  XLSX.utils.book_append_sheet(
    newWorkBook,
    XLSX.utils.json_to_sheet(bundleExpandedOrders, {
      header: [
        '訂單號碼',
        '訂單日期',
        '收件人',
        '收件人電話號碼',
        '送貨方式',
        '出貨備註',
        '訂單備註',
        '商品貨號',
        '商品名稱',
        '選項',
        '數量',
        '代收款',
        '完整地址',
      ],
    })
  )
  XLSX.writeFileXLSX(newWorkBook, '宅配出貨.xlsx')
}

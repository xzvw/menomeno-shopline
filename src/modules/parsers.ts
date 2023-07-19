import XLSX from 'xlsx'

export type OrderRow = Partial<
  Record<
    | '訂單編號'
    | '商品編號'
    | '商品名稱'
    | '數量'
    | '姓名'
    | '手機'
    | '地址'
    | '門市代號'
    | '門市名稱'
    | '物流編號',
    any
  >
>

// @see `BundleItemMap`
export type BundleRow = Partial<
  Record<
    | '請忽略' // itemNote, 訂單備註
    | '商品編號欄位' // bundleName
    | '組合內容' // itemNumber
    | '__EMPTY_1' // itemName
    | '數量', // itemQuantity
    any
  >
>

export async function parseFileToJson<T>(file: File) {
  const data = await file.arrayBuffer()
  const workBook = XLSX.read(data)
  const firstSheet = workBook.Sheets[workBook.SheetNames[0]]
  const json = XLSX.utils.sheet_to_json<T>(firstSheet)

  return json
}

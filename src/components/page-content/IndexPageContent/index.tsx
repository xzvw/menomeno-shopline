import { exportToFamilyFormat, exportToHomeDeliveryFormat, exportToSevenElevenFormat } from 'modules/exporters'
import { buildBundleItemMap, BundleItemMap } from 'modules/helpers'
import { BundleRow, OrderRow, parseFileToJson } from 'modules/parsers'
import { ChangeEventHandler, useEffect, useState } from 'react'
import styles from './IndexPageContent.module.scss'

function IndexPageContent() {
  const [ordersFile, setOrdersFile] = useState<File | null>(null) // 原始訂單
  const [bundlesFile, setBundlesFile] = useState<File | null>(null) // 商品組合
  const [orderDate, setOrderDate] = useState(new Date().toLocaleDateString('zh-TW'))

  const [bundleItemMap, setBundleItemMap] = useState<BundleItemMap | null>(null)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)

  const isFilesReady = ordersFile && bundlesFile
  const isBundleItemMapReady = bundleItemMap && Object.keys(bundleItemMap).length > 0
  const isButtonDisabled = !isFilesReady || !isBundleItemMapReady

  useEffect(() => {
    if (bundlesFile) {
      parseFileToJson<BundleRow>(bundlesFile).then((bundlesJson) => {
        setBundleItemMap(buildBundleItemMap(bundlesJson))
      })
    }
  }, [bundlesFile])

  useEffect(() => {
    const validate = async () => {
      if (!ordersFile) {
        setValidationMessage('未選擇「原始訂單 Excel 檔案」，請回到第一步選擇檔案。')
        return
      }

      if (!bundlesFile) {
        setValidationMessage('未選擇「商品組合 Excel 檔案」，請回到第二步選擇檔案。')
        return
      }

      if (!isBundleItemMapReady) {
        setValidationMessage('讀取「商品組合 Excel 檔案」失敗，請回到第二步重新選擇檔案。')
      } else {
        setValidationMessage('以下為讀取「商品組合 Excel 檔案」之結果，請檢查資料是否正確。')
      }
    }

    validate()
  }, [bundlesFile, isBundleItemMapReady, ordersFile])

  const onOrdersInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target

    if (files && files.length > 0) {
      setOrdersFile(files[0])
    }
  }

  const onBundlesInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target

    if (files && files.length > 0) {
      setBundlesFile(files[0])
    }
  }

  const exportWorkBooks = async (target: Array<'seven-eleven' | 'family' | 'home-delivery'>) => {
    if (!isFilesReady) {
      return
    }

    const ordersJson = await parseFileToJson<OrderRow>(ordersFile)

    if (!isBundleItemMapReady) {
      alert('讀取「商品組合 Excel 檔案」失敗，請回到第二步重新選擇檔案。')
      return
    }

    console.log('ordersJson', ordersJson)
    console.log('bundleItemMap', bundleItemMap)
    const dataToExport = { ordersJson, bundleItemMap, orderDate }
    if (target.includes('seven-eleven')) {
      exportToSevenElevenFormat(dataToExport)
    }
    if (target.includes('family')) {
      exportToFamilyFormat(dataToExport)
    }
    if (target.includes('home-delivery')) {
      exportToHomeDeliveryFormat(dataToExport)
    }
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.section}>
          <div className={styles.heading}>匯出出貨 Excel 檔案 (SHOPLINE)</div>
          <div className={styles.inputRow}>
            <label htmlFor="orders-input">第一步：選擇原始訂單 Excel 檔案</label>
            <input
              type="file"
              id="orders-input"
              accept=".xls, .xlsx"
              onChange={onOrdersInputChange}
            />
          </div>
          <div className={styles.inputRow}>
            <label htmlFor="bundles-input">第二步：選擇商品組合 Excel 檔案</label>
            <input
              type="file"
              id="bundles-input"
              accept=".xls, .xlsx"
              onChange={onBundlesInputChange}
            />
          </div>
          <div className={styles.inputRow}>
            <label htmlFor="order-date-input">第三步：訂單日期</label>
            <input
              id="order-date-input"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
            <small>顯示於 711、全家出貨檔案中的「訂單日期」欄位。</small>
          </div>
          <div className={styles.buttonGroup}>
            <button
              disabled={isButtonDisabled}
              onClick={() => exportWorkBooks(['seven-eleven', 'family', 'home-delivery'])}
            >
              匯出全部
            </button>
            <button
              disabled={isButtonDisabled}
              onClick={() => exportWorkBooks(['seven-eleven'])}
            >
              匯出「711」出貨
            </button>
            <button
              disabled={isButtonDisabled}
              onClick={() => exportWorkBooks(['family'])}
            >
              匯出「全家」出貨
            </button>
            <button
              disabled={isButtonDisabled}
              onClick={() => exportWorkBooks(['home-delivery'])}
            >
              匯出「宅配」出貨
            </button>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.heading}>提示 / 除錯訊息</div>
          <div className={styles.validationMessage}>{validationMessage}</div>
          {isBundleItemMapReady && (
            <pre>{JSON.stringify(bundleItemMap, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default IndexPageContent

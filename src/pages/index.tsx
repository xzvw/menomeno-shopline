import IndexPageContent from 'components/page-content/IndexPageContent'
import Head from 'next/head'

function IndexPage() {
  return (
    <>
      <Head>
        <title>匯出出貨 Excel 檔案 (SHOPLINE)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IndexPageContent />
    </>
  )
}

export default IndexPage

import React from 'react'
import axios from 'axios'

export const PdfTest = () => {
  const [pdfBytes, setPdfBytes] = React.useState<any>('')

  React.useEffect(() => {
    ;(async () => {
      const res = await axios.get(
        'http://127.0.0.1:5000/invoice?partner=alpha&start_date=2022-01-01&end_date=2022-01-07',
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      )
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      )
      setPdfBytes(url)
    })()
  }, [])

  return pdfBytes ? (
    <a href={pdfBytes} target="_blank" rel="noreferrer">
      pdf review
    </a>
  ) : (
    'Loading'
  )
}

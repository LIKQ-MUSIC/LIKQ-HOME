'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer'
import { pdf } from '@react-pdf/renderer'
import { Eye, FileDown } from 'lucide-react'
import parse, { domToReact } from 'html-react-parser'
import { useState } from 'react'

// Register Thai Font
Font.register({
  family: 'TH Sarabun New',
  fonts: [
    { src: '/fonts/THSarabunNew.ttf' },
    { src: '/fonts/THSarabunNew-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/THSarabunNew-Italic.ttf', fontStyle: 'italic' },
    {
      src: '/fonts/THSarabunNew-BoldItalic.ttf',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 16,
    fontFamily: 'TH Sarabun New'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  contractNumber: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    marginTop: 15,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  text: {
    marginBottom: 4,
    lineHeight: 1.5
  },
  party: {
    marginBottom: 8,
    paddingLeft: 10
  },
  signatureSection: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
    gap: 30
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center'
  }
})

export interface ContractPDFProps {
  contract: {
    contract_number: string
    title: string
    origin: string
    current_status: string
    parties?: Array<{
      legal_name: string
      display_name?: string
      role: string
      sign_label?: string
    }>
    latest_version?: {
      content_text: string
    }
  }
}

// Convert HTML Content to ReactPDF Components
const HtmlContent = ({ html }: { html: string }) => {
  const options = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag') {
        // Dynamic Table Column Width Calculation
        if (domNode.name === 'tr' && domNode.children) {
          const cells = domNode.children.filter(
            (c: any) => c.name === 'td' || c.name === 'th'
          )
          if (cells.length > 0) {
            const widthPercent = 100 / cells.length
            cells.forEach((cell: any) => {
              cell.widthPercent = widthPercent
            })
          }
        }

        // List Pre-processing (Ordered Lists)
        if (domNode.name === 'ol' && domNode.children) {
          let index = 1
          domNode.children.forEach((c: any) => {
            if (c.name === 'li') {
              c.isOrdered = true
              c.index = index++
            }
          })
        }

        const children = domToReact(domNode.children, options)

        switch (domNode.name) {
          case 'p':
            return <Text style={styles.text}>{children}</Text>
          case 'strong':
          case 'b':
            return <Text style={{ fontWeight: 'bold' }}>{children}</Text>
          case 'em':
          case 'i':
            return <Text style={{ fontStyle: 'italic' }}>{children}</Text>
          case 'u':
            return (
              <Text style={{ textDecoration: 'underline' }}>{children}</Text>
            )
          case 'h1':
            return (
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  marginTop: 12
                }}
              >
                {children}
              </Text>
            )
          case 'h2':
            return (
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  marginTop: 10
                }}
              >
                {children}
              </Text>
            )
          case 'h3':
            return (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 6,
                  marginTop: 8
                }}
              >
                {children}
              </Text>
            )
          case 'ul':
            return (
              <View style={{ marginLeft: 15, marginBottom: 5 }}>
                {children}
              </View>
            )
          case 'ol':
            return (
              <View style={{ marginLeft: 15, marginBottom: 5 }}>
                {children}
              </View>
            )
          case 'li':
            const bullet = domNode.isOrdered ? `${domNode.index}. ` : '• '
            return (
              <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={{ width: 20 }}>{bullet}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, lineHeight: 1.5 }}>
                    {children}
                  </Text>
                </View>
              </View>
            )

          // Table Implementation using Flexbox
          case 'table':
            return (
              <View
                style={{
                  width: '100%',
                  marginVertical: 10,
                  borderTopWidth: 0.5,
                  borderLeftWidth: 0.5,
                  borderColor: '#000'
                }}
              >
                {children}
              </View>
            )
          case 'tr':
            return (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.5,
                  borderColor: '#000',
                  minHeight: 24
                }}
              >
                {children}
              </View>
            )
          case 'td':
            return (
              <View
                style={{
                  width: domNode.widthPercent
                    ? `${domNode.widthPercent}%`
                    : 'auto',
                  flexGrow: domNode.widthPercent ? 0 : 1,
                  padding: 4,
                  borderRightWidth: 0.5,
                  borderColor: '#000'
                }}
              >
                <Text style={{ fontSize: 14 }}>{children}</Text>
              </View>
            )
          case 'th':
            return (
              <View
                style={{
                  width: domNode.widthPercent
                    ? `${domNode.widthPercent}%`
                    : 'auto',
                  flexGrow: domNode.widthPercent ? 0 : 1,
                  padding: 4,
                  borderRightWidth: 0.5,
                  borderColor: '#000',
                  backgroundColor: '#f5f5f5'
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {children}
                </Text>
              </View>
            )

          case 'br':
            return <Text>{'\n'}</Text>
          default:
            return <Text>{children}</Text>
        }
      }

      // Handle text nodes
      if (domNode.type === 'text') {
        return <Text>{domNode.data}</Text>
      }
    }
  }

  return <View>{parse(html, options)}</View>
}

const SignatureItem = ({ label, name }: { label: string; name?: string }) => (
  <View style={styles.signatureBox}>
    {/* Signature Line */}
    <View
      style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 }}
    >
      <Text>(ลงชื่อ)</Text>
      <Text
        style={{
          borderBottomWidth: 1,
          borderColor: '#000',
          width: 120,
          marginHorizontal: 4,
          textAlign: 'center'
        }}
      >
        {' '}
      </Text>
      <Text>{label}</Text>
    </View>

    {/* Name Line */}
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text>(</Text>
      <Text style={{ width: 160, textAlign: 'center', marginHorizontal: 4 }}>
        {name || '                                          '}
      </Text>
      <Text>)</Text>
    </View>
  </View>
)

export const ContractPDF = ({ contract }: ContractPDFProps) => {
  const getPartyNameByRole = (role: string) => {
    const party = contract.parties?.find(p => p.role === role)
    return party ? party.display_name || party.legal_name : undefined
  }

  const getLegalNameByRole = (role: string) => {
    const party = contract.parties?.find(p => p.role === role)
    return party ? party.legal_name : undefined
  }

  const employer = getLegalNameByRole('ผู้ว่าจ้าง')
  const contractor = getLegalNameByRole('ผู้รับจ้าง')
  const witness1 = getLegalNameByRole('พยาน 1')
  const witness2 = getLegalNameByRole('พยาน 2')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{contract.title}</Text>
          <Text style={styles.contractNumber}>
            เลขที่สัญญา: {contract.contract_number}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลสัญญา</Text>
          <Text style={styles.text}>
            ประเภท: {contract.origin === 'Internal' ? 'ภายใน' : 'ภายนอก'}
          </Text>
          <Text style={styles.text}>สถานะ: {contract.current_status}</Text>
        </View>

        {contract.parties && contract.parties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>คู่สัญญา</Text>
            {contract.parties.map((party, idx) => (
              <View key={idx} style={styles.party}>
                <Text style={styles.text}>
                  {party.display_name || party.legal_name}{' '}
                  {party.role ? `(${party.role})` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {contract.latest_version?.content_text && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>รายละเอียดข้อตกลง</Text>
            <HtmlContent html={contract.latest_version.content_text} />
          </View>
        )}

        {/* Dynamic Signature Section */}
        <View style={styles.signatureSection} wrap={false}>
          <View style={styles.signatureRow}>
            <SignatureItem label="ผู้ว่าจ้าง" name={employer} />
            <SignatureItem label="ผู้รับจ้าง" name={contractor} />
          </View>
          <View style={styles.signatureRow}>
            <SignatureItem label="พยาน" name={witness1} />
            <SignatureItem label="พยาน" name={witness2} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

interface PDFExportButtonProps {
  contract: ContractPDFProps['contract']
  disabled?: boolean
}

export default function PDFExportButton({
  contract,
  disabled
}: PDFExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePreview = async () => {
    try {
      setLoading(true)
      const blob = await pdf(<ContractPDF contract={contract} />).toBlob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      console.error('PDF Generation failed:', error)
      alert('Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handlePreview}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? (
        <FileDown size={18} className="animate-bounce" />
      ) : (
        <Eye size={18} />
      )}
      <span>{loading ? 'Generating...' : 'Preview PDF'}</span>
    </button>
  )
}

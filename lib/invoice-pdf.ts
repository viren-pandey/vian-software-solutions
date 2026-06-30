import PDFDocument from 'pdfkit'
import { PassThrough } from 'stream'
import { prisma } from './prisma'

export interface InvoicePdfData {
  invoiceNumber: string
  issuedAt: Date
  amount: number
  status: string
  userName: string
  userEmail: string
  userCompanyName?: string | null
  userPhone?: string | null
  userBillingAddress?: Record<string, any> | null
  quotationTitle?: string | null
  quotationDescription?: string | null
  description?: string | null
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function drawTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: string[][],
  startY: number,
  colWidths: number[],
  options?: { fontSize?: number; headerColor?: string; rowColor?: string }
): number {
  const { fontSize = 9, headerColor = '#1f2937', rowColor = '#374151' } = options || {}
  const rowHeight = 22
  const xStart = 50
  let y = startY

  // Header row
  doc.font('Helvetica-Bold').fontSize(fontSize).fillColor(headerColor)
  let x = xStart
  headers.forEach((header, i) => {
    doc.text(header, x, y, { width: colWidths[i], align: i === 0 ? 'left' : 'right' })
    x += colWidths[i]
  })
  y += rowHeight

  // Header underline
  doc.moveTo(xStart, y - 2).lineTo(xStart + colWidths.reduce((a, b) => a + b, 0), y - 2).strokeColor('#e5e7eb').stroke()
  y += 4

  // Data rows
  doc.font('Helvetica').fontSize(fontSize).fillColor(rowColor)
  rows.forEach((row, rowIndex) => {
    if (y > 700) {
      doc.addPage()
      y = 50
    }
    x = xStart
    row.forEach((cell, i) => {
      doc.text(cell, x, y, { width: colWidths[i], align: i === 0 ? 'left' : 'right' })
      x += colWidths[i]
    })
    y += rowHeight
    if (rowIndex % 2 === 0) {
      doc.rect(xStart, y - rowHeight, colWidths.reduce((a, b) => a + b, 0), rowHeight)
        .fillColor('#f9fafb').fill()
    }
  })

  return y + 10
}

export async function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      const chunks: Buffer[] = []
      const stream = new PassThrough()

      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)

      doc.pipe(stream)

      // Header
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#1f2937').text('INVOICE', { align: 'center' })
      doc.moveDown(0.3)
      doc.fontSize(10).font('Helvetica').fillColor('#6b7280').text('VIAN SOFTWARE SOLUTIONS', { align: 'center' })
      doc.fontSize(8).text('(Sole Proprietorship of Viren Pandey)', { align: 'center' })
      doc.moveDown(1.5)

      // Invoice details
      doc.fillColor('#1f2937').fontSize(11)
      doc.font('Helvetica-Bold').text('Invoice #: ', { continued: true })
      doc.font('Helvetica').text(data.invoiceNumber)
      doc.font('Helvetica-Bold').text('Date: ', { continued: true })
      doc.font('Helvetica').text(formatDate(data.issuedAt))
      doc.font('Helvetica-Bold').text('Status: ', { continued: true })
      doc.font('Helvetica').text(data.status.toUpperCase())
      doc.moveDown(1)

      // Client details
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('Bill To')
      doc.moveDown(0.3)
      doc.fontSize(10).font('Helvetica').fillColor('#374151')
      doc.text(data.userName)
      if (data.userCompanyName) doc.text(data.userCompanyName)
      doc.text(data.userEmail)
      if (data.userPhone) doc.text(data.userPhone)
      if (data.userBillingAddress) {
        const addr = data.userBillingAddress
        if (addr.street) doc.text(addr.street)
        if (addr.city) doc.text(`${addr.city}${addr.state ? ', ' + addr.state : ''}${addr.postalCode ? ' ' + addr.postalCode : ''}`)
        if (addr.country) doc.text(addr.country)
      }
      doc.moveDown(1.5)

      // Project/Quotation details
      if (data.quotationTitle) {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('Project Details')
        doc.moveDown(0.3)
        doc.fontSize(10).font('Helvetica').fillColor('#374151')
        doc.text(`Project: ${data.quotationTitle}`)
        if (data.quotationDescription) {
          doc.moveDown(0.3)
          doc.text(`Description: ${data.quotationDescription}`)
        }
        doc.moveDown(1)
      } else if (data.description) {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('Description')
        doc.moveDown(0.3)
        doc.fontSize(10).font('Helvetica').fillColor('#374151')
        doc.text(data.description)
        doc.moveDown(1)
      }

      // Amount due
      doc.moveDown(0.5)
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#1f2937').text('Amount Due')
      doc.moveDown(0.3)
      doc.font('Helvetica').fontSize(28).fillColor('#059669').text(formatINR(data.amount))
      doc.moveDown(2)

      // Footer
      doc.fontSize(8).fillColor('#9ca3af')
      doc.text('Vian Software Solutions', { align: 'center' })
      doc.text('Sole Proprietorship of Viren Pandey', { align: 'center' })
      doc.text('Mumbai, Maharashtra, India', { align: 'center' })
      doc.moveDown(0.5)
      doc.text('Payment is due within 15 days of invoice date.', { align: 'center' })
      doc.text('Thank you for your business!', { align: 'center' })

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

export async function generateAndStoreInvoicePdf(invoiceId: string): Promise<string | null> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: { include: { profile: true } },
        quotation: { select: { title: true, description: true } },
      },
    })

    if (!invoice) {
      console.error('[PDF] Invoice not found:', invoiceId)
      return null
    }

    const user = invoice.user
    const profile = user.profile
    const billingAddress = (profile?.billingAddress as Record<string, any> | null) || null

    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      issuedAt: invoice.issuedAt,
      amount: Number(invoice.amount),
      status: invoice.status,
      userName: user.name,
      userEmail: user.email,
      userCompanyName: billingAddress?.companyName || null,
      userPhone: billingAddress?.phone || null,
      userBillingAddress: billingAddress,
      quotationTitle: invoice.quotation?.title || null,
      quotationDescription: invoice.quotation?.description || null,
      description: invoice.description || null,
    })

    const fs = await import('fs/promises')
    const path = await import('path')

    const uploadDir = path.join(process.cwd(), 'public', 'invoices')
    await fs.mkdir(uploadDir, { recursive: true })

    const fileName = `invoice-${invoice.invoiceNumber}.pdf`
    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, pdfBuffer)

    const pdfUrl = `/invoices/${fileName}`

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { pdfUrl },
    })

    console.log('[PDF] Invoice PDF generated and stored:', pdfUrl)
    return pdfUrl
  } catch (err) {
    console.error('[PDF] Failed to generate invoice PDF:', err)
    return null
  }
}
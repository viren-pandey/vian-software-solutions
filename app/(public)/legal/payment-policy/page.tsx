import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Policy',
  description: 'Payment policy for Vian Software Solutions services, including accepted methods, invoicing, taxes, and late payment terms.',
}

export default function PaymentPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Payment Policy</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Payment Policy</h1>
          <p className="lead">This policy governs payments, invoicing, taxes, and financial transactions for services provided by Vian Software Solutions.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#acceptance">1. Quotation Acceptance & Payment Trigger</a>
              <a href="#invoicing">2. Invoice Generation</a>
              <a href="#methods">3. Accepted Payment Methods</a>
              <a href="#gateway">4. Payment Gateway Information</a>
              <a href="#taxes">5. Taxes & GST</a>
              <a href="#due-dates">6. Due Dates & Late Payments</a>
              <a href="#milestone">7. Milestone Payments & Schedules</a>
              <a href="#failed">8. Failed Transactions</a>
              <a href="#verification">9. Payment Verification Process</a>
              <a href="#refunds">10. Refunds</a>
              <a href="#chargebacks">11. Chargebacks</a>
              <a href="#fraud">12. Fraud Prevention</a>
              <a href="#currency">13. Currency</a>
              <a href="#receipts">14. Receipts & Payment Confirmation</a>
              <a href="#contact">15. Contact</a>
            </aside>
            <div className="legal-doc">
              <h2 id="acceptance">1. Quotation Acceptance & Payment Trigger</h2>
              <p>Payment obligations arise upon acceptance of a Quotation or Statement of Work (SOW) issued by Vian Software Solutions (Sole Proprietorship of Viren Pandey). Acceptance may occur through any of the following actions by the Client:</p>
              <ul>
                <li>Signing and returning the Quotation or SOW document.</li>
                <li>Issuing a purchase order referencing the Quotation or SOW.</li>
                <li>Providing written acceptance via email or other written communication.</li>
                <li>Making an advance or partial payment as specified in the Quotation.</li>
                <li>Instructing Vian Software Solutions to commence work on the project.</li>
              </ul>
              <p>Upon acceptance, a binding contractual relationship is formed between the Client and Vian Software Solutions, and the payment terms set forth in the Quotation or SOW shall become effective. This Payment Policy, together with the applicable Quotation or SOW, our <a href="/legal/terms-and-conditions">Terms & Conditions</a>, and our <a href="/legal/refund-policy">Refund & Cancellation Policy</a>, govern all financial aspects of the engagement.</p>

              <h2 id="invoicing">2. Invoice Generation</h2>
              <p>Vian Software Solutions generates and issues invoices in accordance with the payment schedule set forth in the applicable Quotation or Statement of Work. All invoices are compliant with Indian tax regulations and include necessary details for GST compliance.</p>
              <p><strong>Invoice Details:</strong> Each invoice includes the following information:</p>
              <ul>
                <li>Invoice number and date of issuance.</li>
                <li>Vian Software Solutions' business name, address, and GST registration details.</li>
                <li>Client's name, billing address, and GST registration number (if applicable).</li>
                <li>Description of services or deliverables being invoiced.</li>
                <li>Milestone or project reference, if applicable.</li>
                <li>Amount payable, itemized with applicable taxes.</li>
                <li>Payment due date.</li>
                <li>Bank account details for payment.</li>
                <li>Payment terms and instructions.</li>
              </ul>
              <p><strong>Invoice Delivery:</strong> All invoices are delivered electronically to the Client's registered email address. It is the Client's responsibility to ensure that their billing contact information is accurate and current. Invoices are deemed received 24 hours after transmission.</p>
              <p><strong>Invoice Disputes:</strong> If the Client disputes any portion of an invoice in good faith, the Client shall notify Vian Software Solutions in writing within 5 business days of receipt, specifying the nature and amount of the dispute. The parties shall work in good faith to resolve the dispute promptly. All undisputed portions of the invoice shall be paid on or before the due date.</p>

              <h2 id="methods">3. Accepted Payment Methods</h2>
              <p>Vian Software Solutions accepts the following payment methods for invoices, advance payments, milestone payments, and any other amounts due:</p>
              <p><strong>Bank Transfer (NEFT/RTGS/IMPS):</strong> Direct bank transfers to our designated business bank account. Bank account details will be provided on each invoice. Transfers may be made via NEFT, RTGS, or IMPS as per the Client's convenience. Please include the invoice number or project reference in the transfer description for proper identification.</p>
              <p><strong>UPI (Unified Payments Interface):</strong> Payments via UPI applications including Google Pay, PhonePe, Paytm, BHIM, and other UPI-enabled apps. Our UPI ID will be provided on the invoice for your convenience.</p>
              <p><strong>Credit and Debit Cards:</strong> Payments via Visa, Mastercard, RuPay, American Express, and other major credit and debit cards are accepted through our secure payment gateway. Card payments are processed by our payment gateway partners and are subject to applicable transaction fees.</p>
              <p><strong>Paytm:</strong> Payments via Paytm wallet, Paytm UPI, and Paytm Payments Bank are accepted through our integrated payment gateway.</p>
              <p><strong>Razorpay:</strong> Payments processed through the Razorpay payment gateway, supporting all major payment instruments including credit cards, debit cards, net banking, UPI, and digital wallets.</p>
              <p><strong>Other Methods:</strong> Other electronic payment methods may be accepted at the discretion of Vian Software Solutions. Please contact us at support@viannn.online to discuss alternative payment arrangements.</p>

              <h2 id="gateway">4. Payment Gateway Information</h2>
              <p>Vian Software Solutions utilizes secure third-party payment gateways to process electronic payments. Currently, we use Razorpay as our primary payment gateway provider for processing card payments, UPI transactions, net banking, and digital wallet payments.</p>
              <p><strong>Security:</strong> All payment transactions processed through our payment gateways are encrypted using TLS/SSL protocols. Payment card details are tokenized and processed directly by the payment gateway; we do not store or have access to your full card numbers, CVV codes, or other sensitive payment credentials.</p>
              <p><strong>Transaction Fees:</strong> Certain payment methods may attract transaction fees, processing charges, or convenience fees as levied by the payment gateway or issuing bank. These fees, if applicable, will be displayed before payment confirmation or may be added to the invoice amount. The Client shall bear all such fees unless otherwise agreed in writing.</p>
              <p><strong>Gateway Terms:</strong> By choosing to pay via the payment gateway, you agree to be bound by the terms of service and privacy policy of the respective gateway provider. Vian Software Solutions recommends reviewing the gateway provider's terms before completing your transaction.</p>

              <h2 id="taxes">5. Taxes & GST</h2>
              <p>Vian Software Solutions complies with all applicable Indian tax laws and regulations, including the Goods and Services Tax (GST) regime under the GST Act, 2017.</p>
              <p><strong>GST Registration:</strong> Vian Software Solutions is registered under the GST regime and charges applicable GST on all taxable services provided to Indian clients. Our GST registration details are provided on all invoices.</p>
              <p><strong>GST on Services:</strong> All fees for services are exclusive of GST unless otherwise stated. GST shall be charged at the applicable rate (currently 18% for most software development and technology consulting services) and will be shown separately on the invoice.</p>
              <p><strong>Reverse Charge:</strong> If the Client is liable to pay GST under reverse charge mechanism as per GST laws, the Client shall discharge such liability directly. Vian Software Solutions shall provide necessary documentation, including a tax invoice, to facilitate reverse charge compliance.</p>
              <p><strong>Export of Services:</strong> Services provided to clients outside India may be treated as exports of services under GST laws and may be exempt from GST, subject to compliance with applicable conditions and documentation requirements. Clients outside India may be required to provide a self-declaration or other documentation as required by law.</p>
              <p><strong>Withholding Tax (TDS):</strong> If the Client is required by applicable law to deduct tax at source (TDS) from any payment due to Vian Software Solutions, the Client shall: (a) gross up the payment such that the net amount received equals the full invoiced amount; (b) provide Vian Software Solutions with a TDS certificate or challan evidencing the deduction within 30 days of making the deduction; and (c) comply with all applicable TDS reporting and remittance requirements.</p>
              <p><strong>Tax Compliance:</strong> The Client is responsible for ensuring compliance with all applicable tax laws in their jurisdiction, including but not limited to VAT, sales tax, service tax, withholding tax, and any other similar taxes or levies.</p>

              <h2 id="due-dates">6. Due Dates & Late Payments</h2>
              <p><strong>Payment Terms:</strong> Unless otherwise agreed in writing, all invoices are due and payable within 15 calendar days from the date of invoice (the "Due Date"). For retainer or subscription-based services, payment is due in advance before the commencement of the applicable billing period.</p>
              <p><strong>Advance Payments:</strong> Where advance payment is required (typically 30% to 50% of the total project Fees), such payment is due upon acceptance of the Quotation or SOW. Work shall not commence until the advance payment is received and cleared.</p>
              <p><strong>Late Payment Interest:</strong> If the Client fails to make any payment by the Due Date, interest shall accrue on the overdue amount at the rate of 1.5% per month (18% per annum), compounded monthly from the Due Date until the date of full payment. Interest shall be calculated on a daily basis and may be charged on partial as well as full amounts overdue.</p>
              <p><strong>Consequences of Late Payment:</strong> Without prejudice to any other rights or remedies available to Vian Software Solutions, if any payment is overdue by more than 5 calendar days, Vian Software Solutions reserves the right to:</p>
              <ul>
                <li>Suspend all active work on the Client's project(s) until all outstanding amounts, including accrued interest, are paid in full.</li>
                <li>Withhold delivery of any completed or in-progress deliverables, source code, work product, or digital assets.</li>
                <li>Revoke or suspend access to development environments, staging servers, dashboards, repositories, and any other platforms or systems.</li>
                <li>Require full payment of all outstanding amounts before resuming work or releasing deliverables.</li>
                <li>Charge reasonable administrative fees for reactivation and re-mobilization after suspension.</li>
                <li>Pursue any other remedies available under applicable law or under our Terms & Conditions.</li>
              </ul>
              <p><strong>Recovery Costs:</strong> In the event Vian Software Solutions engages a collection agency or takes legal action to recover overdue amounts, the Client shall be liable for all reasonable collection costs, legal fees, court costs, and other expenses incurred.</p>

              <h2 id="milestone">7. Milestone Payments & Schedules</h2>
              <p>For projects structured with milestone-based payment schedules, the following provisions apply:</p>
              <p><strong>Milestone Definition:</strong> Each Milestone represents a predefined stage or phase of the project with specific deliverables, acceptance criteria, and a corresponding payment amount as set forth in the Quotation or Statement of Work.</p>
              <p><strong>Milestone Invoicing:</strong> Each Milestone shall be invoiced upon the earlier of: (a) completion of the Milestone and delivery of the corresponding deliverable to the Client; or (b) the scheduled Milestone date as specified in the project timeline.</p>
              <p><strong>Milestone Payment Due Date:</strong> Milestone payments are due within 15 calendar days from the date of the Milestone invoice, unless otherwise specified in the Quotation or SOW.</p>
              <p><strong>Milestone Acceptance:</strong> Milestone payment obligations arise upon delivery of the Milestone deliverable, regardless of whether the Client has completed its review or formal acceptance process. The Client's review and acceptance rights are separate from the payment obligation and are governed by the applicable SOW and our Terms & Conditions.</p>
              <p><strong>Non-Refundable:</strong> All Milestone payments are non-refundable once the corresponding Milestone has been completed and delivered, as further described in our <a href="/legal/refund-policy">Refund & Cancellation Policy</a>.</p>
              <p><strong>Failure to Pay:</strong> If the Client fails to pay a Milestone payment when due, Vian Software Solutions shall have the right to suspend work on subsequent Milestones until the payment is received. The project timeline shall be extended by the period of suspension.</p>

              <h2 id="failed">8. Failed Transactions</h2>
              <p>In the event of a failed, declined, or rejected payment transaction, the following process shall apply:</p>
              <p><strong>Notification:</strong> The Client will receive a notification of the failed transaction from the payment gateway or from Vian Software Solutions, indicating the reason for failure where available (e.g., insufficient funds, incorrect details, card declined, bank rejection).</p>
              <p><strong>Re-attempt:</strong> The Client may re-attempt the payment using the same or an alternative payment method. Vian Software Solutions recommends verifying the accuracy of all payment details before re-attempting.</p>
              <p><strong>Alternative Method:</strong> If the payment continues to fail, the Client shall contact Vian Software Solutions at support@viannn.online to arrange an alternative payment method. We will work with the Client to identify and resolve the issue promptly.</p>
              <p><strong>Consequences of Failed Payment:</strong> If payment is not successfully processed within 5 business days of the Due Date, the late payment provisions in Section 6 of this Policy shall apply, including the accrual of interest and potential suspension of services.</p>
              <p><strong>Transaction Reversals:</strong> In the rare event of a duplicate charge or erroneous transaction, Vian Software Solutions shall reverse the duplicate or erroneous amount within 5 business days of identification, provided that the Client notifies us promptly of any such discrepancy.</p>

              <h2 id="verification">9. Payment Verification Process</h2>
              <p>To ensure the security and accuracy of all financial transactions, Vian Software Solutions employs the following payment verification process:</p>
              <p><strong>Payment Confirmation:</strong> Upon receipt of payment, Vian Software Solutions shall verify the transaction details, including the amount, date, payment method, and reference information. Payment is considered received when the funds are credited to our bank account or payment gateway account.</p>
              <p><strong>Transaction Matching:</strong> We match each incoming payment against the corresponding invoice and project using the transaction reference, invoice number, or Client name provided during payment. Clients are encouraged to include the invoice number or project reference in the payment description to facilitate accurate matching.</p>
              <p><strong>Unidentified Payments:</strong> If a payment cannot be matched to an invoice or project due to insufficient reference information, Vian Software Solutions shall contact the Client to verify the payment details. Unidentified payments shall be held in a suspense account until the Client provides sufficient information to match the payment.</p>
              <p><strong>Verification Timeline:</strong> Payment verification is typically completed within 2 business days of receipt. Once verified, the payment is applied to the Client's account and reflected in the project status and records.</p>

              <h2 id="refunds">10. Refunds</h2>
              <p>Refunds, if any, shall be governed exclusively by our <a href="/legal/refund-policy">Refund & Cancellation Policy</a>. This Payment Policy should be read in conjunction with the Refund & Cancellation Policy for a complete understanding of circumstances under which refunds may be issued.</p>
              <p><strong>Refund Processing:</strong> If a refund is approved under our Refund & Cancellation Policy, the refund shall be processed within 15 to 30 business days from the date of approval, depending on the payment method and bank processing times.</p>
              <p><strong>Refund Method:</strong> Refunds shall be issued through the original payment method used by the Client, unless otherwise agreed. If the original payment method is unavailable or cannot accept refunds, the refund may be issued via bank transfer, UPI, or other mutually agreed method.</p>
              <p><strong>Deductions:</strong> Vian Software Solutions reserves the right to deduct from any refund: (a) any non-refundable items as specified in the Refund & Cancellation Policy; (b) administrative or processing fees; (c) transaction fees or gateway charges incurred in processing the original payment; and (d) the value of any work performed up to the date of cancellation that has not yet been invoiced.</p>

              <h2 id="chargebacks">11. Chargebacks</h2>
              <p>A chargeback occurs when a Client disputes a payment directly with their bank or payment provider and requests a reversal of the transaction, without first attempting to resolve the dispute with Vian Software Solutions.</p>
              <p><strong>Policy on Chargebacks:</strong> Vian Software Solutions considers chargebacks to be an extreme measure that should only be used in cases of genuine fraud or unauthorized transactions. Chargebacks initiated for the purpose of avoiding legitimate payment obligations constitute a material breach of our Terms & Conditions and the underlying engagement agreement.</p>
              <p><strong>Service Suspension:</strong> If a Client initiates a chargeback, Vian Software Solutions shall immediately suspend all Services, revoke all access to deliverables, platforms, and systems, and withhold delivery of any work product until the chargeback is resolved.</p>
              <p><strong>Dispute with Documentation:</strong> Vian Software Solutions reserves the right to contest any chargeback by providing the payment provider with all relevant documentation, including the accepted Quotation or SOW, correspondence and communications, evidence of work performed, invoices, and payment records.</p>
              <p><strong>Legal Remedies:</strong> Vian Software Solutions reserves the right to pursue all available legal remedies for fraudulent or abusive chargebacks, including filing a claim in the courts of Mumbai, Maharashtra, India, and seeking recovery of all associated costs, including legal fees, chargeback fees, administrative costs, and interest.</p>
              <p><strong>Encouragement to Communicate:</strong> We strongly encourage all Clients to contact us at support@viannn.online before initiating a chargeback. Most disputes can be resolved amicably through communication. Initiating a chargeback without prior communication may result in unnecessary service disruption and additional costs for both parties.</p>

              <h2 id="fraud">12. Fraud Prevention</h2>
              <p>Vian Software Solutions is committed to preventing fraud and ensuring the integrity of all financial transactions. We employ the following fraud prevention measures:</p>
              <ul>
                <li><strong>Identity Verification:</strong> For new Clients or high-value transactions, we may request identity verification documents, business registration proof, or other information to verify the Client's identity and legitimacy.</li>
                <li><strong>Transaction Monitoring:</strong> We monitor payment transactions for suspicious patterns, unusual activity, or indicators of fraud, including multiple failed payment attempts, unusual transaction amounts, or discrepancies in Client information.</li>
                <li><strong>Payment Gateway Security:</strong> Our payment gateways employ advanced fraud detection and prevention tools, including 3D Secure authentication for card payments, velocity checks, and AVS (Address Verification System) where available.</li>
                <li><strong>Secure Communication:</strong> We do not request sensitive payment information (CVV, PIN, OTP) via email, phone, or unsecured channels. Clients should never share such information in unsecured communications.</li>
                <li><strong>Suspicious Activity Reporting:</strong> If we suspect fraudulent activity, we reserve the right to: (a) suspend the transaction; (b) request additional verification from the Client; (c) report the activity to relevant authorities; and (d) terminate the engagement with immediate effect.</li>
              </ul>
              <p>Clients are encouraged to report any suspected fraudulent activity related to their account or transactions to Vian Software Solutions immediately at support@viannn.online.</p>

              <h2 id="currency">13. Currency</h2>
              <p>All Fees, invoices, and payments are quoted and payable in Indian Rupees (INR) unless otherwise expressly agreed in writing between the parties.</p>
              <p><strong>Foreign Currency Payments:</strong> If Vian Software Solutions agrees to accept payment in a foreign currency (such as USD, EUR, GBP, or others), the exchange rate applicable on the date of payment shall be used for conversion. The exchange rate shall be determined by Vian Software Solutions using prevailing market rates or the rates provided by our banking partners.</p>
              <p><strong>Currency Conversion Charges:</strong> The Client shall bear all currency conversion charges, bank fees, intermediary bank charges, and any other costs associated with cross-border payments. Such charges may be deducted from the payment amount, and the Client shall ensure that the net amount received by Vian Software Solutions equals the full invoiced amount.</p>
              <p><strong>Exchange Rate Fluctuations:</strong> Vian Software Solutions shall not be liable for any losses arising from exchange rate fluctuations between the date of invoicing and the date of payment. The risk of currency fluctuation shall be borne by the Client.</p>

              <h2 id="receipts">14. Receipts & Payment Confirmation</h2>
              <p>Upon successful verification of payment, Vian Software Solutions shall provide the Client with a payment receipt or confirmation. The following documents may be issued, as applicable:</p>
              <p><strong>Payment Receipt:</strong> A payment receipt confirming the amount received, date of receipt, invoice reference, and applicable payment method. This receipt serves as acknowledgement of payment.</p>
              <p><strong>Tax Invoice:</strong> A GST-compliant tax invoice shall be issued for all taxable services, containing the required details under GST laws, including HSN/SAC codes, GST rates, and other statutory information.</p>
              <p><strong>Payment Confirmation Email:</strong> An email confirmation shall be sent to the Client's registered email address upon successful payment verification, providing transaction details and updated account status.</p>
              <p><strong>Ledger Statement:</strong> Upon request, Vian Software Solutions shall provide the Client with a statement of account showing all invoices, payments, credits, and outstanding balances.</p>

              <h2 id="contact">15. Contact</h2>
              <p>If you have any questions, concerns, or requests regarding this Payment Policy, your invoices, or payment transactions, please contact us:</p>
              <p><strong>Vian Software Solutions</strong><br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India<br />Email: support@viannn.online<br />Phone: +91 9598443203</p>
              <p>For billing and payment-related matters, please include your invoice number or project reference in the subject line of your email to help us assist you promptly.</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

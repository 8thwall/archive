import type Stripe from 'stripe'

interface InvoiceInfo {
  id: Stripe.Invoice['id']
  amountDue: Stripe.Invoice['amount_due']
  amountPaid: Stripe.Invoice['amount_paid']
  status: Stripe.Invoice['status']
  currency: Stripe.Invoice['currency']
  billing: Stripe.Invoice['collection_method']
  subtotal: Stripe.Invoice['subtotal']
  total: Stripe.Invoice['total']
  paymentMethod?: Stripe.PaymentIntent['payment_method']
  dueDate: Stripe.Invoice['due_date']
  periodStart: Stripe.Invoice['period_start']
  periodEnd: Stripe.Invoice['period_end']
}

export type {InvoiceInfo}

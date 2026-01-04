import { PayPalOrderDetails, PayPalOrderResponse, PayPalCaptureResponse } from '../types';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

interface PayPalTokenResponse {
  access_token: string;
  expires_in: number;
}

interface PayPalOrderData {
  id: string;
  status: string;
  links: Array<{ rel: string; href: string }>;
  purchase_units: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        amount: { value: string; currency_code: string };
      }>;
    };
  }>;
  payer?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
}

interface PayPalRefundData {
  id: string;
  status: string;
  amount?: { value: string };
}

class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const error = await response.json() as { error_description?: string };
      throw new Error(`PayPal Auth Error: ${error.error_description || 'Unknown error'}`);
    }

    const data = await response.json() as PayPalTokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  async createOrder(orderDetails: PayPalOrderDetails): Promise<PayPalOrderResponse> {
    const { amount, currency = 'USD', description, bookingNumber, returnUrl, cancelUrl } = orderDetails;

    const accessToken = await this.getAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: bookingNumber,
        description: description || `Auto Glass Service - ${bookingNumber}`,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        }
      }],
      application_context: {
        brand_name: process.env.BUSINESS_NAME || 'Los Auto & Glass',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl
      }
    };

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal Order Error: ${JSON.stringify(error)}`);
    }

    const order = await response.json() as PayPalOrderData;
    const approvalUrl = order.links.find((link) => link.rel === 'approve')?.href;

    return {
      orderId: order.id,
      status: order.status,
      approvalUrl,
      links: order.links
    };
  }

  async captureOrder(orderId: string): Promise<PayPalCaptureResponse> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal Capture Error: ${JSON.stringify(error)}`);
    }

    const capture = await response.json() as PayPalOrderData;
    const captureDetails = capture.purchase_units[0]?.payments?.captures?.[0];

    return {
      orderId: capture.id,
      status: capture.status,
      transactionId: captureDetails?.id,
      amount: parseFloat(captureDetails?.amount?.value || '0'),
      currency: captureDetails?.amount?.currency_code,
      payerEmail: capture.payer?.email_address,
      payerName: capture.payer?.name
    };
  }

  async getOrder(orderId: string): Promise<PayPalOrderData> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal Get Order Error: ${JSON.stringify(error)}`);
    }

    return await response.json() as PayPalOrderData;
  }

  async refundPayment(captureId: string, amount: number | null = null, currency: string = 'USD'): Promise<{ refundId: string; status: string; amount: number }> {
    const accessToken = await this.getAccessToken();

    const refundData = amount 
      ? { amount: { value: amount.toFixed(2), currency_code: currency } }
      : {};

    const response = await fetch(`${PAYPAL_API}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refundData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal Refund Error: ${JSON.stringify(error)}`);
    }

    const refund = await response.json() as PayPalRefundData;

    return {
      refundId: refund.id,
      status: refund.status,
      amount: parseFloat(refund.amount?.value || '0')
    };
  }
}

export default new PayPalService();

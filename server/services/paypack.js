import axios from 'axios';
import crypto from 'crypto';

const PAYPACK_BASE_URL = 'https://payments.paypack.rw/api';

let cachedToken = null;
let cachedExpiry = 0;

function now() {
  return Date.now();
}

/**
 * Authenticate with Paypack using client_id and client_secret.
 * Returns the access token string.
 */
export async function getPaypackAccessToken() {
  const clientId = process.env.PAYPACK_CLIENT_ID;
  const clientSecret = process.env.PAYPACK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PAYPACK_CLIENT_ID and PAYPACK_CLIENT_SECRET must be set in .env');
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedExpiry - 60000 > now()) {
    return cachedToken;
  }

  const res = await axios.post(
    `${PAYPACK_BASE_URL}/auth/agents/authorize`,
    {
      client_id: clientId,
      client_secret: clientSecret,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  const data = res.data;
  if (!data.access) {
    throw new Error('Paypack authentication failed: ' + JSON.stringify(data));
  }

  cachedToken = data.access;
  // Token expires in `expires` field (usually 15 min = 900000ms)
  const expiresIn = data.expires ? parseInt(data.expires, 10) * 1000 : 900000;
  cachedExpiry = now() + expiresIn;

  console.log('[Paypack] Authenticated successfully');
  return cachedToken;
}

/**
 * Refresh an expired access token.
 */
export async function refreshPaypackToken(refreshToken) {
  const res = await axios.get(
    `${PAYPACK_BASE_URL}/auth/agents/refresh/${refreshToken}`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  const data = res.data;
  if (!data.access) {
    throw new Error('Paypack token refresh failed');
  }

  cachedToken = data.access;
  const expiresIn = data.expires ? parseInt(data.expires, 10) * 1000 : 900000;
  cachedExpiry = now() + expiresIn;

  return data;
}

/**
 * Initiate a Cashin (deposit) — sends USSD push to customer's phone.
 * @param {string} phone - Customer phone number (e.g., "078xxxxxxx")
 * @param {number} amount - Amount in RWF
 * @param {string} webhookMode - "development" or "production"
 * @returns {{ ref, status, amount, kind, created_at }}
 */
export async function paypackCashin(phone, amount, webhookMode = 'development') {
  const token = await getPaypackAccessToken();

  const res = await axios.post(
    `${PAYPACK_BASE_URL}/transactions/cashin`,
    {
      amount: Number(amount),
      number: phone,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Webhook-Mode': webhookMode,
      },
    }
  );

  return res.data;
}

/**
 * Find a transaction by its reference.
 * @param {string} ref - Transaction reference
 * @returns {{ ref, status, amount, kind, client, fee, merchant, timestamp }}
 */
export async function paypackFindTransaction(ref) {
  const token = await getPaypackAccessToken();

  const res = await axios.get(
    `${PAYPACK_BASE_URL}/transactions/find/${ref}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

/**
 * List transaction events (for polling status).
 * @param {object} params - Optional: { ref, kind, status, client, offset, limit }
 */
export async function paypackListEvents(params = {}) {
  const token = await getPaypackAccessToken();

  const queryParams = new URLSearchParams();
  if (params.ref) queryParams.append('ref', params.ref);
  if (params.kind) queryParams.append('kind', params.kind);
  if (params.status) queryParams.append('status', params.status);
  if (params.client) queryParams.append('client', params.client);
  if (params.offset !== undefined) queryParams.append('offset', String(params.offset));
  if (params.limit !== undefined) queryParams.append('limit', String(params.limit));

  const qs = queryParams.toString();
  const url = `${PAYPACK_BASE_URL}/events/transactions${qs ? '?' + qs : ''}`;

  const res = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

/**
 * Verify Paypack webhook signature (X-Paypack-Signature).
 * @param {Buffer} rawBody - Raw request body
 * @param {string} signature - X-Paypack-Signature header value
 * @returns {boolean}
 */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.PAYPACK_WEBHOOK_SECRET || '';
  if (!secret) return true; // no secret configured, skip verification
  const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  return hash === signature;
}

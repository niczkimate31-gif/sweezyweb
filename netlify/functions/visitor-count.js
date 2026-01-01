const { getStore } = require('@netlify/blobs')

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  const siteID = process.env.SITE_ID || process.env.NETLIFY_SITE_ID
  const token = process.env.NETLIFY_AUTH_TOKEN

  let store
  try {
    // Prefer auto-config when available
    store = getStore('visitor_counter')
  } catch (e) {
    // Fallback: manual config (requires env vars)
    if (!siteID || !token) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Missing Netlify Blobs configuration',
          required: ['NETLIFY_AUTH_TOKEN', 'SITE_ID (or NETLIFY_SITE_ID)'],
        }),
      }
    }

    store = getStore({ name: 'visitor_counter', siteID, token })
  }
  const key = 'count'
  const initialCount = 173

  const getCurrentCount = async () => {
    const raw = await store.get(key)
    if (raw === null || raw === undefined || raw === '') return initialCount
    const parsed = parseInt(String(raw), 10)
    return Number.isFinite(parsed) ? parsed : initialCount
  }

  try {
    if (event.httpMethod === 'GET') {
      const count = await getCurrentCount()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ count }),
      }
    }

    if (event.httpMethod === 'POST') {
      const current = await getCurrentCount()
      const next = current + 1
      await store.set(key, String(next))

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ count: next }),
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error' }),
    }
  }
}

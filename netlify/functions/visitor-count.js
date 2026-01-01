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

  const store = getStore('visitor_counter')
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

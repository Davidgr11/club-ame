exports.handler = async function(event, context) {
  try {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const API_KEY = process.env.JSONBIN_API_KEY;

    console.log('Update function called');
    console.log('Environment check:', {
      BIN_ID: BIN_ID ? 'Set' : 'Missing',
      API_KEY: API_KEY ? 'Set' : 'Missing'
    });

    if (!BIN_ID || !API_KEY) {
      console.error('Missing environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Missing environment variables' })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'No data provided' })
      };
    }

    const body = JSON.parse(event.body);
    console.log('Updating data:', body);

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`JSONBin API error: ${response.status}`);
      throw new Error(`JSONBin API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Successfully updated data');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ ok: true, result })
    };
  } catch (error) {
    console.error('Error in update-jugadores:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Failed to update players data', details: error.message })
    };
  }
}

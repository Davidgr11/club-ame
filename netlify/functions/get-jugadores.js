exports.handler = async function(event, context) {
  try {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const API_KEY = process.env.JSONBIN_API_KEY;

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

    console.log('Making request to JSONBin...');
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`JSONBin API error: ${response.status}`);
      throw new Error(`JSONBin API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw JSONBin response:', data);
    
    // Si no hay datos o está vacío, retornar array vacío
    let jugadores = data.record;
    if (!jugadores || !Array.isArray(jugadores)) {
      console.log('No data found or invalid format, returning empty array');
      jugadores = [];
    }
    
    console.log('Successfully fetched data from JSONBin, returning:', jugadores);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(jugadores)
    };
  } catch (error) {
    console.error('Error in get-jugadores:', error);
    
    // En caso de error, retornar array vacío para que la app siga funcionando
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify([])
    };
  }
}
exports.handler = async function(event, context) {
  try {
    // Log para debugging en producción
    console.log('Function get-jugadores started');
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const API_KEY = process.env.JSONBIN_API_KEY;

    console.log('Environment check:', {
      BIN_ID: BIN_ID ? 'Set (' + BIN_ID.substring(0, 8) + '...)' : 'Missing',
      API_KEY: API_KEY ? 'Set (' + API_KEY.substring(0, 10) + '...)' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    });

    if (!BIN_ID || !API_KEY) {
      console.error('Missing environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing environment variables',
          details: {
            BIN_ID: BIN_ID ? 'present' : 'missing',
            API_KEY: API_KEY ? 'present' : 'missing'
          }
        })
      };
    }

    console.log('Making request to JSONBin...');
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    
    console.log('JSONBin response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`JSONBin API error: ${response.status} - ${errorText}`);
      
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: `JSONBin API error: ${response.status}`,
          details: errorText
        })
      };
    }
    
    const data = await response.json();
    console.log('JSONBin full response:', JSON.stringify(data, null, 2));
    console.log('JSONBin response keys:', Object.keys(data));
    console.log('JSONBin response record type:', typeof data.record);
    console.log('JSONBin response record value:', data.record);
    
    // Si no hay datos o está vacío, retornar array vacío
    let jugadores = data.record;
    
    // Verificar diferentes formatos posibles
    if (!jugadores) {
      console.log('No record field, checking if data itself is array');
      if (Array.isArray(data)) {
        jugadores = data;
        console.log('Data is direct array, using it');
      } else {
        console.log('No valid data format found, returning empty array');
        jugadores = [];
      }
    } else if (!Array.isArray(jugadores)) {
      console.log('Record exists but is not array:', typeof jugadores, jugadores);
      jugadores = [];
    }
    
    console.log('Final jugadores array:', jugadores);
    console.log('Successfully fetched data, returning', jugadores.length, 'players');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jugadores)
    };
  } catch (error) {
    console.error('Error in get-jugadores:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Información adicional para debugging
    console.error('Error occurred at timestamp:', new Date().toISOString());
    console.error('Environment variables status:', {
      BIN_ID: process.env.JSONBIN_BIN_ID ? 'present' : 'missing',
      API_KEY: process.env.JSONBIN_API_KEY ? 'present' : 'missing'
    });
    
    // En caso de error, retornar información detallada
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        type: error.name,
        timestamp: new Date().toISOString(),
        details: 'Check function logs for more information'
      })
    };
  }
}
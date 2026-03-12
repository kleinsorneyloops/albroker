// This is the "Fetcher" station. 
// It runs on a server, so your API Key stays hidden.
const axios = require('axios');

exports.handler = async (event) => {
  // A. This gets the Zillow URL the user typed into your website
  const { property_url } = event.queryStringParameters;

  // B. This is the "Order Form" we send to RapidAPI
  const options = {
    method: 'GET',
    url: 'https://real-time-real-estate-data.p.rapidapi.com/property-details',
    params: { property_url: property_url },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY, // This pulls your key from the "Safe"
      'X-RapidAPI-Host': 'real-time-real-estate-data.p.rapidapi.com'
    }
  };

  try {
    // C. Actually making the call to the library
    const response = await axios.request(options);
    
    // D. Sending the book (data) back to your app
    return {
      statusCode: 200,
      body: JSON.stringify(response.data.data), 
    };
  } catch (error) {
    // E. If the library is closed or the key is wrong, show an error
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Could not find that house data." }) 
    };
  }
};

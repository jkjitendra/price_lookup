import axios from 'axios';

const BASEURL = "https://pricepeek.ashutoshviramgama.com/";
const REFRESH_URL = `${BASEURL}/generate-token-from-refresh`;

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(REFRESH_URL, { 'refresh-token': refreshToken }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token } = response.data;
    localStorage.setItem('accessToken', token);
    return token;
  } catch (err) {
    console.error('Failed to refresh token', err);
    throw err;
  }
}

export default refreshToken;

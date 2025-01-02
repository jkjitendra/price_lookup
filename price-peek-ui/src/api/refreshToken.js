import axios from 'axios';

const BASEURL = "https://pricepeek.ashutoshviramgama.com/";
const REFRESH_URL = `${BASEURL}/generate-token-from-refresh`;

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('No refresh token available');
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(REFRESH_URL, { 'refresh-token': refreshToken }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token } = response.data;
    if (!token) {
      console.error('No token received');
      throw new Error('No token received');
    }

    localStorage.setItem('accessToken', token);
    return token;
  } catch (err) {
    console.error('Failed to refresh token', err.response?.data || err.message);
    throw err;
  }
}

// use when RefreshToken is passed under cookies


/**
 * Helper function to get a specific cookie by name
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} - The value of the cookie, or null if not found
 */
// const getCookie = (name) => {
//   const cookies = document.cookie.split("; ");
//   for (let cookie of cookies) {
//     const [key, value] = cookie.split("=");
//     if (key === name) {
//       return decodeURIComponent(value);
//     }
//   }
//   return null;
// };

// const refreshToken = async () => {
//   const refreshToken = getCookie("refreshToken"); // Replace 'refreshToken' with your cookie name
//   if (!refreshToken) {
//     throw new Error("No refresh token available in cookies");
//   }

//   try {
//     const response = await axios.post(
//       REFRESH_URL,
//       {}, // No payload required since the refreshToken is in cookies
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true, // Ensure cookies are sent with the request
//       }
//     );

//     const { token: newAccessToken } = response.data; // Extract the accessToken from the response
//     localStorage.setItem("accessToken", newAccessToken); // Store the new accessToken in localStorage
//     return newAccessToken;
//   } catch (err) {
//     console.error("Failed to refresh token:", err);
//     throw err;
//   }
// };

export default refreshToken;

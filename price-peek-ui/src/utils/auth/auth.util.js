import {jwtDecode} from 'jwt-decode';

export const getRolesFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    // console.log('decodedToken', decodedToken.roles.map(role => role.authority));
    return decodedToken.roles.map(role => role.authority) || [];
  } catch (error) {
    console.error('Invalid token', error);
    return [];
  }
};

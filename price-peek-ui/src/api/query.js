import axios from "axios";

const instance = axios.create({
    baseURL: "https://ashutoshviramgama.com/",
    // withCredentials: true
});

instance.interceptors.request.use(function (config) {
    // Add CORS headers
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    
    return config;
}, function (error) {
    // Do something with request error
    console.log('error in query file', error);
    return Promise.reject(error);
});

export default instance;

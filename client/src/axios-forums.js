import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://forum.kevinbajzek.com'
});

export default instance;
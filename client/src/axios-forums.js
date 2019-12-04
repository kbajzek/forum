import axios from 'axios';
import config from './config/config';

let baseURL = config.development.base_url;
if(JSON.stringify(process.env.NODE_ENV) !== JSON.stringify('development')){
    baseURL = config.production.base_url;
}

const instance = axios.create({
    baseURL: baseURL
});

export default instance;
import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-burger-app-vindi.firebaseio.com/'
});


export default instance;
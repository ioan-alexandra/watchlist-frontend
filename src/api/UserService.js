import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/data/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all',{headers: authHeader()});
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', {headers: authHeader()});
    }

    getModeratorBoard() {
        return axios.get(API_URL + 'mod', {headers: authHeader()});
    }

    getAdminBoard() {
        return axios.get(API_URL + 'users',);
    }

    getCurrentUserById(id) {
        return axios.get(API_URL + 'users/' + id, {headers: authHeader()});
    }

    getAllUsers() {
        return axios.get(API_URL + 'users', {headers: authHeader()});
    }

    deleteUser(id) {
        return axios.delete(API_URL + "users/" + id, {headers: authHeader()})
    }

    updateUser(id, data) {
        return axios.put(API_URL + "users/" + id, data, {headers: authHeader()})
    }
}

export default new UserService();
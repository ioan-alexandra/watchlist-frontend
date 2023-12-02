import axios from 'axios'
import authHeader from './auth-header';

const API_URL = "http://localhost:3000/watchlist/";

class ProductsService {
    save(id, data) {
        console.log(data);
        return axios.post(API_URL + "save/" + id, data, {headers: authHeader()});
    }

    getUserWatchlist(id) {
        return axios.get(API_URL + "user/" + id, {headers: authHeader()});
    }

    deleteProduct(id){
        return axios.delete(API_URL + "product/" + id, {headers: authHeader()});
    }
}
export default new ProductsService();
import axios from 'axios'
import authHeader from './auth-header';

const API_URL = "http://localhost:3000/chat/";

class ReportService {

    getReports() {
        return axios.get(API_URL + "reports/", {headers: authHeader()});
    }

    save(data) {
        return axios.post(API_URL + "save/", data, {headers: authHeader()});
    }
}

export default new ReportService();
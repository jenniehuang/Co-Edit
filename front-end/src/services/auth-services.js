import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_AUTH;

class AuthServices {
  async login(userData) {
    const response = await axios.post(API_URL + "/login", userData);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  async signup(userData) {
    const response = await axios.post(API_URL + "/signup", userData);

    if (response) {
      return response.data;
    }
  }

  getCurrent() {}
}

export default new AuthServices();

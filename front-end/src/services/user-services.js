import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_USER;

class UserServices {
  async uploadUserData(userData) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    const response = await axios.patch(API_URL + `/userData`, userData, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data) {
      const user = JSON.parse(localStorage.getItem("user"));
      user.image = response.data.thumbnail;
      user.background = response.data.background;
      localStorage.setItem("user", JSON.stringify(user));
      return response.data;
    }
  }

  getUserInfo(id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + `/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new UserServices();

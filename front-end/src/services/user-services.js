import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_USER;

class UserServices {
  uploadUserData(thumbnailURL, backgroundURL, link, about) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.patch(
      API_URL + `/userData`,
      { thumbnailURL, backgroundURL, link, about },
      {
        headers: {
          Authorization: token,
        },
      }
    );
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

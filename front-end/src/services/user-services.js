import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_USER;

class UserServices {
  uploadThumbnail(url) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.patch(
      API_URL + `/thumbnail`,
      { url },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new UserServices();

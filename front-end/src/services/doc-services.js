import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_DOC;

class DocServices {
  getUsers(id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + `/users/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  getOneOrCreate(id) {
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

  mydoc() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(
      API_URL + "/mydoc",

      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  shared() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(
      API_URL + "/shared",

      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  access(email, docId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.patch(
      API_URL + "/access",
      { email, docId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  remove(email, docId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.patch(
      API_URL + "/remove",
      { email, docId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  delete(id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.delete(API_URL + `/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new DocServices();

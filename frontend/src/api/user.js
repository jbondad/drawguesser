import axios from "axios";

export async function registerUser(user) {
  let response = await axios.post("http://localhost:8888/user/register", user);
  let data = response.data;
  return data;
}

export async function postLogin(user) {
  let response = await axios.post("http://localhost:8888/user/login", user);
  let data = response.data;
  return data;
}

export async function changePassword(payload) {
  let response = await axios.post(
    "http://localhost:8888/user/changePassword",
    payload
  );
  let data = response.data;
  return data;
}

export async function leaderboard() {
  let response = await axios.get("http://localhost:8888/user/leaderboard");
  let data = response.data;
  console.log(data);
  return data;
}

export async function increaseWins(user) {
  let response = await axios.post(
    "http://localhost:8888/user/increaseWins",
    user
  );
  let data = response.data;
  return data;
}

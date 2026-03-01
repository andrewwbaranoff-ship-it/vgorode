import axios from "axios";

export async function sendConfig(config: string) {
  return axios.post("http://localhost:8765/api/config", { config });
}

import { Config } from "@/config";

export default async function post(
  apiRouter: string,
  data: any,
  addToken = true
) {
  const authHost = Config.authHost;
  const param: any = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  if (addToken) {
    const token = localStorage.getItem("token");
    if (token) {
      param.headers.authorization = token;
    }
  }
  if (data) {
    param.body = JSON.stringify(data);
  }
  return await fetch(`${authHost}${apiRouter}`, param);
}

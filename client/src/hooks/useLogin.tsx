import { useCookies } from "react-cookie";
import ServerHelper, { ServerURL } from "../components/ServerHelper";

const useLogin = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "name"]);

  const login = async (token: string) => {
    const json = await ServerHelper.post(ServerURL.login, {
      token: token
    });
    if (json["success"]) {
      setCookie("name", json["name"], { path: "/" });
      setCookie("token", token, { path: "/" });
      return true;
    }
    return false;
  };

  const getCredentials = () => {
    return {
      token: cookies["token"]
    };
  };
  const logout = () => {
    removeCookie("name");
    removeCookie("token");
  };
  return { getCredentials, login, logout };
};

export default useLogin;

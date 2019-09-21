import React from "react";

import { useCookies } from "react-cookie";

export enum Query {
  name = "name",
  token = "token",
  limit = "limit"
}

const useViewer = () => {
  const [cookies] = useCookies([Query.token]);
  const viewer = (value: Query) => {
    return cookies[value];
  };
  const isLoggedIn = React.useMemo(() => cookies[Query.token] != null, [
    cookies
  ]);
  return { viewer, isLoggedIn };
};

export default useViewer;

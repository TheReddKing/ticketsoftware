import React from "react";
import { RouteComponentProps } from "react-router";
import useLogin from "../hooks/useLogin";
import useViewer from "../hooks/useViewer";

enum Status {
  start,
  loading,
  failed,
  succeed
}

const LoginCallback = (props: RouteComponentProps) => {
  const { isLoggedIn } = useViewer();
  const [loginStatus, setLoginStatus] = React.useState<Status>(
    isLoggedIn ? Status.succeed : Status.start
  );
  const search = new URLSearchParams(props.location.search);
  const { login } = useLogin();
  React.useEffect(() => {
    const token = search.get("token");
    if (isLoggedIn) {
      window.location.replace("/");
    }
    if (token != null && loginStatus === Status.start) {
      setLoginStatus(0);
      login(token).then((success: Boolean) => {
        setLoginStatus(success ? Status.succeed : Status.failed);
      });
    } else if (loginStatus === Status.start) {
      setLoginStatus(Status.failed);
    }
    // eslint-disable-next-line
  }, [isLoggedIn, loginStatus]);

  if (loginStatus === Status.start || loginStatus === Status.loading) {
    return <div>Attempting to login</div>;
  } else if (loginStatus === Status.succeed) {
    return <div>Successful Login</div>;
  } else {
    return <div>Login Failed</div>;
  }
};

export default LoginCallback;

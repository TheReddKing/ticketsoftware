import React from "react";
import { Container, Button, Input, Row, InputGroup } from "reactstrap";
import useViewer, { Query } from "../hooks/useViewer";
import ServerHelper, { ServerURL } from "./ServerHelper";
import createAlert, { AlertType } from "./Alert";
import ReactTable from "react-table";
import "react-table/react-table.css";
import useLogin from "../hooks/useLogin";

type keybase = {
  [key: string]: string;
};

const LandingPage = () => {
  const { isLoggedIn, viewer } = useViewer();
  const { getCredentials } = useLogin();
  const [searchValue, setSearchValue] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(0);
  const allKeys = ["email", "code", "notes"];

  const updateData = async () => {
    const resp = await ServerHelper.post(ServerURL.get, getCredentials());
    if (resp && resp.success === false) {
      createAlert(
        AlertType.Warning,
        "Something went wrong! Are you admin and authed?"
      );
      return;
    }
    const tickets = resp.tickets.map((key: { [key: string]: string }) => ({
      email: key.email,
      code: key.code,
      id: key.id,
      notes: key.notes,
      user: key.user
    }));
    setLimit(resp.limit);
    let keys: string[] = [];
    setData(tickets);
  };
  React.useEffect(() => {
    (async () => {
      await updateData();
    })();
    // eslint-disable-next-line
  }, []);

  const filteredList = React.useMemo(() => {
    let finalList: keybase[] = data;
    if (searchValue.length > 0) {
      const value = searchValue.toLowerCase();
      finalList = finalList.filter((one: keybase) => {
        return allKeys.reduce((prev: boolean, current) => {
          if (one[current] != null) {
            return (one[current] + "").toLowerCase().includes(value) || prev;
          }
          return prev;
        }, false);
      });
    }
    return finalList;
  }, [data, searchValue]);

  const columns = [
    { Header: "Email", accessor: "email" },
    { Header: "QR", accessor: "code" },
    { Header: "Notes", accessor: "notes" },
    { Header: "Account", accessor: "user" }
  ];

  if (!isLoggedIn) {
    return (
      <Container>
        <h1>{process.env.REACT_APP_NAME}</h1>

        <p>You're currently not signed in ;(</p>

        <p>Sign in with link given to you!</p>
      </Container>
    );
  }

  return (
    <Container>
      <p> CLICKING SENDING TICKET WILL AUTOMATICALLY SEND THE TICKET </p>
      <InputGroup>
        <p> Email: </p>
        <Input
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
        ></Input>
        <p> Name/Info</p>
        <Input
          value={note}
          onChange={e => setNote(e.currentTarget.value)}
        ></Input>
        <Button
          onClick={async () => {
            if (!window.confirm("Are you sure? with " + email)) {
              return;
            }
            const ret = await ServerHelper.post(ServerURL.add, {
              ...getCredentials(),
              email: email,
              notes: note
            });
            if (ret.success) {
              setEmail("");
              setNote("");
              createAlert(AlertType.Success, "Made Ticket!");
              updateData();
            } else {
              createAlert(AlertType.Error, "could not create ticket!");
            }
          }}
        >
          Send Ticket
        </Button>
      </InputGroup>
      <br />
      <p>
        You have given {data.length} out of {limit} tickets
      </p>

      <Input
        name="searchValue"
        value={searchValue}
        onChange={event => setSearchValue(event.target.value)}
        placeholder="Search..."
      />
      <ReactTable columns={columns} data={filteredList} />
    </Container>
  );
};

export default LandingPage;

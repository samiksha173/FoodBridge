import { useEffect, useState } from "react";
import Header from "./components/Header";
import Stats from "./components/Stats";
import RequestCard from "./components/RequestCard";
import { getRequests } from "./services/api";

function App() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests().then(setRequests);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Header />
      <Stats />

      <h3>Recent Requests</h3>

      {requests.map((r, i) => (
        <RequestCard key={i} data={r} />
      ))}
    </div>
  );
}

export default App;
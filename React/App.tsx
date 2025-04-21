import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";

function App() {
  const [alertVisible, setAlertVisibility] = useState(false);

  return (
    <div>
      {alertVisible && (
        <Alert onClose={() => setAlertVisibility(false)}>Hello there</Alert>
      )}
      <Button
        onClick={() => {
          setAlertVisibility(true); // show alert when button is clicked
        }}
        color="danger" // use danger color for button
      >
        Click me
      </Button>
    </div>
  );
}

export default App;

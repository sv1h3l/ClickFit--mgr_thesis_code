import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

function index() {

  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello-world")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message); 
      });
  }, []);

  //return <div>{message}</div>;

  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
      <FormControlLabel required control={<Checkbox />} label="Required" />
      <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
    </FormGroup>
  );
}


export default index;

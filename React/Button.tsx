// import react library
import React from "react";

// define props interface
interface Props {
  children: string; // button label text
  onClick: () => void; // click event handler
  color?: "primary" | "secondary" | "danger"; // button color type
}

// button component definition
const Button = ({ children, onClick, color = "primary" }: Props) => {
  return (
    <button type="button" className={"btn btn-" + color} onClick={onClick}>
      {children}
    </button>
  );
};

// export button component
export default Button;

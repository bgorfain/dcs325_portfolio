import { useState } from "react";
// import bootstrap components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

type NavBarProps = {
  toggleFunction: (which) => void;
};

function NavBar({ toggleFunction }: NavBarProps) {
  const [clickCount, setClickCount] = useState(0); // init clickCount is 0

  const handleClick = () => {
    setClickCount(clickCount + 1);
    console.log(`Clicked ${clickCount} times!`);
  };

  // basic outline of the component from the react-bootstrap website
  // we tweak it a little bit to customize for the example
  // eg. Bates logo, click count, and toggle function
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="https://www.bates.edu">
          <img
            src="./src/images/bobcat.png"
            width="80"
            height="80"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="#home"
              onClick={() => {
                handleClick();
                toggleFunction();
              }}
            >
              HTML
            </Nav.Link>

            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

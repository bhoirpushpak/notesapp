import Container from "react-bootstrap/Container";

//Navbar for App
const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Container>
                <h5 className="navbar-brand"><b>Notes App</b></h5>
            </Container>
        </nav>
    );
};
export default NavBar;
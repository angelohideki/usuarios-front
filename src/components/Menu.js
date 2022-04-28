import React from "react";
import { Container, Navbar } from "react-bootstrap";

export default function Menu() {
    return (

        <Navbar bg="primary" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand href="">React</Navbar.Brand>
            </Container>
        </Navbar>

    );
}
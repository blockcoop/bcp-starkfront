import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";
import Wallet from "./Wallet";

const Header = (props) => {
    const router = useRouter();
    return (
        <Navbar expand="lg">
            <Container>
                <Link href="/">
                    <a className="navbar-brand">
                        <Image src="/logo.png" alt="SPAD Logo" width={128} height={64} />
                    </a>
                </Link>
                <Nav id="main-menu" className="justify-content-center fw-bolder">
                    <Link href="/">
                        <a className={router.pathname == "/" ? "nav-link active" : "nav-link"}>Start COOP</a>
                    </Link>
                    <Link href="/view-coops">
                        <a className={router.pathname == "/view-coops" ? "nav-link active" : "nav-link"}>View COOPs</a>
                    </Link>
                    <Link href="/portfolio">
                        <a className={router.pathname == "/portfolio" ? "nav-link active" : "nav-link"}>Portfolio</a>
                    </Link>
                    <Link href="/balance">
                        <a className={router.pathname == "/balance" ? "nav-link active" : "nav-link"}>Balance</a>
                    </Link>
                    <Link href="/children">
                        <a className={router.pathname == "/children" ? "nav-link active" : "nav-link"}>Children</a>
                    </Link>
                </Nav>
                <Nav id="nav-wallet">
                    <Wallet />
                </Nav>
            </Container>
        </Navbar>
    )
}


export default Header;
import { useContext, useEffect, useState } from 'react';
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from 'next/router';

const Nav = () => {
    const [current, setCurrent] = useState("");
    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("auth");
        setState(null);
        router.push("/login");
    }
    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);


    return (
        <nav className="nav bg-dark d-flex justify-content-end">
            <Link href="/">
                <a className={`nav-link text-light logo ${current === '/' && "active"}`}>$OCIALCAMP</a>
            </Link>

            {
                state !== null ? (
                    <>
                        <Link href="/user/dashboard">
                            <a className={`nav-link text-light ${current === "/user/dashboard" && "active"}`}>{state && state.user && state.user.name}</a>
                        </Link>
                        <a onClick={logout} className="nav-link text-light">Logout</a>
                    </>
                ) : <>
                    <Link href="/login">
                        <a className={`nav-link text-light ${current === "/login" && "active"}`}>Login</a>
                    </Link>
                    <Link href="/register">
                        <a className={`nav-link text-light ${current === "/register" && "active"}`}>Register</a>
                    </Link>
                </>
            }





        </nav>
    )
}

export default Nav;
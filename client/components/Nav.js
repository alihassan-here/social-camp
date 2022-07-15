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
        <nav className="nav bg-dark d-flex justify-content-between">
            <Link href="/">
                <a className={`nav-link text-light logo ${current === '/' && "active"}`}>$OCIALCAMP</a>
            </Link>

            {
                state !== null ? (
                    <div className="dropdown nav-link mx-3">
                        <a className="dropdown-toggle text-light" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {state && state.user && state.user.username}
                        </a>
                        <div className="dropdown-menu
                         dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                            <Link href="/user/dashboard">
                                <a className={`nav-link ${current === "/user/dashboard" && "active"} dropdown-item`}>
                                    Dashboard
                                </a>
                            </Link>
                            <Link href="/user/profile/update">
                                <a className={`nav-link ${current === "/user/profile/update" && "active"} dropdown-item`}>
                                    Profile
                                </a>
                            </Link>
                            {
                                state.user.role === 'Admin' && (
                                    <Link href="/admin">
                                        <a className={`nav-link ${current === "/admin" && "active"} dropdown-item`}>
                                            Admin
                                        </a>
                                    </Link>
                                )
                            }
                            <a onClick={logout} className="nav-link dropdown-item">Logout</a>
                        </div>
                    </div>
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
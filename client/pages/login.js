import { useState, useContext, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [state, setState] = useContext(UserContext);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/login`, {
                email,
                password,
            });
            setState({
                user: data.user,
                token: data.token,
            });
            localStorage.setItem("auth", JSON.stringify(data));
            router.push("/user/dashboard");
        } catch (error) {
            toast.error(error.response.data);
            setLoading(false);
        }
    }

    if (state && state.token) router.push("/")

    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-default-image">
                <div className="text-center">
                    <h1>Login</h1>
                </div>
            </div>

            <div className="row py-5">
                <div className="col-12 col-md-6 offset-md-3">

                    <AuthForm
                        handleSubmit={handleSubmit}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                        page="login"
                    />

                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">
                        Not yet registered? <Link href="/register">
                            <a>Register</a>
                        </Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;
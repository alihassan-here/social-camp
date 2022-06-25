import { useState, useContext } from 'react';
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal } from "antd";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from '../context';
import { useRouter } from "next/router";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const [state, setState] = useContext(UserContext);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/register`, {
                name,
                email,
                password,
                secret
            });
            setOk(data.ok);
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setSecret("");
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
                    <h1>Register</h1>
                </div>
            </div>

            <div className="row py-5">
                <div className="col-12 col-md-6 offset-md-3">

                    <AuthForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        secret={secret}
                        setSecret={setSecret}
                        loading={loading}
                    />

                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Modal
                        title="Congratulations!"
                        visible={ok}
                        onCancel={() => setOk(false)}
                        footer={null}
                    >
                        <p>You have successfully registered.</p>
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                    </Modal>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">Already registered? <Link href="/login">
                        <a>Login</a>
                    </Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;
import { useState, useContext } from 'react';
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal } from "antd";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { UserContext } from '../context';
import { useRouter } from "next/router";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const [state, setState] = useContext(UserContext);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/forgot-password`, {
                email,
                newPassword,
                secret
            });
            setOk(data.ok);
            setLoading(false);
            setEmail("");
            setNewPassword("");
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
                    <h1>Forgot Password</h1>
                </div>
            </div>

            <div className="row py-5">
                <div className="col-12 col-md-6 offset-md-3">

                    <ForgotPasswordForm
                        handleSubmit={handleSubmit}
                        email={email}
                        setEmail={setEmail}
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
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
                        <p>Congrats! You can now login with your new password.</p>
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
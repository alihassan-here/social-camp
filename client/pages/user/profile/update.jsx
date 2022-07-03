import { useState, useContext, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal, Avatar } from "antd";
import { LoadingOutlined, CameraOutlined, UserOutlined } from "@ant-design/icons";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from '../../../context';
import { useRouter } from "next/router";


const ProfileUpdate = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [about, setAbout] = useState("");
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    //PROFILE IMAGE
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const [state, setState] = useContext(UserContext);

    useEffect(() => {
        if (state && state.user) {
            setName(state.user.name);
            setUsername(state.user.username);
            setEmail(state.user.email);
            setAbout(state.user.about);
            setImage(state.user.image);
        }

    }, [state && state.user])

    const handleImage = async e => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append("image", file);
        setUploading(true);
        try {
            const { data } = await axios.post("/upload-image", formData);
            setImage({
                url: data.url,
                public_id: data.public_id
            })
            setUploading(false)
        } catch (error) {
            console.log(error);
            setUploading(false)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put(`/profile-update`, {
                name,
                username,
                email,
                password,
                secret,
                about,
                image
            });

            if (data.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                //UPDATE USER EXCEPT TOKEN IN LOCAL STORAGE AFTER UPDATE
                let auth = JSON.parse(localStorage.getItem('auth'));
                auth.user = data;
                localStorage.setItem("auth", JSON.stringify(auth));
                //UPDATE CONTEXT API (global staate)
                setState({ ...state, user: data });
                setOk(true);
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.response.data);
            setLoading(false);
        }
    }


    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-default-image">
                <div className="text-center">
                    <h1>Profile</h1>
                </div>
            </div>

            <div className="row py-5">
                <div className="col-12 col-md-6 offset-md-3">

                    <label className="d-flex justify-content-center upload-icon">
                        {
                            image && image.url ? (
                                <Avatar
                                    size={{
                                        xs: 64,
                                        sm: 80,
                                        md: 100,
                                        lg: 120,
                                        xl: 120,
                                        xxl: 130,
                                    }}
                                    src={image.url} />
                            )
                                : uploading ?
                                    (
                                        <Avatar
                                            size={{
                                                xs: 64,
                                                sm: 80,
                                                md: 100,
                                                lg: 120,
                                                xl: 120,
                                                xxl: 130,
                                            }}
                                            className="mt-1"
                                            icon={<LoadingOutlined
                                            />} />
                                    )
                                    : (
                                        <Avatar
                                            size={{
                                                xs: 64,
                                                sm: 80,
                                                md: 100,
                                                lg: 120,
                                                xl: 120,
                                                xxl: 130,
                                            }}
                                            icon={<UserOutlined />} className="mt-1" />
                                    )
                        }

                        <input
                            onChange={handleImage}
                            type="file"
                            accept='images/*'
                            hidden
                        />
                    </label>

                    <AuthForm
                        profileUpdate={true}
                        handleSubmit={handleSubmit}
                        name={name}
                        username={username}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        secret={secret}
                        setSecret={setSecret}
                        about={about}
                        setAbout={setAbout}
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
                        <p>You have successfully updated your profile!.</p>
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

export default ProfileUpdate;
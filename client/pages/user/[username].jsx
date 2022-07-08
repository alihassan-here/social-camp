import { useContext, useState, useEffect } from 'react';
import { Avatar, Card } from "antd";
import moment from 'moment';
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from 'axios';
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const Username = () => {
    const [user, setUser] = useState({});
    const [state, setState] = useContext(UserContext);
    const router = useRouter();


    useEffect(() => {
        if (state && state.token) fetchUser();
    }, [router.query.username]);


    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`/user/${router.query.username}`);
            setUser(data);
        } catch (error) {
            console.log(error);
        }
    }


    const imageSource = user => {
        if (user.image) return user.image.url;
        return "/images/avatar1.png";
    }



    return (
        <div className="row col-md-6 offset-md-3">
            <div className="pt-5 pb-5">
                <Card hoverable cover={
                    <img src={imageSource(user)} alt={user.name} />
                }
                >
                    <Card.Meta title={user.name} description={user.about} />
                    <p className="pt-2 text-muted">
                        Joined {moment(user.createdAt).fromNow()}
                    </p>
                    <div className="d-flex justify-content-between">
                        <span className="btn btn-sm">
                            {user.followers && user.followers.length} followers
                        </span>
                        <span className="btn btn-sm">
                            {user.following && user.following.length} following
                        </span>
                    </div>
                </Card>
                <Link href="/user/dashboard">
                    <a className="d-flex justify-content-center pt-5">
                        <RollbackOutlined />
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default Username;
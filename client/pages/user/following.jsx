import { useContext, useState, useEffect } from 'react';
import { Avatar, List } from "antd";
import moment from 'moment';
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const Following = () => {
    const [people, setPeople] = useState([]);
    const [state, setState] = useContext(UserContext);
    const router = useRouter();


    useEffect(() => {
        if (state && state.token) fetchFollowing();
    }, [state && state.token]);


    const fetchFollowing = async () => {
        try {
            const { data } = await axios.get("/user-following");
            setPeople(data);
        } catch (error) {
            console.log(error);
        }
    }


    const imageSource = user => {
        if (user.image) return user.image.url;
        return "/images/avatar1.png";
    }

    const handleUnfollow = async user => {
        try {
            const { data } = await axios.put("/user-unfollow", { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));
            //update conext api as well
            setState({ ...state, user: data });
            //UPDATE PEOPLE STATE
            let filtered = people.filter(p => p._id !== user._id);
            setPeople(filtered);
            toast.error(`You've unfollowed ${user.name}`);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="row col-md-6 offset-md-3">
            <List itemLayout="horizontal" dataSource={people} renderItem={user => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={imageSource(user)} icon={
                            !user.image && <UserOutlined />
                        } />}
                        title={
                            <div className="d-flex justify-content-between">
                                {user.username} <span onClick={() => handleUnfollow(user)} className="text-primary pointer">Unfollow</span>
                            </div>
                        } />
                </List.Item>
            )} />
            <Link href="/user/dashboard">
                <a className="d-flex justify-content-center pt-5">
                    <RollbackOutlined />
                </a>
            </Link>
        </div>
    )
}

export default Following;
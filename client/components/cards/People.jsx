import { useContext } from 'react';
import { Avatar, List } from "antd";
import moment from 'moment';
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { UserOutlined } from '@ant-design/icons';

const People = ({ people, handleFollow }) => {
    const [state, setState] = useContext(UserContext);
    const router = useRouter();


    const imageSource = user => {
        if (user.image) return user.image.url;
        return "/images/avatar1.png";
    }


    return (
        <>
            <List itemLayout="horizontal" dataSource={people} renderItem={user => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={imageSource(user)} icon={
                            !user.image && <UserOutlined />
                        } />}
                        title={
                            <div className="d-flex justify-content-between">
                                {user.username} <span onClick={() => handleFollow(user)} className="text-primary pointer">Follow</span>
                            </div>
                        } />
                </List.Item>
            )} />
        </>
    )
}

export default People;
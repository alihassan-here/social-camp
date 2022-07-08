import { useContext } from 'react';
import { Avatar, List } from "antd";
import moment from 'moment';
import { useRouter } from "next/router";
import Link from "next/link";
import { UserContext } from "../../context";
import { UserOutlined } from '@ant-design/icons';
import { imageSource } from '../../helpers';

const People = ({ people, handleFollow, handleUnfollow }) => {
    const [state, setState] = useContext(UserContext);
    const router = useRouter();


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
                                <Link href={`/user/${user.username}`}>
                                    <a>{user.username}</a>
                                </Link>
                                {" "}
                                {
                                    state &&
                                        state.user &&
                                        user.followers &&
                                        user.followers.includes(state.user._id) ? (
                                        <span onClick={() => handleUnfollow(user)} className="text-primary pointer">Unfollow</span>
                                    ) : (
                                        <span onClick={() => handleFollow(user)} className="text-primary pointer">Follow</span>
                                    )
                                }
                            </div>
                        } />
                </List.Item>
            )} />
        </>
    )
}

export default People;
import { useContext } from "react";
import renderHTML from 'react-render-html';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from "next/router";
import { Avatar } from "antd";
import {
    HeartOutlined,
    HeartFilled,
    CommentOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import PostImage from '../images/PostImage';
import { UserContext } from "../../context";
import { imageSource } from "../../helpers";
import Post from "./Post";


const PostList = ({
    posts,
    handleDelete,
    handleLike,
    handleUnlike,
    handleComment,
    removeComment,
}) => {

    const [state] = useContext(UserContext);
    const router = useRouter();
    return <>
        {
            posts && posts.map(post => (
                <Post
                    key={post._id}
                    post={post}
                    handleLike={handleLike}
                    handleUnlike={handleUnlike}
                    handleComment={handleComment}
                    handleDelete={handleDelete}
                    removeComment={removeComment}
                />
            )
            )
        }
    </>
}

export default PostList;
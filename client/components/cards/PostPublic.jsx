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

const PostPublic = ({
    post,
    handleDelete,
    handleLike,
    handleUnlike,
    handleComment,
    commentsCount = 2,
    removeComment
}) => {

    const [state] = useContext(UserContext);
    const router = useRouter();
    return (
        <>
            {
                post && post.postedBy && (
                    <div key={post._id} className="card mb-5">
                        <div className="card-header">
                            <Avatar size={40} src={imageSource(post.postedBy)} />
                            {" "}
                            <span className="pt-2 mx-1">
                                <b>{post.postedBy.name}</b>
                            </span>
                            <span className="pt-2" style={{ margin: "1rem" }}>
                                {moment(post.createdAt).fromNow()}
                            </span>
                        </div>
                        <div className="card-body">
                            {renderHTML(post.content)}
                        </div>
                        <div className="card-footer">
                            {
                                post.image && <PostImage url={post.image.url} />
                            }
                            <div className="d-flex pt-2">
                                {
                                    state
                                        && state.user
                                        && post.likes
                                        && post.likes.includes(state.user._id) ? (
                                        <HeartFilled
                                            className="text-danger pt-2 h5 px-2"
                                        />
                                    )
                                        : (
                                            <HeartOutlined
                                                className="text-danger pt-2 h5 px-2"
                                            />
                                        )
                                }
                                <div className="pt-2 px-2" >{post.likes.length} likes</div>
                                <CommentOutlined
                                    className="text-danger pt-2 h5 px-2"
                                />
                                <div className="pt-2 px-2">
                                    {post.comments.length} comments
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default PostPublic;
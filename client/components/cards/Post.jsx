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

const Post = ({
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
                                            onClick={() => handleUnlike(post._id)}
                                            className="text-danger pt-2 h5 px-2"
                                        />
                                    )
                                        : (
                                            <HeartOutlined
                                                onClick={
                                                    () => handleLike(post._id)
                                                }
                                                className="text-danger pt-2 h5 px-2"
                                            />
                                        )
                                }
                                <div className="pt-2 px-2" >{post.likes.length} likes</div>
                                <CommentOutlined
                                    onClick={() => handleComment(post)}
                                    className="text-danger pt-2 h5 px-2"
                                />
                                <div className="pt-2 px-2">
                                    <Link href={`/post/${post._id}`}>
                                        <a>{post.comments.length} comments</a>
                                    </Link>
                                </div>
                                {
                                    state && state.user && state.user._id === post.postedBy._id && (
                                        <>
                                            <EditOutlined
                                                onClick={() => router.push(`/user/post/${post._id}`)}
                                                className="text-danger pt-2 h5 px-2 mx-auto" />
                                            <DeleteOutlined
                                                onClick={() => handleDelete(post)}
                                                className="text-danger pt-2 h5 px-2" />
                                        </>
                                    )
                                }

                            </div>
                        </div>
                        {post.comments && post.comments.length > 0 && (
                            <ul className="List-group" style={{ maxHeight: "125px", overflow: "scroll" }}>
                                {
                                    post.comments.slice(0, commentsCount).map(c => (
                                        <li className="list-group-item
                                d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div>
                                                    <Avatar
                                                        size={20}
                                                        className="mb-1 mx-1"
                                                        src={imageSource(c.postedBy)}
                                                    />
                                                    {c.postedBy.name}
                                                </div>
                                                <div>{c.text}</div>
                                            </div>
                                            <span className="badge rounded-pill text-muted">{moment(c.created).fromNow()}
                                                {state && state.user && state.user._id === c.postedBy._id && (
                                                    <div className="ml-auto mt-1">
                                                        <DeleteOutlined
                                                            onClick={() => removeComment(post._id, c)}
                                                            className="pl-2 text-danger"
                                                        />
                                                    </div>
                                                )}
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        )}
                    </div>
                )
            }
        </>
    )
}

export default Post;
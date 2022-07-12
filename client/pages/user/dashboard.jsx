import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal, Pagination } from "antd";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from '../../components/forms/PostForm';
import PostList from '../../components/cards/PostList';
import People from '../../components/cards/People';
import CommentForm from '../../components/forms/CommentForm';
import Search from "../../components/Search";
import io from 'socket.io-client';


const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
    reconnection: true,
});

const Dashboard = () => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [people, setPeople] = useState([]);
    const [comment, setComment] = useState("");
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});
    //PAGINATION
    const [totalPosts, setTotalPosts] = useState(0);
    const [page, setPage] = useState(1);


    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFeed();
            findPeople();
        }
    }, [state && state.token, page]);

    useEffect(() => {
        try {
            axios.get("/total-posts").then(({ data }) => setTotalPosts(data));
        } catch (error) {
            console.log(error);
        }
    }, []);

    const newsFeed = async () => {
        try {
            const { data } = await axios.get(`/news-feed/${page}`);
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    }

    const findPeople = async () => {
        try {
            const { data } = await axios.get("/find-people");
            setPeople(data);
        } catch (error) {
            console.log(error);
        }
    }

    const postSubmit = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/create-post", { content, image });
            if (data.error) {
                toast.error(data.error);
            } else {
                setPage(1);
                newsFeed();
                toast.success("Post created!");
                setContent("");
                setImage({});
                //SOCKET
                socket.emit("new-post", data);
            }

        } catch (error) {
            console.log(error);
        }
    }

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

    const handleDelete = async post => {
        try {
            const answer = window.confirm("Are you sure?");
            if (!answer) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            toast.error("Post deleted!");
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    }

    const handleFollow = async user => {
        try {
            const { data } = await axios.put("/user-follow", { _id: user._id });
            //update localStorage user except token
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));
            //update conext api as well
            setState({ ...state, user: data });
            //UPDATE PEOPLE STATE
            let filtered = people.filter(p => p._id !== user._id);
            setPeople(filtered);
            //RERENDER THE POSTS IN NEWS FEED
            newsFeed();
            toast.success(`Now you're following ${user.name}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = async _id => {
        try {
            const { data } = await axios.put("/like-post", { _id });
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnlike = async _id => {
        try {
            const { data } = await axios.put("/unlike-post", { _id });
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    }

    const handleComment = post => {
        setCurrentPost(post);
        setVisible(true);
    }

    const addComment = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.put("/add-comment", {
                postId: currentPost._id,
                comment
            });
            setComment("");
            setVisible(false);
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    }

    const removeComment = async (postId, comment) => {
        let answer = window.confirm("Are you sure you want to remove");
        if (!answer) return;
        try {
            const { data } = await axios.put("/remove-comment", {
                postId,
                comment
            });
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <UserRoute>
            <div className="container-fluid">
                <div className="row py-5 text-light bg-default-image">
                    <div className="text-center">
                        <h1>News Feed</h1>
                    </div>
                </div>
            </div>
            <div className="row py-3" style={{ margin: 0 }}>
                <div className="col-md-8">
                    <PostForm
                        content={content}
                        setContent={setContent}
                        postSubmit={postSubmit}
                        handleImage={handleImage}
                        uploading={uploading}
                        image={image}
                    />
                    <PostList
                        posts={posts}
                        handleDelete={handleDelete}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                        handleComment={handleComment}
                        removeComment={removeComment}
                    />
                    <Pagination
                        current={page}
                        total={(totalPosts / 3) * 10}
                        onChange={value => setPage(value)}
                        className="pb-5"
                    />
                </div>
                <div className="col-md-4">
                    <Search />
                    <br />
                    {
                        state && state.user && state.user.following && (
                            <Link href={"/user/following"}>
                                <a className="h6">{state.user.following.length} Following</a>
                            </Link>
                        )
                    }
                    <People people={people} handleFollow={handleFollow} />
                </div>
                <Modal
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    title="Comment"
                    footer={null}
                >

                    <CommentForm
                        comment={comment} setComment={setComment} addComment={addComment}
                    />
                </Modal>
            </div>
        </UserRoute>
    )
}

export default Dashboard;
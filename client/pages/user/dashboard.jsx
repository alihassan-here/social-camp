import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from '../../components/forms/PostForm';
import PostList from '../../components/cards/PostList';
import People from '../../components/cards/People';

const Dashboard = () => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [people, setPeople] = useState([]);

    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFeed();
            findPeople();
        }
    }, [state && state.token]);

    const newsFeed = async () => {
        try {
            const { data } = await axios.get("/news-feed");
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
                newsFeed();
                toast.success("Post created!");
                setContent("");
                setImage({})
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
                    />
                </div>
                <div className="col-md-4">
                    {
                        state && state.user && state.user.following && (
                            <Link href={"/user/following"}>
                                <a className="h6">{state.user.following.length} Following</a>
                            </Link>
                        )
                    }
                    <People people={people} handleFollow={handleFollow} />
                </div>
            </div>
        </UserRoute>
    )
}

export default Dashboard;
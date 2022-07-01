import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import { toast } from "react-toastify";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import CreatePostForm from '../../components/forms/CreatePostForm';
import PostList from '../../components/cards/PostList';

const Dashboard = () => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [posts, setPosts] = useState([]);

    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) fetchUserPosts();
    }, [state && state.token]);

    const fetchUserPosts = async () => {
        try {
            const { data } = await axios.get("/user-posts");
            setPosts(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    const postSubmit = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/create-post", { content, image });
            console.log("create post response", data);
            if (data.error) {
                toast.error(data.error);
            } else {
                fetchUserPosts();
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

    return (
        <UserRoute>
            <div className="container-fluid">
                <div className="row py-5 text-light bg-default-image">
                    <div className="text-center">
                        <h1>News Feed</h1>
                    </div>
                </div>
            </div>
            <div className="row py-3">
                <div className="col-md-8">
                    <CreatePostForm
                        content={content}
                        setContent={setContent}
                        postSubmit={postSubmit}
                        handleImage={handleImage}
                        uploading={uploading}
                        image={image}
                    />
                    <PostList posts={posts} />
                </div>
                <div className="col-md-4">Sidebar</div>
            </div>
        </UserRoute>
    )
}

export default Dashboard;
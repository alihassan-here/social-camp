import { useContext, useState } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import { toast } from "react-toastify";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import CreatePostForm from '../../components/forms/CreatePostForm';

const Dashboard = () => {
    const [content, setContent] = useState("");
    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    const postSubmit = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/create-post", { content });
            console.log("create post response", data);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Post created!");
                setContent("");
            }

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
            <div className="row py-3">
                <div className="col-md-8">
                    <CreatePostForm
                        content={content}
                        setContent={setContent}
                        postSubmit={postSubmit}
                    />
                </div>
                <div className="col-md-4">Sidebar</div>
            </div>
        </UserRoute>
    )
}

export default Dashboard;
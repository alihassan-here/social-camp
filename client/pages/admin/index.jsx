import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import axios from 'axios';
import { toast } from "react-toastify";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import renderHTML from 'react-render-html';

const Admin = () => {
    const [posts, setPosts] = useState([]);
    const [state, setState] = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFeed();
        }
    }, [state && state.token]);

    const newsFeed = async () => {
        try {
            const { data } = await axios.get(`/posts`);
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async post => {
        try {
            const answer = window.confirm("Are you sure?");
            if (!answer) return;
            const { data } = await axios.delete(`/admin/delete-post/${post._id}`);
            toast.error("Post deleted!");
            newsFeed();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AdminRoute>
            <div className="container-fluid">
                <div className="row py-5 text-light bg-default-image">
                    <div className="text-center">
                        <h1>ADMIN</h1>
                    </div>
                </div>
                <div className="row py-4">
                    <div className="col-md-8 offset-md-2">
                        {
                            posts && posts.map(post => (
                                <div key={post._id} className="d-flex justify-content-between">
                                    <div>
                                        {renderHTML(post.content)} - <b>{post.postedBy.name}
                                        </b>
                                    </div>
                                    <div
                                        onClick={() => handleDelete(post)}
                                        className="text-danger">Delete</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </AdminRoute >
    )
}

export default Admin;
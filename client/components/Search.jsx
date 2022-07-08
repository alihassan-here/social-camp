import { useContext, useState } from 'react';
import { UserContext } from "../context";
import axios from 'axios';
import People from "../components/cards/People";
import toast from 'react-toastify';

const Search = () => {
    const [state, setState] = useContext(UserContext);

    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);

    const searchUser = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/search-user/${query}`);
            setResult(data);
            setQuery("");
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
            let filtered = result.filter(p => p._id !== user._id);
            setResult(filtered);
            toast.success(`Now you're following ${user.name}`);
        } catch (error) {
            console.log(error);
        }
    }
    const handleUnfollow = async user => {
        try {
            const { data } = await axios.put("/user-unfollow", { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));
            //update conext api as well
            setState({ ...state, user: data });
            //UPDATE PEOPLE STATE
            let filtered = result.filter(p => p._id !== user._id);
            setResult(filtered);
            toast.error(`You've unfollowed ${user.name}`);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <form className="form-inline row" onSubmit={searchUser}>
                <div className="col-8">
                    <input
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setResult([]);
                        }}
                        className="form-control"
                        placeholder="search"
                        type="text"
                    />
                </div>
                <div className="col-4">
                    <button type="submit" className="btn btn-outline-primary col-12">Search</button>
                </div>
            </form>
            {
                result && result.map(r => (
                    <People
                        key={r._id}
                        people={result}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                    />
                ))
            }
        </>
    )
}

export default Search;
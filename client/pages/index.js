import axios from "axios";
import { useState, useContext, useEffect } from "react";
import ParallaxBg from '../components/cards/ParallaxBG';
import { UserContext } from '../context';
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";
import io from 'socket.io-client';


const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
    reconnection: true,
});

const Home = ({ posts }) => {
    const [state, setState] = useContext(UserContext);
    const [newFeed, setNewFeed] = useState([]);


    useEffect(() => {
        socket.on("new-post", newPost => {
            setNewFeed([newPost, ...posts]);
        })

    }, []);

    const collection = newFeed.length > 0 ? newFeed : posts;


    const head = () => {
        <Head>
            <title>SOCIALCAMP - A social network by devs for devs</title>
            <meta
                name="description"
                content="A social network by developers for other developers"
            />
            <meta
                property="og:description"
                content="A social network by developers for other developers"
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:site_name"
                content="SOCIALCAMP"
            />
            <meta
                property="og:url"
                content="http://socialcamp.com"
            />
            <meta
                property="og:image:secure_url"
                content="http://socialcamp.com/images/default.jpg"
            />
        </Head>
    }


    return (
        <>
            {head()}
            <ParallaxBg url="/images/default.jpg" />
            <div className="container">
                <div className="row pt-5">
                    {
                        collection && collection.map((post) => (
                            <div className="col-md-4" key={post._id}>
                                <Link
                                    href={`/view/${post._id}`}
                                >
                                    <a>
                                        <PostPublic post={post} />
                                    </a>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async ({
    params,
    res
}) => {
    try {
        const { data } = await axios.get("/posts");
        return {
            props: {
                posts: data,
            }
        }
    } catch (error) {
        res.statusCode = 404;
        return {
            props: {}
        };
    }
}

export default Home;
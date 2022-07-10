import axios from "axios";
import { useContext } from "react";
import ParallaxBg from '../components/cards/ParallaxBG';
import { UserContext } from '../context';
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";

const Home = ({ posts }) => {
    const [state, setState] = useContext(UserContext);


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
                        posts.map((post) => (
                            <div className="col-md-4">
                                <Link
                                    href={`/view/${post._id}`}
                                    key={post._id}
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

export async function getServerSideProps() {
    const { data } = await axios.get("/posts");
    return {
        props: {
            posts: data,
        }
    }
}

export default Home;
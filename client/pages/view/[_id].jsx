import axios from "axios";
import ParallaxBg from '../../components/cards/ParallaxBG';
import PostPublic from "../../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const SinglePost = ({ post }) => {
    const router = useRouter();

    const head = () => {
        <Head>
            <title>SOCIALCAMP - A social network by devs for devs</title>
            <meta
                name="description"
                content={post.content}
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
                content={`http://socialcamp.com/post/view/${post._id}`}
            />
            <meta
                property="og:image:secure_url"
                content={imageSource(post)}
            />
        </Head>
    }

    const imageSource = post => {
        if (post.image) return post.image.url;
        return "/images/default.jpg";
    }


    return (
        <>
            {head()}
            <ParallaxBg url="/images/default.jpg" />
            <div className="container">
                <div className="row pt-5">
                    <div className="col-md-8 offset-md-2">
                        <PostPublic post={post} />
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const { data } = await axios.get(`/post/${context.params._id}`);
    return {
        props: {
            post: data,
        }
    }
}

export default SinglePost;
import Image from 'next/image'
import { useContext } from "react";
import { UserContext } from '../context';

const Home = () => {
    const [state, setState] = useContext(UserContext);


    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Home Page</h1>
                    <Image
                        src="/images/default.jpg"
                        alt="home-image"
                        width={700}
                        height={600}
                        className="main-image"
                    />
                </div>
            </div>
        </div>
    )
}

export default Home;
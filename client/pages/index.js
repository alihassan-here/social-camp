import Image from 'next/image'

const Home = () => {
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
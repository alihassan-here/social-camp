import Image from 'next/image'

const Home = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Home Page</h1>
                    <Image src="/images/default.jpg" alt="home-image" width={500}
                        height={500} />
                </div>
            </div>
        </div>
    )
}

export default Home;
import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
    handleSubmit,
    name,
    username,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    secret,
    setSecret,
    about,
    setAbout,
    loading,
    page,
    profileUpdate
}) => {
    return (
        <form onSubmit={handleSubmit}>
            {
                page !== "login" && (
                    <div className="form-group p-2">
                        <small>
                            <h6 className="text-muted">
                                Your name
                            </h6>
                        </small>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            type="text" className="form-control"
                            placeholder="Enter name"
                        />
                    </div>
                )
            }
            {
                profileUpdate && (
                    <div className="form-group p-2">
                        <small>
                            <h6 className="text-muted">
                                username
                            </h6>
                        </small>
                        <input
                            readOnly={true}
                            defaultValue={username}
                            type="text" className="form-control"
                        />
                    </div>
                )
            }
            <div className="form-group p-2">
                <small>
                    <h6 className="text-muted">
                        Email address
                    </h6>
                </small>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email" className="form-control"
                    placeholder="Enter email"
                    readOnly={profileUpdate}
                />
            </div>
            <div className="form-group p-2">
                <small>
                    <h6 className="text-muted">
                        Password
                    </h6>
                </small>
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password" className="form-control"
                    placeholder="Enter password"
                />
            </div>
            {
                page !== "login" && (
                    <>
                        <div className="form-group p-2">
                            <small>
                                <h6 className="text-muted">Pick a question</h6>
                            </small>
                            <select className="form-control">
                                <option>What is your favourite color?</option>
                                <option>What is your best friend's name?</option>
                                <option>What city you were born?</option>
                            </select>
                            <small className="text-muted form-text">
                                You can use this to reset your password if forgotten.
                            </small>
                        </div>
                        <div className="form-group p-2">
                            <input
                                value={secret}
                                onChange={e => setSecret(e.target.value)}
                                type="text"
                                className="form-control"
                                placeholder="Write your answer here"
                            />
                        </div>
                    </>
                )
            }
            {
                profileUpdate && <div className="form-group p-2">
                    <small>
                        <h6 className="text-muted">
                            About
                        </h6>
                    </small>
                    <textarea
                        rows={5}
                        value={about}
                        onChange={e => setAbout(e.target.value)}
                        type="text" className="form-control"
                        placeholder="Write about yourself"
                    />
                </div>
            }
            <div className="form-group p-2">
                <button
                    disabled={
                        profileUpdate
                            ? loading :
                            page === "login"
                                ? !email || !password || loading
                                :
                                !name || !email || !password || !secret || loading}
                    type="submit" className="btn btn-primary col-12"
                >
                    {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
                </button>
            </div>
        </form>
    )
}

export default AuthForm;
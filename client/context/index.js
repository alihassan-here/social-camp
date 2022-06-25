import { useState, createContext, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/router";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [state, setState] = useState({
        user: {},
        token: "",
    });
    const router = useRouter();

    useEffect(() => {
        setState(JSON.parse(localStorage.getItem('auth')));
    }, []);


    //DEFAULT AXIOS SETTING
    const token = state && state.token ? state.token : "";
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    //IF TOKEN GOT EXPIRED THEN WE'LL LOGOUT USER USING AXIOS
    axios.interceptors.response.use(
        function (response) {
            return response;
        }, function (error) {
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                setState(false);
                localStorage.removeItem("auth");
                router.push("/login");
            }
        });

    return (
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };
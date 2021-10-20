import { useReducer, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Initial state
const initialState = {
    user: null,
};

// Create context
const Context = createContext();

// Root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
};

// Context provider
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);

    // Router   
    const router = useRouter();

    useEffect(() => {
        dispatch({
            type: 'LOGIN',
            payload: JSON.parse(window.localStorage.getItem('user')),
        });
    }, []);

    axios.interceptors.response.use(
        function (response) {
            // Any status code within 2xx range will trigger this function
            return response;
        },
        function (error) {
            // Any status code outside 2xx range will trigger this function
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                return new Promise((resolve, reject) => {
                    axios.get('/api/logout')
                        .then((data) => {
                            console.log('/401 error -> logout');
                            dispatch({ type: 'LOGOUT' });
                            window.localStorage.removeItem('user');
                            router.push('/login');
                        })
                        .catch(err => {
                            console.log('AXIOS INTERCEPTORS ERR', err);
                            reject(error);
                        });
                });
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token');
            // console.log("CSRF", data);
            axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken;
        };
        getCsrfToken();
    }, []);

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export { Context, Provider };
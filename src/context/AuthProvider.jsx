import React, { useReducer } from 'react';
import AuthContext from './AuthContext';


const initialState = {
    token: localStorage.getItem('authToken') || null,
    // token: localStorage.getItem('authToken'),
    user: null

};

// console.log("Token from localStorage:", localStorage.getItem('authToken'));



const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                token: action.token,
                user: action.user
            };
        case 'LOGOUT':
            localStorage.removeItem('authToken');
            return initialState;
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

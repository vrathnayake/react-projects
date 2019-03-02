import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () =>{
    return{
        type: actionTypes.AUTH_START
    };

};

export const authSucess = (token, userId) =>{
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };

};

export const authFail = (error) =>{
    return{
        type: actionTypes.AUTH_FAIL,
        error: error
    };

};

export const logout = () =>{
    return{
        type: actionTypes.AUTH_LOGOUT,

    }
};

export const checkAuthTimeOut = (expiresIn) =>{
    return dispatch=>{
        setTimeout(()=>{
            dispatch(logout())
        },expiresIn * 1000);
    };

};

export const setAuthRedirectPath = (path) =>{
    return {
        type: actionTypes.SET_AUTH_PATH,
        path:path
    };

};

export const auth = (email, password, isSignUp) =>{
    return dispatch=>{
        dispatch(authStart());
        const authdata ={
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAmDI13zPqC60Gkh1wC-KqaOFKbkkc2-44';
        if(!isSignUp){
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAmDI13zPqC60Gkh1wC-KqaOFKbkkc2-44'
        }
        axios.post(url, authdata)
        .then((response)=>{
            console.log(response);
            dispatch(authSucess(response.data.idToken,response.data.localId));
            dispatch(checkAuthTimeOut(response.data.expiresIn));
        })
        .catch((err)=>{
            console.log(err.response);
            dispatch(authFail(err.response.data.error));
        });
    };

};



import React, { useState } from 'react'
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action'


function LoginPage(props){
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {

        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {

        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {

        event.preventDefault();             // 페이지가 리프레쉬 되는것을 막기위해 해준다.

        console.log("email" , Email);
        console.log("Password" , Password);

        let body = {
            email : Email ,
            password : Password
        }

        dispatch(loginUser(body))
            .then(response => {
                console.dir(response);
                if(response.payload.loginSuccess){
                    props.history.push("/");
                }else{
                    alert("Error");
                }
            })

    }
    return (
        <div>
            <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center'
            , width : '100%' , height : '100vh'}}>
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password}  onChange={onPasswordHandler}/>
                <br/>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
        </div>
    )
}

export default LoginPage
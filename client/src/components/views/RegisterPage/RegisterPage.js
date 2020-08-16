import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action'


function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (event) => {

        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {

        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {

        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {

        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {

        event.preventDefault();             // 페이지가 리프레쉬 되는것을 막기위해 해준다.

        if(Password !== ConfirmPassword){
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        console.log("email" , Email);
        console.log("Password" , Password);
        console.log("name" , Name);

        let body = {
            email : Email ,
            password : Password ,
            name : Name ,

        }

        dispatch(registerUser(body))
            .then(response => {
                console.dir(response);
                if(response.payload.success){
                    props.history.push("/login");
                }else{
                    alert("Failed to sign up");
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
                
                <label>Name</label>
                <input type="test" value={Name}  onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password}  onChange={onPasswordHandler}/>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword}  onChange={onConfirmPasswordHandler}/>
                <br/>
                <button type="submit">
                    회원가입
                </button>
            </form>
             </div>
        </div>
    )
}
export default RegisterPage
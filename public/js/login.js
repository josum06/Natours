
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async(email,password)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data:{
                email,
                password
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }
       
    }
    catch(err){
        if (err.response) {
            // Server responded with a non-2xx status code
            const { message } = err.response.data;
            showAlert('error', message || 'Something went wrong!');
          } else if (err.request) {
            // No response received
            showAlert('error', 'No response from server. Check your connection.');
          } else {
            // Other errors
            showAlert('error', err.message);
          }
        }
    };

export const signup = async(name,email,password,passwordConfirm)=>{
        try{
            const res = await axios({
                method: 'POST',
                url: '/api/v1/users/signup',
                data:{
                    name,
                    email,
                    password,
                    passwordConfirm
                }
            });
    
            if(res.data.status === 'success'){
                showAlert('success', 'Signed Up successfully');
                window.setTimeout(()=>{
                    location.assign('/login');
                },1500);
            }
           
        }
        catch(err){
            if (err.response) {
                // Server responded with a non-2xx status code
                const { message } = err.response.data;
                showAlert('error', message || 'Something went wrong!');
              } else if (err.request) {
                // No response received
                showAlert('error', 'No response from server. Check your connection.');
              } else {
                // Other errors
                showAlert('error', err.message);
              }
            }
        };
    

export const logout = async() =>{
    try{
     const res = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000/api/v1/users/logout'
     });

     if(res.data.status === 'success'){
        location.reload(true);
     }
    }
    catch(err){
        showAlert('error', 'Failed to log out try again');
    }
}
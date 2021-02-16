const username=document.querySelector("#username");
const email=document.querySelector("#email");
const password=document.querySelector("#password");
const signupbtn=document.querySelector("#signupbtn");

$('#failure').hide();

let validEmail=false;
let validUsername=false;
let validPassword=false;

//When someone enter username we perfoem basic validation through regular expression
username.addEventListener('blur',function(){

    //validate username
    let re=/^[a-zA-z]([0-9a-zA-z\s]){4,14}$/;
    let s=username.value;
    if(re.test(s)){
        console.log("Your name is valid");
        username.classList.add('is-valid');
        username.classList.remove('is-invalid');
        validUsername=true;
    }else{
        console.log("Your name is not valid");
        username.classList.add('is-invalid');
        validUsername=false;
    }
})

//When email input box is written we form a validation wheteher it is right details or not
email.addEventListener('blur',function(){
    
    //validate email
    let re=/^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-z]){2,7}$/;
    let s=email.value;
    if(re.test(s)){
        console.log("Your email is valid");
        email.classList.add('is-valid');
        email.classList.remove('is-invalid');
        validEmail=true;
    }else{
        console.log("Your email is not valid");
        email.classList.add('is-invalid');
        validEmail=false;
    }
})

//When someone types a password we perform basic validation on the password through regular expresssion
password.addEventListener('blur',function(){
    
    //validate password
    let re = /^(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,15}$/;
    let s=password.value;
    if(re.test(s)){
        console.log("Your password is valid");
        password.classList.add('is-valid');
        password.classList.remove('is-invalid');
        validPassword=true;
    }else{
        console.log("Your password is not valid");
        password.classList.add('is-invalid');
        validPassword=false;
    }
})

signupbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    
    //Submit your form here
    if(validEmail && validUsername && validPassword){
       window.location="/signup";
    }else{ 
        console.log('One of Password,email and user are invalid.Hence not submitting the form.Please correct the error');
        let failure=document.querySelector('#failure');
        failure.classList.add('show');
        $('#failure').show();
    }
    
})
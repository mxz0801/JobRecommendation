;(function(){  //IIFE
    //dom elements
    // get all elements
    var oAvatar = document.getElementById('avatar'),
        oWelcomeMsg = document.getElementById('welcome-msg'),
        oLogoutBtn = document.getElementById('logout-link'),
        oRegisterFormBtn = document.getElementById('register-form-btn'),
        oLoginBtn = document.getElementById('login-btn'),
        oLoginForm = document.getElementById('login-form'),
        oLoginUsername = document.getElementById('username'),
        oLoginPwd = document.getElementById('password'),
        oLoginFormBtn = document.getElementById('login-form-btn'),
        oLoginErrorField = document.getElementById('login-error'),
        oRegisterBtn = document.getElementById('register-btn'),
        oRegisterUsername = document.getElementById('register-username'),
        oRegisterPwd = document.getElementById('register-password'),
        oRegisterFirstName = document.getElementById('register-first-name'),
        oRegisterLastName = document.getElementById('register-last-name'),
        oRegisterForm = document.getElementById('register-form'),
        oRegisterResultField = document.getElementById('register-result'),
        oNearbyBtn = document.getElementById('nearby-btn'),
        oRecommendBtn = document.getElementById('recommend-btn'),
        oNavBtnList = document.getElementsByClassName('main-nav-btn'),
        oItemNav = document.getElementById('item-nav'),
        oItemList = document.getElementById('item-list'),
        userId = '1111',
        userFullName = 'John',
        lng = -122.08,
        lat = 37.38;

    //entry fn - init fn

    function init(){
        console.log("init");
        //validation section  -->after ajax
        validateSession();
        //persistent login
        //to show login form


        //bind events
        bindEvent();

    }

    function validateSession(){
        //show login form
        showOrHideElement(oAvatar,'none');
        showOrHideElement(oWelcomeMsg,'none');
        showOrHideElement(oLogoutBtn,'none');

        showOrHideElement(oItemList,'none');
        showOrHideElement(oItemNav,'none');

        showOrHideElement(oRegisterForm,'none');

        //hide the rest
    }

    function bindEvent(){
        oRegisterFormBtn.addEventListener('click',function (){
            console.log('click register0');
            switchLoginRegister('register');


            showOrHideElement(oAvatar,'none');
            showOrHideElement(oWelcomeMsg,'none');
            showOrHideElement(oLogoutBtn,'none');

            showOrHideElement(oItemList,'none');
            showOrHideElement(oItemNav,'none');

            showOrHideElement(oLoginForm,'none');

            showOrHideElement(oRegisterForm,'block');

        },false)

        oLoginFormBtn.addEventListener('click',function (){
            console.log('click login');

            switchLoginRegister('login');
        },false)
    }

    function switchLoginRegister(name){
        //hide header
        showOrHideElement(oAvatar,'none');
        showOrHideElement(oWelcomeMsg,'none');
        showOrHideElement(oLogoutBtn,'none');
        //hide item list
        showOrHideElement(oItemNav,'none');
        showOrHideElement(oItemList,'none');
        //case 1: name == login
        if(name ==='login'){
            //hide register
            showOrHideElement(oRegisterForm,'none');
            //clear register error
            oRegisterResultField.innerHTML="";
            //show login
            showOrHideElement(oLoginForm,'block');
        }else{
            //case 2: name == register
            if(name ==='register'){
            //hide login
            showOrHideElement(oLoginForm,'none');
            //clear login err msg
            oLoginErrorField.innerText='';
            //show register
            showOrHideElement(oRegisterForm,'block');

            }
        }
    }

    function showOrHideElement(ele, style){
        // css --> display
        ele.style.display = style;
    }




    //data manager



    init();

})()


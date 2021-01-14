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

        oTpl = document.getElementById('tpl').innerHTML,

        userId = '1111',
        userFullName = 'John',
        lng = -122.419416,
        lat = 37.774929;

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

        //click login
        oLoginBtn.addEventListener('click',loginExecutor,
            false);

        //click item btn
        oItemList.addEventListener('click', changeFavoriteItem,false);
    }
    function loginExecutor(){
        var username = oLoginUsername.value;
        var password = oLoginPwd.value;

        if(username==='' || password===''){
            oLoginErrorField.innerHTML="Please fill in all fields";
        }
        password = md5(username+ md5(password));
        console.log(username,password);
        //ajax -> server username/pwd validation
        ajax({
            method:'POST',
            url:'./login',
            data:{
                user_id: username,
                password:password
            },
            success:function(res){
                console.log(res);
                if(res.status ==='OK'){
                    //show welcome msg
                    welcomeMsg(res);

                    //fetch data
                    fetchData();
                }
            },
            error:function (){
                throw new Error("Invalid username or password");
            }
        })
    }

    //change favorite
    function changeFavoriteItem(evt){
        //console.log(evt.target);
        var tar = evt.target;
        var oParnet = tar.parentElement;

        if(oParnet && oParnet.className ==='fav-link'){
            //find it
            var oCurLi= oParnet.parentElement,
                classname = tar.className,
                isFavorite = classname ==='fa fa heart' ? true:false,
                oItems = oItemList.getElementsByClassName('item'),
                index = Array.prototype.indexOf.call(oItems,oCurLi);

            console.log(index);
        }
    }

    function fetchData(){
        //get geolocation
        initGeo(loadNearbyData);
    }

    function loadNearbyData(){
        activeBtn('nearby-btn');
        oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>Loading  item...</p>';
        var opt = {
            method: 'GET',
            url: './search?user_id=' + userId + '&lat=' + lat + '&lon=' + lng,
            data: null,
            message: 'nearby'
        }
        //fetch nearby data
        ajax({
            method:opt.method,
            url:opt.url,
            data:opt.data,
            success:function (res){
                console.log(res);
                //case1: dataset is ull || empty
                if(!res || res.length ===0){
                    oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>No nearby item.</p>';
                }else{
                    //casae2:dataset is not empty
                    //render data
                    render(res);
                }
            },
            error:function (){
                throw new Error('No nearby data')
            }
        })
    }

    function render(data){
        var len = data.length,
            list = '',
            item;

        for(var i = 0 ;i<len;i++){
            item = data[i];
            list += oTpl.replace(/{{(.*?)}}/g, function (node,key){
                if (key === 'company_log'){
                    return item[key] ||'https://via.placeholder.com/100';
                }
                if (key === 'location') {
                    return item[key].replace(/,/g, '<br/>').replace(/\"/g, '');
                }
                if (key === 'favorite') {
                    return item[key] ? "fa fa-heart" : "fa fa-heart-o";
                }
                return item[key];
            })
        }
        oItemList.innerHTML = list;
    }
    function activeBtn(btnId){
        var len = oNavBtnList.length;
        for (var i = 0; i < len; i++) {
            //remove active
            oNavBtnList[i].className = 'main-nav-btn';
        }
        var btn = document.getElementById(btnId);
        btn.className += ' active';
    }
    function initGeo(cb){
        if(window.navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function (posistion){
                console.log(posistion)
                lat=posistion.coords.latitude || lat;
                lng = posistion.coords.longitude ||lng;
                cb()
                },
                function (){
                throw new Error('Geo location fetch failed!')
                },{maximumAge:6000})
        }
    }
    function welcomeMsg(msg){
        userId = msg.user_id;
        userFullName = msg.name;
        oWelcomeMsg.innerHTML = 'Welcome ' +userFullName;

        // show welcome, avatar, item area, logout btn
        showOrHideElement(oWelcomeMsg, 'block');
        showOrHideElement(oAvatar, 'block');
        showOrHideElement(oItemNav, 'block');
        showOrHideElement(oItemList, 'block');
        showOrHideElement(oLogoutBtn, 'block');

        // hide login form
        showOrHideElement(oLoginForm, 'none');

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

    /**
     * AJAX helper
     */
    function ajax(opt){
        var opt = opt ||{},
            method = (opt.method||'GET').toUpperCase(),
            url=opt.url,
            data=opt.data ||null,
            success = opt.success || function(){},
            error = opt.error || function (){},
            //step1: create
            xhr = new XMLHttpRequest();

        //error checking
        if(!url){
            throw new Error('missing url');
        }

        //step2:configuration
        xhr.open(method,url,true);

        //step 3: send
        if(!data){
            xhr.send();
        }else{
            xhr.setRequestHeader('Content-type','application/json;charset=utf-8');
            xhr.send(JSON.stringify(data));
        }

        //step4: listen
        //case1: success
        xhr.onload=function (){
            //check response
            if(xhr.status===200){
                success(JSON.parse(xhr.responseText));
            }else{
                error();
            }
        }

        //case2: fail
        xhr.onerror = function (){
            throw new Error('The request could not be completed.')
        }

    }
    //data manager
    init();
})()

//switch login / register
// login api
// data from server
//render data
//nearby favorite and recommendation
//register
/// <reference path="jquery-2.0.2.js" />
/// <reference path="prototype.js" />
/// <reference path="http-Requester.js" />
/// </// <reference path="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha1.js"/>
/// <reference path="sha1.js" />

var persisters = (function () {
    
    var nickname = localStorage.getItem("nickname");
    var sessionKey = localStorage.getItem("sessionKey");

    function saveUserData(userData) {     
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("sessionKey", userData.sessionKey);
        nickname = userData.nickname;
        sessionKey = userData.sessionKey;
    }

    function clearUserData() {
        localStorage.removeItem("nickname");
        localStorage.removeItem("sessionKey");

        localStorage.setItem("nickname", "");
        localStorage.setItem("sessionKey", "");
        nickname = "";
        sessionKey = "";
    }

    var MainPersister = Class.create({

        initialize: function (rootUrl) {
            this.rootUrl = rootUrl;
            this.user = new UserPersister(this.rootUrl);
            this.game = new GamePersister(this.rootUrl);
        },

        isLoggedIn: function () {
            var isLogged = nickname != null && sessionKey != "";
            return isLogged;
        }
        ,
        getNickname: function () {
            return nickname;
        }
    });


    var UserPersister = Class.create({
        initialize: function (rootUrl) {
            this.rootUrl = rootUrl + "user/";
        },

        login: function (user, success, error) {
            var url = this.rootUrl + "login";
            var userData = {
                username: user.username,
                authCode: CryptoJS.SHA1(user.username + user.password).toString() //crypting userData!
            };
            // post user data(login)
            httpRequester.postJSON(url, userData,
                function (data) {
                    saveUserData(data);
                    success(data);
                }, error);
        },

        register: function (user, data, success, error) {
            var url = this.rootUrl + "register";
            var userData = {
                username : user.username,
                nickname : user.nickname,
                authCode: CryptoJS.SHA1(user.username + user.password).toString()
            }
            //post user data(register)
            httpRequester.postJSON(url, userData,
                function (data) {
                    saveUserData(data);
                    success(data);
                }, error);
        },

        logout: function (success, error) {
            var url = this.rootUrl + "logout/" + sessionKey;
            httpRequester.getJSON(url, function (data) {
                clearUserData();
                success(data);
            }, error);
        },

        scores: function (success, error) {

        }
    });

    var GamePersister = Class.create({
        
        initialize: function (url) {
            this.rootUrl = url + "game/";
        },

        create: function (game,success,error) {
            var url = this.rootUrl + "create/" + sessionKey;
            
            httpRequester.postJSON(url, game, success, error);
        },

        join: function (game,success,error) {
            var url = this.rootUrl + "join/" + sessionKey;

            httpRequester.postJSON(url, game, success, error);
        },

        start: function () {

        },

        myActive: function (success,error) {
            var url = this.rootUrl + "my-active/" + sessionKey;
            httpRequester.getJSON(url, success, error);
        },

        open: function (success,error) {
            var url = this.rootUrl + "open/"+ sessionKey;
            httpRequester.getJSON(url, success, error);
        },

        state: function () {

        }

    });


    var GuessPersister = Class.create({

        intialize: function () {

        },

        make: function () {

        }

    });

    var MessagesPersister = Class.create({

        initilize: function () {

        },

        unread: function () {

        },

        all: function () {

        }

    });

    return {
        get: function (url) {
            return new MainPersister(url);
        }
    }
})();

var bullsAndCowsPersister = persisters.get("http://localhost:40643/api/");

/* TEST USER LOGIN */

//var user = {
//    username: "Joro",
//    password: "joro"
//}

//bullsAndCowsPersister.user.login(user,
//    function (data) {
//        alert(JSON.stringify(data));
//    }, function (err) {
//        alert(JSON.stringify(err));
//    });

/* END TEST USER LOGIN */

/* TEST USER REGISTER */

//var user = {
//    username: "Joro2",
//    nickname: "Gerogi2",
//    password: "joro2"
//}

//bullsAndCowsPersister.user.register(user,
//    function (data) {
//        alert(JSON.stringify(data));
//    }, function (err) {
//        alert(JSON.stringify(err));
//    });

/* END TEST USER REGISTER */
//http://localhost:40643/api/user/login
//http://localhost:40643/api/game/create
//http://localhost:40643/api/game/join
//http://localhost:40643/api/messages/all
/// <reference path="http-Requester.js" />
/// <reference path="persisters.js" />
/// <reference path="prototype.js" />
/// <reference path="jquery-2.0.2.js" />

var controllers = (function () {

    var rootUrl = "http://localhost:40643/api/";

    var Controller = Class.create({
        initialize: function () {
            this.persister = persisters.get(rootUrl);
        },

        loadUI: function (selector) {
            if (this.persister.isLoggedIn()) {
                this.loadGameUI(selector);
            } else {
                this.loadLoginFormUI(selector);
            }

            this.attachUIEventHandlers(selector);
        },

        loadLoginFormUI: function (selector) {
            var loginForm =
                '<form>'
                       + ' <label for="#tb-login-username">Username: </label>    ' +
                       ' <input type="text" id="tb-login-username" />          ' +
                       ' <label for="#tb-login-password">Password: </label>    ' +
                       ' <input type="text" id="tb-login-password" />          ' +
                       ' <button id="login-button">Login</button>' +
                '</form>';
            $(selector).html(loginForm);
        },

        loadGameUI: function (selector) {
            var html =
                        '<span id="user-nickname">' +
                        this.persister.getNickname() +
                        '</span>' +
                        '<button id="logout-button">Logout</button>' +
                        '<h2>Open Games</h2>                       ' +
                        '<div id="open-games-container"></div>     ' +
                        '<h2>Active Games</h2>                     ' +
                        '<div id="active-games-container"></div>';

            $(selector).html(html);

            this.persister.game.open(function (games) {
                var list = '<ul>';
                var i = 0;
                var gamesLen = games.length;

                for (i; i < gamesLen; i += 1) {
                    var game = games[i];

                    list +=
                         '<li data-game-id="' + game.id + '">' +
                             '<a href="#">' +
                                 game.title +
                              '</a>' +
                            '<span> by ' +
                                game.creatorNickname +
                            '</span>' +
                         '</li>';
                }

                list += '</ul>';
                $(selector + " #open-games-container").html(list);
            });

            this.persister.game.myActive(function (games) {
                var list = '<ul>';
                var i = 0;
                var gamesLen = games.length;

                for (i; i < gamesLen; i += 1) {
                    var game = games[i];

                    list +=
                        '<li data-game-id="' + game.id + '">' +
                            '<a href="#">' +
                                $("<div />").html(game.title).text() + //hack escaping ;)
                            '</a>' +
                        '</li>';
                }

                list += '</ul>';
                $(selector + " #active-games-container").html(list);
            });
        },

        attachUIEventHandlers: function (selector) {
            var self = this;
            var wrapper = $(selector);
            wrapper.on('click', "#login-button", function () {
                var user = {
                    username: $(selector + " #tb-login-username").val(),
                    password: $(selector + " #tb-login-password").val()
                }

                self.persister.user.login(user, function () {
                    self.loadGameUI(selector);
                }, function () {
                    self.loadLoginFormUI(selector);
                });
                return false; //!!! IMPORTANT
            });

            wrapper.on('click', "#register-button", function () {

            });

            wrapper.on('click', "#logout-button", function () {
                self.persister.user.logout(function () {
                    self.loadLoginFormUI(selector);
                });
            });

            wrapper.on('click', "#open-games-container a", function () {
                $("#game-join-inputs").remove();
                var html =
                    '<div id="game-join-inputs">' +
                        'Number: <input type= "text" id = "game-number" />' +
                        'Password: <input type= "text" id = "game-password" />' +
                        '<button id="join-game-button">Join</button>' +
                    '</div>';

                $(this).after(html);
            });

            wrapper.on('click', "#join-game-button", function () {
                var game = {
                    number: $("#game-number").val(),
                    gameId: $(this).parents("li").first().data("game-id")
                };

                var password = $("#game-password").val();
                if (password) {
                    game.password = password;
                }

                self.persister.game.join(game);
            });
        }
    });

    return {
        get: function () {
            return new Controller();
        }
    }

})();

//on document ready
$(function () {
    var controller = controllers.get();
    controller.loadUI("#wrapper");
});
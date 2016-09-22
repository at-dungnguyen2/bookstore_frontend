'use strict';

var shareServices = angular.module('shareServices', []);

shareServices.factory('City', function($http, constant) {
    var city = {};
    city.query = function() {
      return $http({
          method: "GET",
          url: constant.urlCity,
          headers: {
              'Content-Type': 'application/json'
          }
      });
    };
    return city;
});


shareServices.factory('Article', function($http, constant, UserService) {
    var article = {};
    article.query = function(skippedNumber, takenNumber) {
      return $http({
          method: "GET",
          url: constant.urlArticle,
          params: {
            skippedNumber: skippedNumber,
            takenNumber: takenNumber
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': UserService.getToken()
          }
      });
    };
    article.get = function (slug) {
      return $http({
          method: "GET",
          url: constant.urlArticle + '/' + slug,
          params: {
              slug: slug
          },
          headers: {
              'Content-Type': 'application/json',
              'Authorization': UserService.getToken()
          }
      });
    };
    article.store = function (files, data) {
      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        fd.append(key, value);
      });
      angular.forEach(files, function(value, key) {
        fd.append('files[]', value);
      });
      return $http.post(constant.urlArticle, fd, {
          transformRequest: angular.identity,
          headers: {
              'Content-Type': undefined,
              'Authorization': UserService.getToken()
          }
      }).success(function (response) {
        
      }).error(function (response) {
        console.log(response);
      });
    };
    return article;
});


shareServices.factory('Category', function($http, constant) {
    var category = {};
    category.query = function() {
      return $http({
          method: "GET",
          url: constant.urlCategory,
          headers: {
              'Content-Type': 'application/json'
          }
      });
    };
    return category;
});


shareServices.factory('CategoryDetail', function($http, constant) {
    var categoryDetail = {};
    categoryDetail.query = function() {
      return $http({
          method: "GET",
          url: constant.urlCategoryDetail,
          headers: {
              'Content-Type': 'application/json'
          }
      });
    };
    return categoryDetail;
});


shareServices.service('AuthenticationService', function($http, $q, UserService) {
    this.login = function(email, password, urlAuthentication) {
        var deferred = $q.defer();
        return $http.post(urlAuthentication, {
                email: email,
                password: password
            })
            .success(function(response) {
                if (response.token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    UserService.setToken(response.token);
                    UserService.setCredentials(
                        response.user.id,
                        response.user.profile.name,
                        response.user.email,
                        response.user.profile.phone,
                        response.user.profile.address
                    );
                }
                deferred.resolve(response);
            })
            .error(function(response) {
                deferred.reject(response);
            });
    }
});


shareServices.factory("UserService", function($window, $location) {
    var userService = {};
    userService.setEmail = function(email) {
            $window.localStorage && $window.localStorage.setItem('email', email);
            return this;
        },
        userService.getEmail = function() {
            return $window.localStorage && $window.localStorage.getItem('email');
        },
        userService.setToken = function(token) {
            $window.localStorage && $window.localStorage.setItem('token', token);
            return this;
        },
        userService.getToken = function() {
            return $window.localStorage && $window.localStorage.getItem('token');
        },
        userService.setCredentials = function(id, name, email, phone, address) {
            $window.localStorage && $window.localStorage.setItem('id', id);
            $window.localStorage && $window.localStorage.setItem('name', name);
            $window.localStorage && $window.localStorage.setItem('email', email);
            $window.localStorage && $window.localStorage.setItem('phone', phone);
            $window.localStorage && $window.localStorage.setItem('address', address);
        },
        userService.getCredentials = function() {
            var credentials = {};
            credentials.id = $window.localStorage && $window.localStorage.getItem('id');
            credentials.name = $window.localStorage && $window.localStorage.getItem('name');
            credentials.email = $window.localStorage && $window.localStorage.getItem('email');
            credentials.phone = $window.localStorage && $window.localStorage.getItem('phone');
            credentials.address = $window.localStorage && $window.localStorage.getItem('address');
            return credentials;
        },
        userService.logout = function() {
            $window.localStorage.clear();
            $location.path('/login');
        },
        userService.isLoggedIn = function() {
            return $window.localStorage.email ? true : false;
        }
    return userService;
});

shareServices.factory("LazyLoadingService", function($window) {
    return {
        setSkippedNumber: function(skippedNumber) {
            $window.localStorage && $window.localStorage.setItem('skippedNumber', skippedNumber);
            return this;
        },
        getSkippedNumber: function() {
            return $window.localStorage && $window.localStorage.getItem('skippedNumber');
        },
        setTakenNumber: function(takenNumber) {
            $window.localStorage && $window.localStorage.setItem('takenNumber', takenNumber);
            return this;
        },
        getTakenNumber: function() {
            return $window.localStorage && $window.localStorage.getItem('takenNumber');
        }
    };
});

shareServices.factory('ResponseStatusHandleService', function($location, constant) {
    var responseStatusHandleService = {};
    responseStatusHandleService.process = function(status) {
      switch (status) {
          case constant.error500:
              $location.path('/error/404');
              break;
          case constant.error400:
          case constant.error422:
          default: 
              $location.path('/error/404');
              break;
      }
    };
    return responseStatusHandleService;
});

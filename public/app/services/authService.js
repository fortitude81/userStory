angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken) {

	var authFactory = {};  //< in this var, all api routes used by calling $http

	authFactory.login = function(username, password) {  //get api from post(api.js), save to front end
		return $http.post('/api/login', {
			username: username,
			password: password
		})
		.success(function(data) {		//get token when login
			AuthToken.setToken(data.token)
			return data;				//return promise object
		})
	}


	authFactory.logout = function() {
		AuthToken.setToken();   		//clear token
	}

	authFactory.isLoggedIn = function() {  //check if user has token
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

	authFactory.getUser = function() {
		if(AuthToken.getToken())
			return	$http.get('/api/me');
		else
			return $q.reject({ message: "user has no token"});
	}

	return authFactory;
})

.factory('AuthToken', function($window) {
	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token) {

		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	}

	return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken) {  //check if token exist
	var interceptorFactory = {};

	interceptorFactory.request = function(config) {
		var token = AuthToken.getToken();

		if(token) {
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	interceptorFactory.responseError = function(response) {
		if(response.status == 403)
			$location.path('/login');  //redirect to login page when no token
		return $q.reject(response);
	}

	return interceptorFactory
})












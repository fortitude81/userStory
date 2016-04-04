angular.module('userCtrl', ['userService'])

.controller('UserController', function(User) { //from user.js
	
	var vm = this;  

	vm.processing = true;

	User.all()  //has to be same name as service object (.all), user.js
		.success(function(data) {
			vm.users = data;  //users from users.js
		})


})

.controller('UserCreateController', function(User, $location, $window) {

	var vm = this;

	vm.signupUser = function() {
		vm.message = '';

		User.create(vm.userData)
			.then(function(response){
				vm.userData = {};
				vm.message = response.data.message;

				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			})
	}
})
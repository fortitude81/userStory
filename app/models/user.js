var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({

	name: String,
	username: { type: String, required: false, index: { unique: true}},
	password: { type: String, required: true, select: false}

});

UserSchema.pre('save', function(next){
	var user = this;

	if(!user.isModified('password')) return next();  //next matching route

	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};
//export this object
module.exports = mongoose.model('User', UserSchema); 
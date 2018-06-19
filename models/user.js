var mongoose = require('mongoose'),
Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat');

var user_schema = new Schema({
	_id: String,
	first_name: String,
    last_name: String,
    timezona: String,
    locale: String,
    profile_pic: String,
    boleano: Boolean
});

user_model = mongoose.model('user', user_schema, 'users');

module.exports = {
	create: function(data, callback){
		var item = {
				_id: data._id,
				first_name: data.first_name,
			    last_name: data.last_name,
			    timezona: data.timezona,
			    locale: data.locale,
			    profile_pic: data.profile_pic,
			    boleano: data.boleano
		};
		var nuevo = new user_model(item).save();
		callback(item);
	},

	show: function(callback){
		user_model.find({}, function( err, items){
			if (!err) {
				callback(JSON.stringify(items));
			} else {
				return console.log(err);
			}
		});
	},

	update: function(data, callback){
		user_model.findOne({_id: data._id}, function(err, item){
			item.first_name = data.first_name;
			item.last_name = data.last_name;
			item.timezona = data.timezona;
			item.locale = data.locale;
			item.profile_pic = data.profile_pic;
			item.boleano = data.boleano;
			item.save();
			callback(item);
		});
	},

	delete: function(_id, callback){
		user_model.findOne({_id: _id}, function(err, post){
			post.remove();
			callback(_id);
		});
	}
};

/*
 * GET users listing.
 */

exports.users = function(req, res){
	User.find('testuser1',function(err,docs){
		console.log(docs);
	});
};
var User = require('../models/user'),
	Xml = require('../models/xml');

var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util'),
    exec = require('child_process').exec,
    mongoClient = require('../models/db.js');
    //db = require('mongoskin').db('mongodb://localhost:27017/abcdefg');

/*
 * GET home page.
 */

module.exports = function (app) {
	app.get('/', function(req, res){
		res.render('index', { title: 'MetaData' });
	});

	app.get('/user', function(req, res){
		//var user = new User({
		//	username: "testuser1",
		//	password: "password1"
		//});
		//user.save();

		User.find({'username': 'testuser1' }, function(err,user){
			if (err) 
				return handleError(err);
			res.send(user);
			//res.render('user', { 
			//	title: 'showMetaData',
			//	user: user });
		});
	});

	app.get('/upload', function(req, res){
		res.render('upload', { title: "UpLoad"})
	});

	//saving xml using string 
	app.post('/file-upload', function(req, res, next) {
		//var target_path = './uploads/' + req.files.xml.name;
		var parser = new xml2js.Parser();

		//support for single file
		var paths = req.files.xml || [];
		if ( !(paths instanceof Array)) {
			paths = [paths];
		}

		paths.forEach(function (paths) {
			var tmp_path = paths.path;
        	var data = fs.readFileSync(tmp_path);
			parser.parseString(data, function (err, result) {

			    var xml = new Xml({
			    	content: JSON.stringify(result),
			    	boname: result.BusinessObjectType.$.Name
			    });
			    xml.save();
			});
		});
		res.redirect('/upload');
		//fs.rename(tmp_path, target_path, function(err){
		//	if (err) throw err;
		//	fs.unlink(tmp_path, function() {
		//		if (err) throw err;
		//		res.send('File uploaded to: ' + target_path);
		//		//res.redirect('/upload');
		//	});
		//});

	});

// saving xml using json
//	app.post('/file-upload', function(req, res, next) {
//		var parser = new xml2js.Parser({attrkey: '@'});
//		var dbname = req.body.dbname;
//		var scname = req.body.scname;
//		//support for single file
//		var paths = req.files.xml || [];
//		if ( !(paths instanceof Array)) {
//			paths = [paths];
//		}
//	    
//		mongoClient.open(function(err, mongoClient) {
//			var db1 = mongoClient.db(dbname);
//			db1.createCollection(scname, function (err, collection) {
//				mongoClient.close();
//			});			
//		});
//
//		var count = 0;
//		paths.forEach(function (paths) {
//		    var tmp_path = paths.path;
//            var data = fs.readFileSync(tmp_path);
//            console.log(paths.name);
//            console.log(tmp_path);
//		    parser.parseString(data, function(err, result) {  
//		    	var jsonfile = JSON.stringify(result).replace(/{/,"{\"FileName\":\""+ paths.name+"\",");
//		    	fs.writeFileSync( count+".json", jsonfile);
//         		var importdir = "C:/mongodb/mongodb-win32-x86_64-2008plus-2.4.9/bin/mongoimport.exe";
//         		var jsonfiledir = "./"+ count+ ".json"; 
//       	 		exec( importdir + " --db " + dbname + " --collection " + scname + " -file " + jsonfiledir); 		
//       	 		count += 1;
//
//       	    });
//       	    //fs.unlinkSync(tmp_path);
//		});
//		//delete temp file of json
//		for (var j=0 ; j<count ;j++ ) {
//			fs.unlinkSync(j+ ".json");
//		}
//		res.redirect('/upload');
//	});

	app.get('/display', function(req, res, next) {
		Xml.find({}, function(err, xml){
			if (err) throw err;
			var htmls = new Array();
			var filenames = new Array();

			//for (var i in result) {
            //	htmls[i] = build(result[i].BusinessObjectType);
            //	filenames[i] = result[i].FileName;
			//}
			console.log(xml.content);

			res.render('display',{
				title: 'displayMetaData',
				xml: xml 
			});
		});

	});			
 
	app.get('/modify', function(req, res, next) {
		res.render('modify', {
			title: 'modifyMetaData'
		})
	});

	app.post('/update_attribute', function(req, res, next) {
		var parent = req.body.element;
		var name = req.body.attribute_name;
		var value = req.body.attribute_value;
		var value_to = req.body.attribute_value_to;

		db.collection("zxcvb").update(
			{ FileName: UserQueries.xml},
			{ $set: {
					"BusinessObjectType.$.Name": "newname"
					}
			}
		)
		res.send("element added!");
	});
    
    // accept an obj
	function build (result) {
		var html = "";
		for (var item in result) {
			if (result[item] instanceof Array) {
				for (var i in result[item] ) {
					var rest = build(result[item][i]);
					html += "<ul><li>" + item + rest +"</ul></li>" ;
				}
			} else if (item == "@") {
				html += "<ul><li>" +"@:" ;
				for (var i in result[item]) 
				 	html += "<ul><li>"+ i +": " +result[item][i] +"</ul></li>";
				html +=  "</li></ul>";	
			}
		}
		return html;
	}
};
//	app.get('/display', function(req, res, next) {
//
//		Xml.find({},function(err,xml){
//			if (err) 
//				return handleError(err);
//			res.send(xml);
//		});
//
//	});


	//using mongodb-naive
//	app.get('/display',function(req, res, next) {
//
//		var dbname = "abcdefg";
//		mongoClient.open(function(err, mongoClient) {
//			var db1 = mongoClient.db(dbname);
//			
//			db1.collection("zxcvb").find({}, function(err, cursor) {
//				cursor.nextObject(function(err, doc){
//					console.log(doc);
//				});
//			});
//			mongoClient.close();
//					
//		});
//		//res.render('display', { title: "showMetaData"});
//	})
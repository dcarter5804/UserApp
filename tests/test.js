var should = require("chai").should();
//var assert = require("assert");
var mongodb = require('mongojs');
var dbConf = require('../conf/database.js')('dev');

/* Create MongoDB Connection */
var dbh = mongodb(dbConf.connectionString, [dbConf.database]);
var users = dbh.collection("users");
var appUsers = dbh.collection("app_users");


/* User API Tests */

describe('Users API', function() {
	describe('findAllUsers()', function() {
		it('Should return an array of all users upto 40', function(done) {
			
			users.find({}).limit(40, function (err, users) {
				if(err) return done(err);	
				
				/* Test Result Size & Type */
				users.should.have.length.of.at.most(40);
				users.should.be.a('Array');
				
				/* Test Return Structure */
				users[0].should.have.property('first_name');
				users[0].should.have.property('last_name');
				users[0].should.have.property('title');
				users[0].should.have.property('description');				
				
				done();
			})
			
		})
	});
	describe('findUser()', function() {
		it('Should return an a specific user (Derek Carter)', function(done) {
			
			users.find({_id:mongodb.ObjectId("53371bce4c0dc9732c000001")}, function (err, users) {
				if(err) return done(err);	
				
				/* Test Result Size & Type */
				users.should.have.length(1);
				users.should.be.a('Array');
				
				/* Test Return Structure */
				users[0].should.have.property('first_name');
				users[0].should.have.property('last_name');
				users[0].should.have.property('title');
				users[0].should.have.property('description');
				users[0].should.not.have.property('description1');
				
				done();
			})
			
		})
	})
	
});
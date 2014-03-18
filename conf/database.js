var properties = {
		"dev":{
			"host" : "localhost",
			"port" : "27017",
			"database" : "UserApp"
		}
	};

module.exports = function (ENV) {
	var ENV_PROPS = properties[ENV],
		connectionString = ENV_PROPS.host + ':' + ENV_PROPS.port + '/' + ENV_PROPS.database;
	
	ENV_PROPS.connectionString = connectionString;
	
	return ENV_PROPS;
}
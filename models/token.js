module.exports = function(sequelize, DataTypes){

	var tokenColumns = {
		username : {
			type : DataTypes.STRING(30),
			primaryKey: true,
			autoIncrement: false,
			field : 'username'
		},
		tokenString : {
			type : DataTypes.STRING(500),
			allowNull : true,
			field : 'token_string'
		}
		
	};

	var tokenConfig = {
		tableName : 'token',
		timestamps : true,
		paranoid: true, //Won't delete object, add colums deleted_at to table
		underscored : true,
		freezeTableName : true,
		classMethods: {
			associate : function(models) {

			}
		}
	};

	var Token = sequelize.define("Token", tokenColumns, tokenConfig);

	return Token;

};

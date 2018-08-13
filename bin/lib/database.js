const debug = require('debug')('bin:lib:database');
const Cloudant = require('cloudant');

var cloudant = Cloudant({
    account : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    url: process.env.DATABASE_ENDPOINT
});

function getAnItemFromTheDatabase(uuid, databaseName){

    if(!uuid){
        return Promise.reject(`uuid is ${uuid}`);
    }

    const db = cloudant.db.use(databaseName);

    return new Promise( (resolve, reject) => {

        const params = {
            "selector": {
                "uuid": {
                    "$eq" : uuid
                }
            },
            "limit" : 1
        };
    
        db.find(params, (err, results) => {
            if(err){
                reject(err);
            } else {
				resolve(results);
            }
        });

    } );

}

function writeToDatabase(document, databaseName){
    const db = cloudant.db.use(databaseName);

    debug('ADDING TOKEN:', document);
    
    return new Promise( (resolve, reject) => {

        db.insert(document, (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });

    });

}

function deleteAnItemFromTheDatabase(uuid, databaseName){
	
	const db = cloudant.db.use(databaseName);
	
	return new Promise( (resolve, reject) => {

		getAnItemFromTheDatabase(uuid)
			.then(results => {

				const doc = results.docs[0];

				db.destroy(doc._id, doc._rev, function(err, data) {
					if(err){
						reject(err);
					} else {
						resolve(data);
					}
				});

			})
			.catch(err => reject(err))
		;

	});

}

module.exports = {
	write    : writeToDatabase,
	read     : readFromDatabase,
	delete   : deleteAnItemFromDatabase
};
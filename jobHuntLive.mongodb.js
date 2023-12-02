/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('jobHuntLive');


try {
    db.getCollection('jobs').updateMany(
        { "_id": { $in: [ObjectId('6536d174f1d31822b07f28f7'), ObjectId('6536d282f1d31822b07f28f9')] } },
        {
            $set:{"acts": "archived"}
        }
    );

} catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
}

const findQuery1 = { _id: { $in: [ObjectId("6536d174f1d31822b07f28f7"), ObjectId("6536d282f1d31822b07f28f9")] } }
db.getCollection('jobs').find(findQuery1);


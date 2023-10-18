require('dotenv').config();
console.log('here',process.env.MONGO_URI);


const { MongoClient } = require("mongodb");

class JobHunt {

    constructor() {
        this.uri = "mongodb+srv://oohkumar:Daktari123!@cluster0.iz7sd9n.mongodb.net/?retryWrites=true&w=majority";
        this.dbName = "jobHunt";
        this.collectionName = "jobs";
        this.collection = '';
        this.connectDb();

    }

    async connectDb() {
        this.client = new MongoClient(this.uri);
        await this.client.connect();
        const database = this.client.db(this.dbName);
        this.collection = database.collection(this.collectionName);
    }

    schemeDB() {
        const recipes = [
            {
                _id: null,
                date: "1697560943526",
                companyName: "TipTopCompany",
                jobTitle: "Front End Engineer",
                linkToJd: "https://www./jobhere.com/at45qgagad",
                requirements: ["php","js","css","html","mysql"],
                status: [
                    "applied",
                    "archived"
                ],
            },
        ];

    }

    async list() {
        try {
            let jobsList = [];
            const cursor = await this.collection.find({}).sort({ name: 1 });
            await cursor.forEach((jobApplied) => {
                jobsList.push(jobApplied)
            });
            return jobsList;
        } catch (err) {
            console.error(
                `Something went wrong trying to find the documents: ${err}\n`
            );
        }
    }
}


// add

// edit 

// delete

module.exports = new JobHunt;
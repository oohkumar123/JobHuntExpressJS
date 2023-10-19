require('dotenv').config();
const { MongoClient } = require("mongodb");

class JobHunt {

    constructor() {
        this.uri = process.env.MONGO_URI;
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
                jobLink: "https://www./jobhere.com/at45qgagad",
            },
        ];

    }

    async list() {
        try {
            let jobsList = [];
            const returnValues = await this.collection.find({}).sort({ name: 1 });
            await returnValues.forEach((jobApplied) => {
                jobsList.push(jobApplied)
            });
            return jobsList;
        } catch (err) {
            console.error(
                `Something went wrong trying to find the documents: ${err}\n`
            );
        }
    }
    async add(data) {
        console.log(data);
        try {
            const returnValues = await this.collection.insertOne({_id:null, ...data});
        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }
}


// add

// edit 

// delete

module.exports = new JobHunt;
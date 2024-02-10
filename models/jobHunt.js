require('dotenv').config();
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
class JobHunt {

    constructor() {
        this.uri = process.env.MONGO_URI;
        this.dbName = "jobHuntLive";
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

    async list(period, sort, req) {
        
        let findData;
        let date = {};
        let status = 'applied';
        if (period ==='today' && sort=='date') {
            date = new Date();
            date.setHours(-8,0,0,0);
            findData = {"date": {"$gte" : date}};
            findData = {...findData, 'acts':'applied'};
        } else if (period ==='all' && sort=='date') {
            findData = {'acts':'applied'};
        } else if (period ==='month' && sort=='date') {
            let month = req.params.month
            if (month!=='all') {
                findData = {
                    "date": {
                        "$gte" : new Date(`2024-${month}-01`), 
                        "$lt" : new Date(`2024-${month}-31`)
                    }
                }
                findData = {...findData, 'acts':'applied'};
            } else {
                findData = {};
            }
            status = 'archived';
        }
        
        try {
            let jobsList = [];
            const returnValues = await this.collection.find(findData).sort(sort)
            await returnValues.forEach((jobApplied) => {
                jobsList.push(jobApplied)
            });
            return jobsList;
        
        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }
    async add(data) {
        const date = new Date();
        data = {...data, date};
        try {
            await this.collection.insertOne(data);
        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }
    async edit(_id) {
        const id = { "_id" : new ObjectId(_id)};

        try {
             return await this.collection.findOne(id);
        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }
    async doedit({_id, submit, ...data}) {
        const id = { "_id" : new ObjectId(_id)};

        try {
            await this.collection.updateOne(
                id,
                {
                    $set:data
                }
            );

        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }
    async delete(id) {
        const query = { "_id" : new ObjectId(id)};
        try {
            const deleteResult = await this.collection.deleteOne(query);
        } catch (err) {
            console.error(`Something went wrong trying to delete documents: ${err}\n`);
        }    
    }
    async archive (ids) {
        const idsObs = ids.map((item) => new ObjectId(item));
        
        try {
            this.collection.updateMany(
                { "_id": { $in: idsObs } },
                {
                    $set:{"acts": "archived"}
                }
            );
            return;
        } catch (err) {
            console.error(`Something went wrong trying to delete documents: ${err}\n`);
        }    
        
    

    }
    
}
module.exports = new JobHunt;
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
        if (period ==='today' && sort=='date') {
            date = new Date();
            date.setHours(-8,0,0,0);
            findData = {"date": {"$gte" : date}};
            console.log(findData);
        } else if (period ==='all' && sort=='date') {
            findData = {};
        } else if (period ==='month' && sort=='date') {
            let month = req.params.month
            findData = {
                "date": {
                    "$gte" : new Date(`2023-${month}-01`), 
                    "$lt" : new Date(`2023-${month}-31`)
                }
            }
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
    async doedit({_id, ...data}) {
        const id = { "_id" : new ObjectId(_id)};

        try {
            await this.collection.updateOne(
                id,
                {
                    $set:{
                        jobTitle: data.jobTitle,
                        companyName: data.companyName,
                        jobLink: data.jobLink,
                        reqs: data.reqs,
                        acts: data.acts,
                        locs: data.locs,
                        notes: data.notes,
                        recruiterName: data.recruiterName,
                        recruiterContact: data.recruiterContact
                    }
                }
            );

            //await this.collection.replaceOne(id, data);
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
    getTodayDate() {
        const today = new Date();
        console.log('%ctoday: %o', 'color: red;font-size:12px', today);
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        //return {date:`${month}/${day}/${year}`};
        return today;

    }
    
}
module.exports = new JobHunt;
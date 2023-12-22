
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        } : {

        };

        this.query = this.query.find({ ...keyword })
        return this;
    }
    filter() {
        const querycopy = { ...this.queryStr } // in javascript, objects are passed through reference. If we had done `this.queryStr` then a new copy of queryStr would not have been created, and the changes in querycopy would have been reflected in the original qureyStr, which is undesirable(we are preserving a copy of the original queryStr in querycopy).
        
        //removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete querycopy[key]);

        //filter for price range and rating

        let queryStr = JSON.stringify(querycopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key =>`$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
    pagination(resultsPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultsPerPage * (currentPage-1);

        this.query = this.query.limit(resultsPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFeatures
class ApiFeatures {

    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },

            }
            : {};


        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr }

        // remove some fields for category

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Fillter For Price and Rating

        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination(resultpage) {

        const currantpage = Number(this.queryStr.page) || 1;

        const skip = resultpage * (currantpage - 1);

        this.query = this.query.limit(resultpage).skip(skip);
        return this;
    }
};
module.exports = ApiFeatures;                                                                          //controllers/productController.js
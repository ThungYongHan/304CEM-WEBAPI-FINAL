const mongoose = require('mongoose');
const db = "mongodb+srv://YongHanThung:sXFWaYGgYopFqb7h@cluster0.xla3j.mongodb.net/ProjectDB?retryWrites=true&w=majority";
mongoose
.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to database");
}
)
.catch(() => {
    console.log("Error Connecting to database");
}
)

// a schema matches the table in your database
const stockCompanyNewsSchema = new mongoose.Schema({
    stockCompanyName: {type: String},
    stockQuery: {type: String},
    stockTickerSymbol: { type: String },
    stockExchangeName: { type: String },
    stockClosePrice: { type: String },
    stockVolume: { type: String },
    stockDate: { type: String },

    companyNews1Title: { type: String },
    companyNews1Image: { type: String },
    companyNews1Description: { type: String },
    companyNews1SourceName: { type: String },
    companyNews1Url: { type: String },
    companyNews1PublishedAt: { type: String },

    companyNews2Title: { type: String },
    companyNews2Image: { type: String },
    companyNews2Description: { type: String },
    companyNews2SourceName: { type: String },
    companyNews2Url: { type: String },
    companyNews2PublishedAt: { type: String },

    companyNews3Title: { type: String },
    companyNews3Image: { type: String },
    companyNews3Description: { type: String },
    companyNews3SourceName: { type: String },
    companyNews3Url: { type: String },
    companyNews3PublishedAt: { type: String },
    }
    );

// it will automatically make your collect name plural
const StockCompanyNews = mongoose.model('records', stockCompanyNewsSchema);

module.exports = StockCompanyNews;
const express = require('express');
const axios = require('axios');
const path = require('path');

// get schema and database connection
const User = require('./models/User');
const StockCompanyNews = require('./models/StockCompanyAndNews.js');

const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// cors to send info from frontend to back end
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// to accept json data, automatically parsing every json content
app.use(express.json());


// --------------------------deployment------------------------------
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/public"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
    });
}
// --------------------------deployment------------------------------

// verifyJWT middleware
// each time the endpoint is called, will verify if the user reaching the endpoint has the correct token
// always apply this middleware
const verifyJWT = (req, res, next) => {
    // token is passed through through the x-access-token header
    // get the token from the header
    const token = req.headers["x-access-token"]

    // if no token
    if (!token) {
        res.status(400).send("Please give a valid token!");
    }
    // if there is a token
    else {
        //decoded decodes jwt token
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.status(400).send("You are not authorized!");
            }
            else {
                // save decoded id into variable
                // so that can make authenticated requests further into the project
                req.userId = decoded._id;
                next();
            }
        })
    }
}


// marketstack api key
const stockAPIKey = "814c03ceae9bdd948b8b457aeca43ea4";
// newsAPI api key
const newsAPIKey = "210aa97ee1c34ce98a3ea7419efb0d59";

// save company stock details and news
app.get('/saveCompanyStockPriceNews', (req, res) => {
    const companyName = req.query.title;
    // make sure the input is not empty
    if (companyName.trim() === '') {
        // send error code and message
        res.status(400).send("Company name is empty!");
        return;
    }

    const query = `http://api.marketstack.com/v1/tickers?access_key=${stockAPIKey}&search=${companyName}`;
    axios.get(query).then((response) => {
        const stockQuery = companyName;
        var stockCompanyName;
        var stockTickerSymbol;
        var stockExchangeName;
        if (response.data.data[0].has_eod === true) {
            stockCompanyName = response.data.data[0].name;
            stockTickerSymbol = response.data.data[0].symbol;
            stockExchangeName = response.data.data[0].stock_exchange.name;
        }
        else {
            stockCompanyName = response.data.data[1].name;
            stockTickerSymbol = response.data.data[1].symbol;
            stockExchangeName = response.data.data[1].stock_exchange.name;
        }

        const companySymbol = stockTickerSymbol;
        const query2 = `http://api.marketstack.com/v1/eod?access_key=${stockAPIKey}&symbols=${companySymbol}`;
        axios.get(query2).then((response) => {
            var stockClosePrice = response.data.data[0].close;
            var stockDate = response.data.data[0].date;

            const query3 = `https://newsapi.org/v2/everything?qInTitle=${companyName}&language=en&apiKey=${newsAPIKey}`;
            axios.get(query3).then((response) => {
                var companyNews1Title = response.data.articles[0].title;
                var companyNews1Image = response.data.articles[0].urlToImage;
                var companyNews1Description = response.data.articles[0].description;
                var companyNews1SourceName = response.data.articles[0].source.name;
                var companyNews1Url = response.data.articles[0].url;
                var companyNews1PublishedAt = response.data.articles[0].publishedAt;

                var companyNews2Title = response.data.articles[1].title;
                var companyNews2Image = response.data.articles[1].urlToImage;
                var companyNews2Description = response.data.articles[1].description;
                var companyNews2SourceName = response.data.articles[1].source.name;
                var companyNews2Url = response.data.articles[1].url;
                var companyNews2PublishedAt = response.data.articles[1].publishedAt;

                var companyNews3Title = response.data.articles[2].title;
                var companyNews3Image = response.data.articles[2].urlToImage;
                var companyNews3Description = response.data.articles[2].description;
                var companyNews3SourceName = response.data.articles[2].source.name;
                var companyNews3Url = response.data.articles[2].url;
                var companyNews3PublishedAt = response.data.articles[2].publishedAt;

                const stockCompanyValue = new StockCompanyNews({
                    stockCompanyName: stockCompanyName,
                    stockQuery: stockQuery,
                    stockTickerSymbol: stockTickerSymbol,
                    stockExchangeName: stockExchangeName,
                    stockClosePrice: stockClosePrice,
                    stockDate: stockDate,

                    companyNews1Title: companyNews1Title,
                    companyNews1Image: companyNews1Image,
                    companyNews1Description: companyNews1Description,
                    companyNews1SourceName: companyNews1SourceName,
                    companyNews1Url: companyNews1Url,
                    companyNews1PublishedAt: companyNews1PublishedAt,

                    companyNews2Title: companyNews2Title,
                    companyNews2Image: companyNews2Image,
                    companyNews2Description: companyNews2Description,
                    companyNews2SourceName: companyNews2SourceName,
                    companyNews2Url: companyNews2Url,
                    companyNews2PublishedAt: companyNews2PublishedAt,

                    companyNews3Title: companyNews3Title,
                    companyNews3Image: companyNews3Image,
                    companyNews3Description: companyNews3Description,
                    companyNews3SourceName: companyNews3SourceName,
                    companyNews3Url: companyNews3Url,
                    companyNews3PublishedAt: companyNews3PublishedAt,
                });
                // save data to mongodb
                stockCompanyValue
                    .save();

                res.end(
                    JSON.stringify({
                        stockCompanyName: stockCompanyName,
                        stockQuery: companyName,
                        stockTickerSymbol: stockTickerSymbol,
                        stockExchangeName: stockExchangeName,
                        stockClosePrice: stockClosePrice,
                        stockDate: stockDate,

                        companyNews1Title: companyNews1Title,
                        companyNews1Image: companyNews1Image,
                        companyNews1Description: companyNews1Description,
                        companyNews1SourceName: companyNews1SourceName,
                        companyNews1Url: companyNews1Url,
                        companyNews1PublishedAt: companyNews1PublishedAt,

                        companyNews2Title: companyNews2Title,
                        companyNews2Image: companyNews2Image,
                        companyNews2Description: companyNews2Description,
                        companyNews2SourceName: companyNews2SourceName,
                        companyNews2Url: companyNews2Url,
                        companyNews2PublishedAt: companyNews1PublishedAt,

                        companyNews3Title: companyNews3Title,
                        companyNews3Image: companyNews3Image,
                        companyNews3Description: companyNews3Description,
                        companyNews3SourceName: companyNews3SourceName,
                        companyNews3Url: companyNews3Url,
                        companyNews3PublishedAt: companyNews3PublishedAt
                    }));
            });
        })
    })
        .catch(() => {
            res.status(400).json("Company is not found!");
        });
});

// delete company data from mongodb
app.post('/deleteCompany',verifyJWT, async (req, res) => {

    // this only gets the id number without the objectid stuff
    const id = req.body.id;
    try {
        await StockCompanyNews.findByIdAndDelete(id)
            .then(() => {
                res.status(200).send("Company is deleted from database!");
            })
            .catch(() => {
                res.status(400).json("Database company deletion failed!");
            });
    }
    catch (err) {
        console.log(err);
    }
});

// edit initial query used
app.post('/updateQuery', async (req, res) => {
    const newQuery = req.body.newQuery;

    if (newQuery.trim() === '') {
        // send error code and message
        res.status(400).send("Query is empty!");
        return;
    }
    // this only gets the id number without the objectid stuff
    const id = req.body.id;

    try {
        const query = `https://newsapi.org/v2/everything?qInTitle=${newQuery}&language=en&apiKey=${newsAPIKey}`;
        // added await to axios.get so it is async
        await axios.get(query).then((response) => {
            var companyNews1Title = response.data.articles[0].title;
            var companyNews1Image = response.data.articles[0].urlToImage;
            var companyNews1Description = response.data.articles[0].description;
            var companyNews1SourceName = response.data.articles[0].source.name;
            var companyNews1Url = response.data.articles[0].url;
            var companyNews1PublishedAt = response.data.articles[0].publishedAt;

            var companyNews2Title = response.data.articles[1].title;
            var companyNews2Image = response.data.articles[1].urlToImage;
            var companyNews2Description = response.data.articles[1].description;
            var companyNews2SourceName = response.data.articles[1].source.name;
            var companyNews2Url = response.data.articles[1].url;
            var companyNews2PublishedAt = response.data.articles[1].publishedAt;

            var companyNews3Title = response.data.articles[2].title;
            var companyNews3Image = response.data.articles[2].urlToImage;
            var companyNews3Description = response.data.articles[2].description;
            var companyNews3SourceName = response.data.articles[2].source.name;
            var companyNews3Url = response.data.articles[2].url;
            var companyNews3PublishedAt = response.data.articles[2].publishedAt;

            StockCompanyNews.findByIdAndUpdate(id,
                {
                    $set: {
                        stockQuery: newQuery,
                        companyNews1Title: companyNews1Title,
                        companyNews1Image: companyNews1Image,
                        companyNews1Description: companyNews1Description,
                        companyNews1SourceName: companyNews1SourceName,
                        companyNews1Url: companyNews1Url,
                        companyNews1PublishedAt: companyNews1PublishedAt,

                        companyNews2Title: companyNews2Title,
                        companyNews2Image: companyNews2Image,
                        companyNews2Description: companyNews2Description,
                        companyNews2SourceName: companyNews2SourceName,
                        companyNews2Url: companyNews2Url,
                        companyNews2PublishedAt: companyNews2PublishedAt,

                        companyNews3Title: companyNews3Title,
                        companyNews3Image: companyNews3Image,
                        companyNews3Description: companyNews3Description,
                        companyNews3SourceName: companyNews3SourceName,
                        companyNews3Url: companyNews3Url,
                        companyNews3PublishedAt: companyNews3PublishedAt
                    }
                })
                .then(() => {
                    res.status(200).json("Query is edited and latest news is shown!");
                })
                .catch(() => {
                    res.status(400).json("News cannot be found for query!");
                });
        });

    } catch (err) {
        res.status(400).json("News cannot be found for query!");
    }
});

// update company stock ticker price to latest date and latest news
app.post('/updateCompany', async (req, res) => {
    const { id, stockQuery, stockTickerSymbol } = req.body;
    const query2 = `http://api.marketstack.com/v1/eod?access_key=${stockAPIKey}&symbols=${stockTickerSymbol}`;

        await axios.get(query2).then((response) => {
            var stockClosePrice = response.data.data[0].close;
            var stockDate = response.data.data[0].date;
            const query3 = `https://newsapi.org/v2/everything?qInTitle=${stockQuery}&language=en&sortBy=publishedAt&apiKey=${newsAPIKey}`;
            axios.get(query3).then((response) => {
                var companyNews1Title = response.data.articles[0].title;
                var companyNews1Image = response.data.articles[0].urlToImage;
                var companyNews1Description = response.data.articles[0].description;
                var companyNews1SourceName = response.data.articles[0].source.name;
                var companyNews1Url = response.data.articles[0].url;
                var companyNews1PublishedAt = response.data.articles[0].publishedAt;

                var companyNews2Title = response.data.articles[1].title;
                var companyNews2Image = response.data.articles[1].urlToImage;
                var companyNews2Description = response.data.articles[1].description;
                var companyNews2SourceName = response.data.articles[1].source.name;
                var companyNews2Url = response.data.articles[1].url;
                var companyNews2PublishedAt = response.data.articles[1].publishedAt;

                var companyNews3Title = response.data.articles[2].title;
                var companyNews3Image = response.data.articles[2].urlToImage;
                var companyNews3Description = response.data.articles[2].description;
                var companyNews3SourceName = response.data.articles[2].source.name;
                var companyNews3Url = response.data.articles[2].url;
                var companyNews3PublishedAt = response.data.articles[2].publishedAt;
                StockCompanyNews.findByIdAndUpdate(id,
                    {
                        $set: {
                            stockClosePrice: stockClosePrice,
                            stockDate: stockDate,
                            companyNews1Title: companyNews1Title,
                            companyNews1Image: companyNews1Image,
                            companyNews1Description: companyNews1Description,
                            companyNews1SourceName: companyNews1SourceName,
                            companyNews1Url: companyNews1Url,
                            companyNews1PublishedAt: companyNews1PublishedAt,

                            companyNews2Title: companyNews2Title,
                            companyNews2Image: companyNews2Image,
                            companyNews2Description: companyNews2Description,
                            companyNews2SourceName: companyNews2SourceName,
                            companyNews2Url: companyNews2Url,
                            companyNews2PublishedAt: companyNews2PublishedAt,

                            companyNews3Title: companyNews3Title,
                            companyNews3Image: companyNews3Image,
                            companyNews3Description: companyNews3Description,
                            companyNews3SourceName: companyNews3SourceName,
                            companyNews3Url: companyNews3Url,
                            companyNews3PublishedAt: companyNews3PublishedAt
                        }
                    })
                    .then(() => {
                        res.status(200).json("Selected company stock volume and price, and company news is updated!");
                    })
                    .catch(() => {
                        res.status(400).json("Company is not found!");
                    });
            });
        });
    
});

// get all company data from records (mongodb)
app.get('/getAllCompanyStockPriceNews', (req, res) => {
    StockCompanyNews.find({})
        .then(response => {
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(400).json(error);
        });
});

// edit company name
app.post('/editCompanyName', async (req, res) => {
    const newCompanyName = req.body.newCompanyName;
    const id = req.body.id;
    if (newCompanyName.trim() === '') {
        // if inputted edit company name is empty
        res.status(400).send("Empty company name!");
        return;
    }
    try {
        // update with new company name at selected id
        await StockCompanyNews.findByIdAndUpdate(id,
            {
                $set: {
                    stockCompanyName: newCompanyName,
                }
            })
            .then(() => {
                res.status(200).send("Company name has been edited!");
            })
            .catch(() => {
                res.status(400).send("Edit company name failed!");
            });
    }
    catch (err) {
        res.status(400).send("Edit company name failed!");
        console.log(err);
    }

});


app.post('/register', async (req, res) => {
    const { Email, Password } = req.body;
    if (Email.trim() === '' || Password.trim() === '') {
        res.status(400).send("Email address or password is empty!");
        return;
    }
    // find users collection for matching email
    const existingEmail = await User.findOne({ Email });
    if (existingEmail) {
        res.status(400).send("Email is already in use by another account!");
        throw new Error("Email is already in use by another account!");
    }
    // create user
    const user = await User.create({
        Email,
        Password,
    });

    if (user) {
        res.status(200).json({
            _id: user._id,
            Email: user.Email,
        });

    } else {
        res.status(400).send("Email is already in use by another account!");
        throw new Error("User sign up failed!");
    }

    res.json({
        Email,
        Password
    });
})

app.post("/login", async (req, res) => {
    const { Email, Password} = req.body;
    const user = await User.findOne({ Email });
    // if users email and password matches
    if (user && (await user.correctPassword(Password))) {
        // get user id of mongodb
        const id = user._id;
        // create token based on user id of mongodb
        const token = jwt.sign({id}, "jwtSecret", {
            // expires in 5 minutes
            expiresIn: 300,
        });
        res.json({ auth: true, token: token});
    }
    else {
        res.json({
            auth: false,
            message: "Invalid email address or password!",
        });
        res.status(400).send("Invalid email address or password!");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
const express = require("express");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");

require("./models/ContactList");
require("./models/Rate");
require("./models/Advertisement");
require("./models/User");
require("./models/Survey");
require("./services/passport");
require('./models/MessageThread');
require('./models/Message');

const next = require('next')
const dev = (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test')
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const flash = require("connect-flash");

const mongoose = require("mongoose");
mongoose.connect(keys.mongoURI, { 
																	useNewUrlParser: true,  
																	useCreateIndex: true,
																	useFindAndModify: false
                                                                });
//mongoose.set('debug', true)



const app = express();
//(() => nextApp.prepare())()
var  server;

nextApp.prepare()
  .then(() => {
/** */
    app.use(flash());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); //proxy body

    app.use(
        cookieSession({
            maxAge: 30 * 24 * 60 * 60 * 1000,
            keys: [keys.cookieKey]
        })
    );
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());


    const advertisementsRoutes = require("./routes/advertisementRoutes");
    const userRoutes = require("./routes/userRoutes")(nextApp);
    app.use("/", advertisementsRoutes);
    app.use("/", userRoutes);



    require("./routes/billingRoutes")(app);
    require("./routes/surveyRoutes")(app);

    app.use("/public", express.static(__dirname + "/public"));

    app.get("/test", (req, res) => {
      const actualPage = '/index'
      const query = { id: 'req.params.hhhjjkkllvvoooo', test: 'testPropertyNN' } 
      nextApp.render(req, res,  '/index', query);
    })
    
    const PORT = process.env.PORT || 5000;
    server =   app.listen(PORT, function()
    {
      console.log( 'Server running on http://%s:%s' )
      app.emit( "app_started" )
    })
    
    if (process.env.NODE_ENV === "production") {
        app.use(express.static("client/build"));
        const path = require("path");

        app.get("*", (req, res) => {
            res.sendfile(path.resolve(__dirname, "client", "build", "index.html"));
        });
    }
    

})
.catch((ex) => {
  console.log('ERROR', ex)
  process.exit(1)
})
/**/
//if ( process.env.NODE_ENV != 'testt') {

//}




module.exports = app;
module.exports.server2 = server;

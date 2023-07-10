let express = require("express");

require("dotenv").config();
let app = express();

let { connection } = require("./config/db");
let { UserRoute } = require("./routes/user.routes");
const { RestaurantRoute } = require("./routes/resturatant.routes");
const { OrderRoute } = require("./routes/order.routes");

const { authMiddlware } = require("./middlewares/authmiddleware");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Just check");
});

app.use("/", UserRoute);

app.use(authMiddlware);

app.use("/", RestaurantRoute);
app.use("/", OrderRoute);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Conntected to mongoDB Atlas");
  } catch (err) {
    console.log(err);
  }
  console.log(`server running on port ${process.env.port}`);
});

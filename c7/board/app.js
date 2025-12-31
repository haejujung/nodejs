const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const postService = require("./services/post-service");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const mongodbConnection = require("./configs/mongodb-connection");



app.engine("handlebars", 
    handlebars.create({
        helpers: require("./configs/handlebars-helpers"),
    }).engine,
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/detail/:id", (req, res) =>{
    res.render("detail", { title: "테스트게시판" });
});

app.get("/write", (req, res) => {
    res.render("write", { title: "테스트 게시판 - 글쓰기" });
});

app.post("/write", async (req, res) => {
    const post = req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`/detail/${result.insertedId}`);
});

let collection;
app.listen(3000, async () =>{
    console.log("Server started");
    const MongoClient = await mongodbConnection();
    collection = MongoClient.db().collection("post");
    console.log("MongoDB connected");
});

async function writePost(collection, post){
    post.hits = 0;
    post.createdDt = new Date().toISOString();
    return await collection.insertOne(post);
}

// 리스트 페이지
app.get("/", async (req,res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    try{
        const [posts, paginator] = await postService.list(collection, page, search);

        res.render("home", {title: "테스트 게시판", search, paginator,posts});
    } catch (error) {
        console.error(error);
        res.render("home", {title: "테스트 게시판"});
    }

});

module.exports = {
    writePost,
};

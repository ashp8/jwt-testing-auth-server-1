import {config} from 'dotenv';
config();
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const posts =[
    {username: "bash"}, 
    {username: "bash2"}, 
    {username: "bash3"}, 
    {username: "bash4"}, 
];

const authToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


app.get('/posts', authToken, (req, res)=>{
    console.log(req.user.name);
    res.json(posts.filter(post=> post.username === req.user.name));
});

app.post('/login', (req, res)=>{
    const {username} = req.body;
    const user = {name: username};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken});

});




app.listen(4000, ()=>{console.log("Working")});
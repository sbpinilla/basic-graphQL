const  express = require("express");
const app  = express();

const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");

//data
const {courses} = require("./data.json")
//console.log(courses);


const schema = buildSchema(`
    type Query{
        message: String
        course(id:Int!):Course
        courses(topic:String):[Course]
    }

    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course

    }

    type Course{
        id: String
        title: String
        author: String
        topic: String
        url: String
    }


`);

let getCourse = (args)=>{

    let id =args.id;
    return courses.filter(course =>{
        return course.id == id;
    })[0];
};

let getCourses = (args) => {

    if(args.topic){
        let topic =args.topic;

        return courses.filter(course => course.topic === topic )
    }else{
        return courses;
    }
    
};

let updateCourseTopic = ({id, topic}) =>{
    courses.map(course => {
        if(course.id === id){
            course.topic = topic;
            return course;
        }
    })
    return courses.filter(course => course.id === id )[0];
}

const root = {
    message : ()=> "Hola mundo",
    course : getCourse,
    courses : getCourses,
    updateCourseTopic : updateCourseTopic,
};

app.use("/graphql",express_graphql({
    schema:schema,
    rootValue:root,
    graphiql:true,
}));

app.listen(3000,() => console.log("Server on port 3000 "));
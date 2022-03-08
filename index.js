const Joi = require('joi');
const express = require('express');


const app = express(); // by convention use the term app

app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
]

app.get('/', ((req, res) => {
    res.send('Hello world');
}))

app.get('/api/courses',(req,res)=>{
    res.send(courses);
})

app.get('/api/courses/:id',(req,res)=>{
    const course =  courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return  res.status(404).send('The course with the given id is not available');
    res.send(course);
});

app.get('/api/posts/:year/:month', (req,res)=>{
    res.send(req.params);
});


app.post('/api/courses', (req, res) =>{

    const { error } = validateCourse(req.body);// object distructering
    if (error)
        return res.status(400).send(error.details[0].message);



    // if(!req.body.name || req.body.name.length < 3){
    //     //400 Bad Request
    //     res.status(400).send('Name is required and should be more than 3 charcters');
    //     return;
    // }

    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);

    res.send(course);// by convention, when server creates a new object, it should send a response

});

app.put('/api/courses/:id', (req, res)=>{
    //Look up the course
    //If not existing, return 404
    const course =  courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not available');
    //validate
    //if invalid, return 400 - Bad Request

    // const schema = Joi.object({
    //     name: Joi.string().min(3).required()
    // });

   // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);// object distructering
    if (error)
        return res.status(400).send(error.details[0].message);


    //update the course
    course.name = req.body.name;
    //return the update course
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) =>{
    //Look up the coures
    // Not existing, return 404
    const course =  courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not available');


    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    //Return the same course
    res.send(course);
})

function  validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);

}






const port = process.env.PORT || 3000;

app.listen(port,()=>console.log(`Listening to port ${port} ...`));




const express = require('express');
const router = express.Router();
// Import Project model
const Project = require('../../models/project')

router.get('/', (req,res,next) => {
    // for now, just enter success
    // res.json('success');
    // Show an unfiltered list of Projects
    Project.find((err, projects) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(projects);
        }
    })
    // Mongoose v7 > add async to middleware function
    // let projects = await Project.find().sort([["DueDate", "dscending"]]);
    // res.status(200).json(projects);
})

module.exports = router;
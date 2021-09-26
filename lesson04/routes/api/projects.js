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
})

module.exports = router;
const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

router.get("/", function(req, res) {
    res.send("hey it's working");
});
// Add a GET route for /owners/create for the browser
router.get("/create", (req, res) => {
    res.render("ownerlogin"); // Assuming you have a view called 'createOwnerForm.ejs'
});


// Log the environment
if(process.env.NODE_ENV==="development") {
    router.post("/create", async function(req, res) {
        let owners=await ownerModel.find();
        if(owners.length>0){
            return res
                    .status(503) // Set the status code using status()
                    .send("You don't have permission to create a new owner");

        }
        let {fullname,email,password}=req.body;
        let createdOwner=await ownerModel.create({
            fullname,
            email,
            password,
        })
        res.status(201).send(createdOwner);
           
    });
}
router.get("/admin", function(req, res) {
    let success = req.flash("success");
    res.render("createproduct", { success });
});



module.exports = router;

const router = require("express").Router();
const upload = require("../upload");
const User = require("../model/User");
const auth = require("../middleware/auth");
const Manufacturer = require("../model/Manufacturer");
const config = require("config");
const verify = require('../middleware/verify')
router.post("/", auth, verify.isAdmin, async (req, res) => {
    try {

        console.log(req.body);
        let manufacturer = Manufacturer.create(req.body);
        res.json(manufacturer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/", auth, verify.isAdmin, async (req, res) => {
    try {

        const manufacturer = await Manufacturer.find().sort({ date: -1 });
        res.json(manufacturer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id", auth, verify.isAdmin, async (req, res) => {
    try {

        const manufacturer = await Manufacturer.findById(req.params.id);
        res.json(manufacturer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", auth, verify.isAdmin, async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, req.body);
        res.json(manufacturer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.delete("/:id", auth, verify.isAdmin, async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findByIdAndRemove(req.params.id,);
        res.json(manufacturer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});






module.exports = router;

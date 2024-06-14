const express = require("express");

const router = express.Router();

const { getContacts, createContact, getContact, updateContact, deleteContact } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken); //this is best if all your routes are protected
router.route("/").get(getContacts).post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);


module.exports = router;
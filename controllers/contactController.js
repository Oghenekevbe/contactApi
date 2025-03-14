const asyncHandler = require("express-async-handler"); //async forwards the errors to the middleware which is where error handler is
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
}
);

//@desc Get a contact by id
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id !== req.user.id) {
        res.status(403);
        throw new Error("User only has permission to view their contacts");
    }
    res.status(200).json(contact);
});



//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are Mandatory !!!");
    }
    const contact = await Contact.create({ name, email, phone, user_id: req.user.id });
    res.status(201).json(contact);
});



//@desc update a contact by id
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found! ");
    }
    if (contact.user_id !== req.user.id) {
        res.status(403);
        throw new Error("User only has permission to update their contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedContact);
});



//@desc delete a contact by id
//@route GET /api/contacts/id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id !== req.user.id) {
        res.status(403);
        throw new Error("User only has permission to delete their contacts");
    }
    await contact.deleteOne();
    res.status(200).json({ message: "Contact deleted", contact });
});






module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };
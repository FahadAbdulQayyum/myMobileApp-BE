const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator/check');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Contact = require('../models/Contact');


// @route   GET api/contacts
// @desc    Get all the user's contacts
// @access  Private
router.get('/',
    auth,
    async (req, res) => {
        try {
            const contacts = await Contact.find({ user: req.user.id }).sort({
                data: -1
            });
            res.json(contacts);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

// @route   POST api/contacts
// @desc    Add a new contact
// @access  Private
router.post('/', [
    router.post('/', [auth, [
        check('name', 'Name is required').not().isEmpty()
    ]], async (req, res) => {
        // ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // const { name, email, phone, type } = req.body;
        const { name, number, gender } = req.body;

        try {
            const newContact = new Contact({
                name,
                number,
                gender,
                user: req.user.id
            })

            const contact = await newContact.save();

            res.json(contact);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/:id',
    auth,
    async (req, res) => {

        const { name, email, phone, type } = req.body;

        const contactFields = {};

        if (name) contactFields.name = name;
        if (email) contactFields.email = email;
        if (phone) contactFields.phone = phone;
        if (type) contactFields.type = type;

        try {
            let contact = await Contact.findById(req.params.id);

            if (!contact) return res.status(404).json({ msg: 'This contact does not exist.' })

            if (contact.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'You dont have the correct authorization to update this contact.' })
            }

            contact = await Contact.findByIdAndUpdate(req.params.id,
                { $set: contactFields },
                { new: true }
            );

            res.json(contact);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

        res.send('Update the contact')
    });

// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id',
    auth,
    async (req, res) => {
        try {
            let contact = await Contact.findById(req.params.id);

            if (!contact) return res.status(404).json({ msg: 'This contact does not exist.' })

            if (contact.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'You dont have the correct authorization to delete the contact.' })
            }

            await Contact.findByIdAndRemove(req.params.id);

            res.json({ msg: 'This contact has successfully been removed.' })

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;
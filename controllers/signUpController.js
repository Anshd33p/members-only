const db = require('../db/queries');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const validateUser = [
    body('firstName').notEmpty().withMessage('First name is required').trim()
        .isAlpha().withMessage('First name must contain only letters'),
    body('lastName').notEmpty().withMessage('Last name is required').trim()
        .isAlpha().withMessage('Last name must contain only letters'),
    body('username').notEmpty().withMessage('Username is required').trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('password').notEmpty().withMessage('Password is required').trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword').notEmpty().withMessage('Confirm Password is required').trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password does not match Password');
            }
            return true;
        }),
];

exports.getSignUpPage = (req, res) => {
    res.render('sign-up', { title: 'Sign Up' });
}

exports.createUserPost = [validateUser, async (req, res) =>  {
    const { firstName, lastName, username, password } = req.body;
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('sign-up', { 
        title: 'Sign Up',
        errors: errors.array(),
        formData: req.body 
        });
    }
    
    // Hash the password
     await bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
        return res.render('sign-up', { 
            title: 'Sign Up',
            error: 'Error hashing password',
            formData: req.body 
        });
        }
       
        console.log(hash);
        console.log(req.body);
    
        // Insert user into the database
         db.createUser(firstName, lastName, username, hash)
        .then(() => {
            res.redirect('/login');
        })
        .catch(error => {
             if (error.code === '23505' && error.constraint === 'users_username_key') {
            res.render('sign-up', { 
                title: 'Sign Up',
                error: 'Username already exists. Please choose a different username.',
                formData: req.body 
               
            });
            } else {
            console.error(error);
            res.render('sign-up', { 
            title: 'Sign Up',
            error: 'Error creating user',
            formData: req.body 
            });
        }
    });
    });
    }
];
    
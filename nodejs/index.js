// // Import required modules
// const express = require('express');
// const passport = require('passport');
// const mongoose = require('mongoose');
// const { fakerDE: faker } = require('@faker-js/faker');
// const bodyParser = require('body-parser');
// const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Database connection
// mongoose.connect('mongodb://localhost:27017/organization_db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// mongoose.set('useFindAndModify', false);

// // Define schemas/models
// const organizationSchema = new mongoose.Schema({
//     name: String,
//     email: String
// });

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     role: String,
//     organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
// });

// const Organization = mongoose.model('Organization', organizationSchema);
// const User = mongoose.model('User', userSchema);


// passport.use(new JwtStrategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: 'your_secret_key',
// }, (jwtPayload, done) => {
//     User.findById(jwtPayload.id)
//         .then(user => {
//             if (user) {
//                 return done(null, user);
//             }
//             return done(null, false);
//         })
//         .catch(err => done(err, false));
// }));

// // Routes
// app.post('/login', (req, res) => {
//     // Authentication logic here
// });

// app.post('/organizations', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Create a new organization
// });

// app.put('/organizations/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Update an organization
// });

// app.get('/organizations', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Get all organizations
// });

// app.delete('/organizations/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Delete an organization
// });

// app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Create a new user
// });

// app.put('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Update a user
// });

// app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Get all users
// });

// app.delete('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // Delete a user
// });

// // Seed data using faker
// const seedData = async () => {
//     try {
//         // Seed organizations
//         for (let i = 0; i < 5; i++) {
//             await Organization.create({ name: faker.company.companyName() });
//         }

//         // Seed users
//         const organizations = await Organization.find();
//         for (let i = 0; i < 10; i++) {
//             const randomOrganization = organizations[Math.floor(Math.random() * organizations.length)];
//             await User.create({
//                 name: faker.name.findName(),
//                 email: faker.internet.email(),
//                 role: 'user', // or admin
//                 organization: randomOrganization._id,
//             });
//         }
//         console.log('Data seeded successfully');
//     } catch (err) {
//         console.error('Error seeding data:', err);
//     }
// };

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     // Seed data when server starts
//     seedData();
// });

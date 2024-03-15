const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { faker } = require('@faker-js/faker');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const app = express();
app.use(bodyParser.json());
app.use(cors())

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('DB Connected'));
const organizationSchema = new mongoose.Schema({
    name: String,
    address: String
});
const Organization = mongoose.model('Organization', organizationSchema);
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    role: {
        type: String, enum: ['user', 'admin'], default: "user"
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

const User = mongoose.model('User', userSchema);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    jwt.verify(token.split(' ')[1], "secretkey123", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }
        req.user = { userId: decoded.userId, role: decoded.role }
        next();
    });
}


app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User({ username, password: hashedPassword, role: 'user', email });
        const newUser = await user.save();
        res.status(201).send('User signup successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid username or password');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'secretkey123');
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') { res.status(401).json({ message: 'admin only access' }); } else {
            const users = await User.find();
            res.json(users);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/users/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/users/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { username, password, new_password, email } = req.body;
    try {
        const user = await User.findById(id);
        if (user) {
            if (username) user.username = username;
            if (email) user.email = email;
            if (password && new_password) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).send('Invalid old password');
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword
            }
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/users/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (user) {
            await user.remove();
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/organizations', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') res.status(401).json({ message: 'admin only access' }); else {
            const organizations = await Organization.find();
            res.json(organizations);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/organizations/users/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== 'admin') { res.status(401).json({ message: 'admin only access' }); } else {
            const user = await User.find({ organization: id })
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/organizations', authenticate, async (req, res) => {
    const { name, address } = req.body;
    const organizations = new Organization({ name, address });
    try {
        const newOrganizations = await organizations.save();
        res.status(201).json(newOrganizations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/organizations/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;
    try {
        const organization = await Organization.findById(id);
        if (organization) {
            if (name) organization.name = name;
            if (address) organization.address = address;
            const updatedOrganization = await organization.save();
            res.json(updatedOrganization);
        } else {
            res.status(404).json({ message: 'organization not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/organizations/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const organization = await Organization.findById(id);
        if (organization) {
            await organization.remove();
            res.json({ message: 'organization deleted' });
        } else {
            res.status(404).json({ message: 'organization not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/migreate', async (req, res) => {
    try {
        let organizationArr = []
        for (let i = 0; i < 5; i++) {
            const org = await Organization.create({ name: faker.company.name(), address: faker.location.city() });
            organizationArr.push(org)
        }
        await User.create({
            username: 'admin',
            password: await bcrypt.hash('admin', 10),
            role: 'admin'
        });
        const organizations = await Organization.find();
        let usersArr = [];
        for (let i = 0; i < 10; i++) {
            const randomOrganization = organizations[Math.floor(Math.random() * organizations.length)];
            const user = await User.create({
                username: faker.internet.userName(),
                password: await bcrypt.hash('password', 10),
                email: faker.internet.email(),
                role: 'user',
                organization: randomOrganization._id,
            });
            usersArr.push(user)
        }
        res.json({ organizations: organizationArr, users: usersArr });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}/`);
});

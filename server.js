require('dotenv').config()
const express = require('express')
const crypto = require('crypto')
const app = express()
app.use(express.json())

const users = [{ username: 'xyz', password: '1234' }]
const clients = [{ client_id: 'client', client_secret: 'secret', redirect_uri: 'http://localhost:4000/callback' }]
const codes = {}
const tokens = {}
const generateCode = () => {
    return crypto.randomBytes(20).toString('hex')
}
const generateToken = () => {
    return crypto.randomBytes(30).toString('hex')
}

app.get('/authorization', (req, res) => {
    const { client_id, redirect_uri, username, password } = req.query
    const client = clients.find(c => c.client_id == client_id && c.redirect_uri == redirect_uri)
    if (!client) {
        return res.status(401).json({ error: 'Client is invalid' })
    }
    const user = users.find(u => u.username == username && u.password == password)
    if (!user) {
        return res.status(401).json({ error: 'User credentials invalid' })
    }
    const code = generateCode()
    codes[code] = { client_id, username: user.username }
    res.json({ message: 'Client and user authorized', code })
})

app.post('/token', (req, res) => {
    const { code, client_id, client_secret, redirect_uri } = req.body
    if (!code || !client_id || !client_secret || !redirect_uri) {
        return res.status(400).json({ error: 'Some fields are missing' })
    }
    const client = clients.find(c => c.client_id == client_id && c.client_secret == client_secret && c.redirect_uri == redirect_uri)
    if (!client) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    const data = codes[code]
    if (!data || data.client_id != client_id) {
        return res.status(401).json({ error: 'Code invalid' })
    }
    const accessToken = generateToken()
    tokens[accessToken] = { username: data.username, client_id, expiry: Date.now() + 3600000 }
    delete codes[code]
    res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600 })
})

app.get('/resource', (req, res) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = authorization.split(' ')[1]
    const tData = tokens[token]
    if (!tData) {
        return res.status(401).json({ error: 'Token invalid' })
    }
    if (Date.now() > tData.expiry) {
        return res.status(401).json({ error: 'Token expired' })
    }
    res.json({ message: tData.username })
})

app.listen(4000, () => {
    console.log('Server running on port 4000')
})
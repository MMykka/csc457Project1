import express from 'express'
import cors from 'cors'
import { shoes } from './data.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

let items = [...shoes]
let nextId = Math.max(0, ...items.map((i) => i.id)) + 1

// GET / - points visitors to the API routes and the frontend
app.get('/', (req, res) => {
  res.json({
    message: 'Shoes API is running. The React app is at http://localhost:5173',
    routes: ['GET /items', 'GET /items/:id', 'POST /items', 'PUT /items/:id', 'DELETE /items/:id'],
  })
})

// GET /items - list all
app.get('/items', (req, res) => {
  res.json(items)
})

// GET /items/:id - get one
app.get('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id))
  if (!item) return res.status(404).json({ message: 'Item not found' })
  res.json(item)
})

// POST /items - create
app.post('/items', (req, res) => {
  const newItem = { ...req.body, id: nextId++ }
  items.push(newItem)
  res.status(201).json(newItem)
})

// PUT /items/:id - update
app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return res.status(404).json({ message: 'Item not found' })
  items[index] = { ...items[index], ...req.body, id }
  res.json(items[index])
})

// DELETE /items/:id - delete
app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return res.status(404).json({ message: 'Item not found' })
  const [deleted] = items.splice(index, 1)
  res.json(deleted)
})

app.listen(PORT, () => {
  console.log(`Shoes API running at http://localhost:${PORT}/items`)
})

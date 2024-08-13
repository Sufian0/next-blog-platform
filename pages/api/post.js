import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGET(req, res)
    case 'POST':
      return handlePOST(req, res)
    case 'PUT':
      return handlePUT(req, res)
    case 'DELETE':
      return handleDELETE(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

// GET: Fetch all posts or a single post
async function handleGET(req, res) {
  const { id } = req.query
  if (id) {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true },
    })
    if (post) {
      res.json(post)
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  } else {
    const posts = await prisma.post.findMany({ include: { author: true } })
    res.json(posts)
  }
}

// POST: Create a new post
async function handlePOST(req, res) {
  const { title, content, authorEmail } = req.body
  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: authorEmail } },
      },
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message })
  }
}

// PUT: Update an existing post
async function handlePUT(req, res) {
  const { id } = req.query
  const { title, content, published } = req.body
  try {
    const result = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, published },
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: 'Error updating post', error: error.message })
  }
}

// DELETE: Delete a post
async function handleDELETE(req, res) {
  const { id } = req.query
  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    })
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Error deleting post', error: error.message })
  }
}
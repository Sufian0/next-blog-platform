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
  if (!req.query.id) {
    const posts = await prisma.post.findMany({ select: { id: true, title: true } })
    console.log('All posts:', posts);
    res.json(posts)
  } else {
    const { id } = req.query
    console.log('GET request received for post ID:', id);
    if (id) {
      try {
        const post = await prisma.post.findUnique({
          where: { id: id },
          include: { author: true },
        })
        console.log('Fetched post:', post);
        if (post) {
          res.json(post)
        } else {
          console.log('Post not found');
          res.status(404).json({ message: 'Post not found' })
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Error fetching post', error: error.message })
      }
    } else {
      const posts = await prisma.post.findMany({ include: { author: true } })
      res.json(posts)
    }
  }
}

// POST: Create a new post
async function handlePOST(req, res) {
  const { title, content, authorEmail } = req.body
  try {
    // Check if user exists, if not create a new user
    let user = await prisma.user.findUnique({ where: { email: authorEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: authorEmail, name: authorEmail.split('@')[0] },
      })
    }

    const result = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: user.id } },
      },
    })
    res.json(result)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(400).json({ message: 'Error creating post', error: error.message })
  }
}

// PUT: Update an existing post
async function handlePUT(req, res) {
  const { id } = req.query
  const { title, content, published } = req.body
  try {
    const result = await prisma.post.update({
      where: { id: id },  // Changed from params.id to id
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
      where: { id: id },  // Changed from params.id to id
    })
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Error deleting post', error: error.message })
  }
}
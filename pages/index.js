import { useState } from 'react'
import Link from 'next/link'
import prisma from '../lib/prisma'

export default function Home({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts)

  return (
    <div>
      <h1>Blog Posts</h1>
      <Link href="/create-post">
        Create New Post
      </Link>
      <ul>
        {posts.map((post) => (
            <li key={post.id}>
                <Link href={`/post/${post.id}`}>
                    <h2>{post.title}</h2>
                </Link>
            <p>{post.content.substring(0, 100)}...</p>
            <p>Author: {post.author?.name || post.author?.email || 'Unknown'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  })
  return { 
    props: { 
      initialPosts: JSON.parse(JSON.stringify(posts))
    } 
  }
}
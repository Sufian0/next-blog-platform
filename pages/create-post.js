import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, authorEmail }),
      })
      if (response.ok) {
        router.push('/')
      } else {
        const errorData = await response.text()
        console.error('Failed to create post!!!:', errorData)
        // Show error message to user
        alert(`Failed to create post: ${errorData}`)
      }
    } catch (error) {
      console.error('Error!!!:', error)
      // Show error message to user
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create New Post</h1>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="authorEmail">Author Email:</label>
        <input
          type="email"
          id="authorEmail"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  )
}
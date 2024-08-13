import prisma from '../../lib/prisma'

export default function Post({ post, error }) {
  console.log('Rendering Post component', { post, error });
  
  if (error) return <div>Error: {error}</div>
  if (!post) return <div>Loading...</div>

  return (
    <div>
      <h1>{post.title}</h1>
      <p>By {post.author?.name || post.author?.email || 'Unknown'}</p>
      <div>{post.content}</div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  console.log('getServerSideProps called with params:', params);
  console.log('Fetching post with ID:', params.id);
  try {
      const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: { author: true },
      })
    
      console.log('Fetched post:', post);

      if (!post) {
        console.log('Post not found');
        return {
          notFound: true,
        }
      }

      return { 
        props: { 
          post: JSON.parse(JSON.stringify(post))
        } 
      }
  } catch (error) {
      console.error('Error fetching post:', error);
      return {
          props: { error: error.message }
      }
  }
}
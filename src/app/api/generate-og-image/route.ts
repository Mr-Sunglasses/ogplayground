import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const brandName = formData.get('brandName') as string
    const startColor = formData.get('startColor') as string || '#667eea'
    const endColor = formData.get('endColor') as string || '#764ba2'
    const gridType = formData.get('gridType') as string || 'none'

    if (!title) {
      return new Response('Title is required', { status: 400 })
    }

    // For now, return a simple response indicating the feature is in development
    // We'll need to implement the @vercel/og ImageResponse properly
    return new Response(
      JSON.stringify({
        message: 'OG Image generation is in development',
        settings: {
          title,
          description,
          brandName,
          startColor,
          endColor,
          gridType
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
} 
console.log('Environment check:')
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
console.log('All env vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')))

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1>Debug Environment Variables</h1>
      <p>Check console for environment variables</p>
    </div>
  )
}
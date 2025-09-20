export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-logo-primary text-white p-8">
        <h1 className="text-4xl font-bold mb-4">CSS Test Page</h1>
        <p className="text-logo-secondary text-xl mb-4">This should be gold text</p>
        <button className="bg-logo-accent text-white px-6 py-3 rounded-lg">
          Test Button
        </button>
        <div className="mt-4 p-4 bg-logo-light text-logo-dark rounded">
          <p>This should have a light green background with dark green text</p>
        </div>
      </div>
    </div>
  )
}

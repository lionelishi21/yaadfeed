export default function TestPage() {
  return (
    <div className="min-h-screen bg-yard-dark">
      <div className="bg-yard-gold text-white p-8">
        <h1 className="text-4xl font-bold mb-4">CSS Test Page</h1>
        <p className="text-yard-gold text-xl mb-4">This should be gold text</p>
        <button className="bg-yard-gold text-white px-6 py-3 rounded-lg">
          Test Button
        </button>
        <div className="mt-4 p-4 bg-yard-gold text-yard-gold rounded">
          <p>This should have a light green background with dark green text</p>
        </div>
      </div>
    </div>
  )
}

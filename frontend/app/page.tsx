import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EcoClaw Nexus
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Environmental Intelligence System for Carbon Markets
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Run Analysis</CardTitle>
              <CardDescription>
                Start environmental analysis for your Area of Interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/run">
                <Button className="w-full">Start Run</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">View Results</CardTitle>
              <CardDescription>
                Check the status and results of your analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/results">
                <Button variant="outline" className="w-full">View Results</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Evidence Bundle</CardTitle>
              <CardDescription>
                Review the complete environmental evidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/evidence">
                <Button variant="outline" className="w-full">View Evidence</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Deal Room</CardTitle>
              <CardDescription>
                MRV handoff and deal preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/deal-room">
                <Button variant="outline" className="w-full">Enter Deal Room</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Select AOI</h3>
              <p className="text-gray-600 text-sm">Choose your Area of Interest from available regions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Run Agents</h3>
              <p className="text-gray-600 text-sm">Orchestrator runs satellite, weather, and validation agents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Evidence</h3>
              <p className="text-gray-600 text-sm">Receive complete EnvironmentalEvidenceBundle</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

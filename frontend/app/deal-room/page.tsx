'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DealRoomPage() {
  const searchParams = useSearchParams()
  const bundleId = searchParams.get('id')
  const [bundle, setBundle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bundleId) {
      fetchBundle(bundleId)
    }
  }, [bundleId])

  const fetchBundle = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/bundles/${id}`)
      const data = await response.json()
      setBundle(data)
    } catch (error) {
      console.error('Failed to fetch bundle:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!bundleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Deal Room</h1>
          <p className="text-gray-600 mb-8">No bundle ID provided</p>
          <Button>
            <a href="/results">View Results</a>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Deal Room...</h1>
        </div>
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bundle Not Found</h1>
          <p className="text-gray-600 mb-8">Could not find the requested evidence bundle</p>
          <Button>
            <a href="/results">View Results</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MRV Deal Room</h1>
          <p className="text-gray-600">Environmental Evidence Bundle Handoff</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-green-600">Deal Summary</CardTitle>
              <CardDescription>Ready for MRV handoff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {bundle.aoi?.name}</div>
                      <div><strong>Area:</strong> {bundle.aoi?.area_hectares?.toLocaleString()} hectares</div>
                      <div><strong>Bundle ID:</strong> {bundle.bundle_id?.slice(0, 12)}...</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Evidence Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Satellite Evidence:</strong> {bundle.satellite_evidence?.length || 0} items</div>
                      <div><strong>Weather Evidence:</strong> {bundle.weather_evidence?.length || 0} items</div>
                      <div><strong>Total Confidence:</strong> {((bundle.total_confidence || 0) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ MRV Ready Status</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>• Evidence collection complete</div>
                    <div>• Validation passed</div>
                    <div>• Confidence score acceptable</div>
                    <div>• Ready for carbon market handoff</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Review evidence bundle details</li>
                    <li>Confirm MRV requirements met</li>
                    <li>Prepare documentation for registry</li>
                    <li>Initiate carbon credit verification</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full">
                  Download Bundle
                </Button>
                <Button variant="outline" className="w-full">
                  <a href={`/evidence?id=${bundle.bundle_id}`}>View Evidence</a>
                </Button>
                <Button variant="outline" className="w-full">
                  Export Report
                </Button>
                <Button variant="outline" className="w-full">
                  Share Bundle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Completeness:</span>
                  <span className={bundle.validation_result?.is_complete ? 'text-green-600' : 'text-red-600'}>
                    {bundle.validation_result?.is_complete ? '✅ Complete' : '❌ Incomplete'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Score:</span>
                  <span className="font-medium">
                    {((bundle.validation_result?.confidence_score || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Missing Evidence:</span>
                  <span className="font-medium">
                    {bundle.validation_result?.missing_evidence?.length || 0} types
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Validation Errors:</span>
                  <span className="font-medium">
                    {bundle.validation_result?.validation_errors?.length || 0} issues
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Environmental data verified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">MRV standards met</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Evidence bundle complete</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Ready for registry submission</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Mock Deal Information</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-medium mb-2">Estimated Carbon Credits</div>
              <div className="text-2xl font-bold text-green-600">
                {(bundle.aoi?.area_hectares || 0) * 0.8:.0f} credits/year
              </div>
              <div className="text-gray-600">Based on vegetation health</div>
            </div>
            <div>
              <div className="font-medium mb-2">Market Value</div>
              <div className="text-2xl font-bold text-blue-600">
                ${(bundle.aoi?.area_hectares || 0) * 0.8 * 15:.0f}
              </div>
              <div className="text-gray-600">At $15/credit estimate</div>
            </div>
            <div>
              <div className="font-medium mb-2">Verification Status</div>
              <div className="text-2xl font-bold text-orange-600">Pending</div>
              <div className="text-gray-600">Ready for third-party verification</div>
            </div>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Button size="lg" className="px-8">
            Submit to Registry
          </Button>
          <Button variant="outline" size="lg">
            <a href="/results">Back to Results</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

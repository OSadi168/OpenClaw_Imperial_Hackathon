'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResultsPage() {
  const [bundles, setBundles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBundles()
  }, [])

  const fetchBundles = async () => {
    try {
      const response = await fetch('http://localhost:8000/bundles')
      const data = await response.json()
      setBundles(data.bundles || [])
    } catch (error) {
      console.error('Failed to fetch bundles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analysis Results</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading results...</div>
          </div>
        ) : bundles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
              <p className="text-gray-600 mb-4">Run an analysis to see results here</p>
              <Button>
                <a href="/run">Run Analysis</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{bundle.aoi_name}</CardTitle>
                  <CardDescription>
                    Bundle ID: {bundle.bundle_id?.slice(0, 8)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Real NDVI Data Display */}
                    {bundle.satellite_analysis?.ndvi_delta && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-800 mb-1">NDVI Analysis</div>
                        <div className="text-xs text-green-600 space-y-1">
                          <div>Mean Change: +{bundle.satellite_analysis.ndvi_delta.mean_change.toFixed(2)}</div>
                          <div>Percent Change: +{bundle.satellite_analysis.ndvi_delta.percent_change.toFixed(1)}%</div>
                          <div>Quality Score: {(bundle.satellite_analysis.ndvi_delta.quality_score * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Real Drought Data Display */}
                    {bundle.weather_risk && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-orange-800 mb-1">Drought Risk</div>
                        <div className="text-xs text-orange-600 space-y-1">
                          <div>Score: {bundle.weather_risk.drought_score?.toFixed(2)}</div>
                          <div>Tier: {bundle.weather_risk.tier}</div>
                          <div>Confidence: {(bundle.weather_risk.confidence * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overall Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(bundle.total_confidence || 0)}`}>
                        {getConfidenceLabel(bundle.total_confidence || 0)} ({((bundle.total_confidence || 0) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm">
                        {new Date(bundle.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-3 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <a href={`/evidence?id=${bundle.bundle_id}`}>View Evidence</a>
                      </Button>
                      <Button size="sm" className="w-full">
                        <a href={`/deal-room?id=${bundle.bundle_id}`}>Deal Room</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

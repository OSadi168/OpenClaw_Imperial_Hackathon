'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EvidencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Evidence Bundle...</h1>
        </div>
      </div>
    }>
      <EvidenceContent />
    </Suspense>
  )
}

function EvidenceContent() {
  const searchParams = useSearchParams()
  const bundleId = searchParams.get('id')
  const [bundle, setBundle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bundleId) {
      fetchBundle(bundleId)
    } else {
      fetchLatestBundle()
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

  const fetchLatestBundle = async () => {
    try {
      const response = await fetch('http://localhost:8000/bundles/latest')
      if (response.ok) {
        const data = await response.json()
        setBundle(data)
      }
    } catch (error) {
      console.error('Failed to fetch latest bundle:', error)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Evidence Bundle...</h1>
        </div>
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Environmental Evidence Bundle</h1>
          <p className="text-gray-600">Bundle ID: {bundle.bundle_id}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Area of Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {bundle.aoi_name}
                </div>
                <div>
                  <span className="font-medium">Bundle ID:</span> {bundle.bundle_id?.slice(0, 12)}...
                </div>
                <div>
                  <span className="font-medium">Created:</span> {new Date(bundle.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Overall Confidence:</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {((bundle.total_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Complete:</span>
                  <span className={bundle.validator_review?.is_complete ? 'text-green-600' : 'text-red-600'}>
                    {bundle.validator_review?.is_complete ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Confidence Score:</span>
                  <span className="font-medium">
                    {((bundle.validator_review?.confidence_score || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Confidence:</span>
                  <span className="font-medium">
                    {((bundle.total_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Satellite Analysis</CardTitle>
              <CardDescription>Complete EO analysis from ndvi_result.json</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bundle.satellite_analysis?.earlier_scene && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Earlier Scene</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Date: {bundle.satellite_analysis.earlier_scene.date}</div>
                      <div>Satellite: {bundle.satellite_analysis.earlier_scene.satellite}</div>
                      <div>Scene ID: {bundle.satellite_analysis.earlier_scene.scene_id}</div>
                      <div>NDVI Mean: {bundle.satellite_analysis.earlier_scene.ndvi_mean}</div>
                      <div>NDVI Median: {bundle.satellite_analysis.earlier_scene.ndvi_median}</div>
                      <div>Cloud Cover: {(bundle.satellite_analysis.earlier_scene.cloud_cover * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
                
                {bundle.satellite_analysis?.later_scene && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Later Scene</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Date: {bundle.satellite_analysis.later_scene.date}</div>
                      <div>Satellite: {bundle.satellite_analysis.later_scene.satellite}</div>
                      <div>Scene ID: {bundle.satellite_analysis.later_scene.scene_id}</div>
                      <div>NDVI Mean: {bundle.satellite_analysis.later_scene.ndvi_mean}</div>
                      <div>NDVI Median: {bundle.satellite_analysis.later_scene.ndvi_median}</div>
                      <div>Cloud Cover: {(bundle.satellite_analysis.later_scene.cloud_cover * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
                
                {bundle.satellite_analysis?.ndvi_delta && (
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">NDVI Change Analysis</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Mean Change: +{bundle.satellite_analysis.ndvi_delta.mean_change.toFixed(3)}</div>
                      <div>Percent Change: +{bundle.satellite_analysis.ndvi_delta.percent_change.toFixed(1)}%</div>
                      <div>Area: {bundle.satellite_analysis.ndvi_delta.area_ha?.toLocaleString()} ha</div>
                      <div>Quality Score: {(bundle.satellite_analysis.ndvi_delta.quality_score * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
                
                {bundle.satellite_analysis?.change_signals && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Change Signals</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Primary Change: {bundle.satellite_analysis.change_signals.primary_change?.replace('_', ' ')}</div>
                      <div>Change Magnitude: {bundle.satellite_analysis.change_signals.change_magnitude.toFixed(3)}</div>
                      <div>Vegetation Increase: {(bundle.satellite_analysis.change_signals.vegetation_increase * 100).toFixed(1)}%</div>
                      <div>Vegetation Decrease: {(bundle.satellite_analysis.change_signals.vegetation_decrease * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Risk Analysis</CardTitle>
              <CardDescription>Complete drought analysis from drought_result.json</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bundle.weather_risk && (
                  <>
                    <div className="border rounded-lg p-4 bg-orange-50">
                      <h4 className="font-medium mb-2">Drought Assessment</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Drought Score: {bundle.weather_risk.drought_score?.toFixed(2)}</div>
                        <div>Risk Tier: {bundle.weather_risk.tier}</div>
                        <div>Confidence: {(bundle.weather_risk.confidence * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    {bundle.weather_risk.drivers && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Risk Drivers</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Precipitation Deficit: {bundle.weather_risk.drivers.precipitation_deficit?.toFixed(1)}mm</div>
                          <div>Temperature Anomaly: +{bundle.weather_risk.drivers.temperature_anomaly?.toFixed(1)}°C</div>
                          <div>Soil Moisture Deficit: {(bundle.weather_risk.drivers.soil_moisture_deficit * 100).toFixed(1)}%</div>
                          <div>Seasonal Timing: {bundle.weather_risk.drivers.seasonal_timing?.replace('_', ' ')}</div>
                        </div>
                      </div>
                    )}
                    
                    {bundle.weather_risk.warnings && (
                      <div className="border rounded-lg p-4 bg-yellow-50">
                        <h4 className="font-medium mb-2">Warnings</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {bundle.weather_risk.warnings.map((warning: string, index: number) => (
                            <div key={index}>• {warning}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {bundle.weather_risk.temporal_trend && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Temporal Trend</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Current Month: {bundle.weather_risk.temporal_trend.current_month?.toFixed(2)}</div>
                          <div>Previous Month: {bundle.weather_risk.temporal_trend.previous_month?.toFixed(2)}</div>
                          <div>3-Month Average: {bundle.weather_risk.temporal_trend.three_month_avg?.toFixed(2)}</div>
                          <div>Trend: {bundle.weather_risk.temporal_trend.trend_direction}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-x-4">
          <Button>
            <a href="/results">Back to Results</a>
          </Button>
          <Button variant="outline">
            <a href={`/deal-room?id=${bundle.bundle_id}`}>Deal Room</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

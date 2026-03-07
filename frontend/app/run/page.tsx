'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RunPage() {
  const [selectedAOI, setSelectedAOI] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const sampleAOIs = [
    { id: 'amazon_ridge_01', name: 'Amazon Ridge Conservation Area', area_hectares: 5000, coordinates: [[[-63.0, -3.5], [-62.8, -3.5], [-62.8, -3.3], [-63.0, -3.3], [-63.0, -3.5]]] },
    { id: 'borneo_forest_02', name: 'Borneo Forest Reserve', area_hectares: 7500, coordinates: [[[114.5, 1.2], [114.7, 1.2], [114.7, 1.4], [114.5, 1.4], [114.5, 1.2]]] },
    { id: 'congo_basin_03', name: 'Congo Basin Protection Zone', area_hectares: 10000, coordinates: [[[18.0, -1.5], [18.3, -1.5], [18.3, -1.2], [18.0, -1.2], [18.0, -1.5]]] }
  ]

  const evidenceTypes = [
    { id: 'ndvi', name: 'NDVI Analysis', description: 'Vegetation health index' },
    { id: 'change_detection', name: 'Change Detection', description: 'Land cover changes' },
    { id: 'drought_risk', name: 'Drought Risk', description: 'Drought vulnerability assessment' },
    { id: 'weather_data', name: 'Weather Data', description: 'Climatic conditions' }
  ]

  const handleRun = async () => {
    if (!selectedAOI) return

    setIsRunning(true)
    try {
      const response = await fetch('http://localhost:8000/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aoi: sampleAOIs.find(a => a.id === selectedAOI),
          evidence_types: ['ndvi', 'change_detection', 'drought_risk', 'weather_data']
        })
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Run failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Run Environmental Analysis</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Area of Interest</CardTitle>
              <CardDescription>Choose the region you want to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleAOIs.map(aoi => (
                  <div key={aoi.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="aoi"
                      value={aoi.id}
                      checked={selectedAOI === aoi.id}
                      onChange={(e) => setSelectedAOI(e.target.value)}
                      className="w-4 h-4 text-green-600"
                    />
                    <label className="flex-1">
                      <div className="font-medium">{aoi.name}</div>
                      <div className="text-sm text-gray-500">{aoi.area_hectares.toLocaleString()} hectares</div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence Types</CardTitle>
              <CardDescription>Data that will be collected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evidenceTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-green-600"
                    />
                    <label className="flex-1">
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button 
            onClick={handleRun}
            disabled={!selectedAOI || isRunning}
            size="lg"
            className="px-8"
          >
            {isRunning ? 'Running Analysis...' : 'Start Analysis'}
          </Button>
        </div>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Analysis Complete!</CardTitle>
              <CardDescription>
                Request ID: {results.request_id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Agent Results:</h4>
                  {results.agent_results?.map((agent: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium">{agent.agent_name}</div>
                      <div className="text-sm text-gray-600">
                        Status: {agent.status} | Time: {agent.execution_time.toFixed(2)}s
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Button variant="outline">
                    <a href="/results">View Detailed Results</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

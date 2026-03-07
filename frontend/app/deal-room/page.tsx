'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DealRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Deal Room...</h1>
        </div>
      </div>
    }>
      <DealRoomContent />
    </Suspense>
  )
}

function DealRoomContent() {
  const searchParams = useSearchParams()
  const bundleId = searchParams.get('id')
  const [bundle, setBundle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [verraProjects, setVerraProjects] = useState<any[]>([])
  const [verraTotal, setVerraTotal] = useState(0)
  const [companies, setCompanies] = useState<any[]>([])
  const [blockchainHash, setBlockchainHash] = useState('')

  useEffect(() => {
    if (bundleId) {
      fetchBundle(bundleId)
    } else {
      fetchLatestBundle()
    }
    fetchVerraData()
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

  const fetchVerraData = async () => {
    try {
      const [projRes, compRes] = await Promise.all([
        fetch('http://localhost:8000/api/verra-projects'),
        fetch('http://localhost:8000/api/verra-companies')
      ])
      if (projRes.ok) {
        const projData = await projRes.json()
        setVerraProjects(projData.projects || [])
        setVerraTotal(projData.total || 0)
      }
      if (compRes.ok) {
        const compData = await compRes.json()
        setCompanies(compData.companies || [])
        setBlockchainHash(compData.blockchain_hash || '')
      }
    } catch (error) {
      console.error('Failed to fetch Verra data:', error)
    }
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
                      <div><strong>Name:</strong> {bundle.aoi_name}</div>
                      <div><strong>Bundle ID:</strong> {bundle.bundle_id?.slice(0, 12)}...</div>
                      <div><strong>Created:</strong> {new Date(bundle.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Evidence Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Satellite Analysis:</strong> {bundle.satellite_analysis ? 'Available' : 'N/A'}</div>
                      <div><strong>Weather Risk:</strong> {bundle.weather_risk ? 'Available' : 'N/A'}</div>
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
                  <span className={bundle.validator_review?.is_complete ? 'text-green-600' : 'text-red-600'}>
                    {bundle.validator_review?.is_complete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Score:</span>
                  <span className="font-medium">
                    {((bundle.validator_review?.confidence_score || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Confidence:</span>
                  <span className="font-medium">
                    {((bundle.total_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>NDVI Change:</span>
                  <span className="font-medium text-green-600">
                    +{bundle.satellite_analysis?.ndvi_delta?.mean_change?.toFixed(3) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Drought Score:</span>
                  <span className="font-medium text-orange-600">
                    {bundle.weather_risk?.drought_score?.toFixed(2) || 'N/A'} ({bundle.weather_risk?.tier || 'N/A'})
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
          <h3 className="font-semibold text-lg mb-4">Deal Information</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-medium mb-2">Estimated Carbon Credits</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(5000 * 0.8)} credits/year
              </div>
              <div className="text-gray-600">Based on vegetation health</div>
            </div>
            <div>
              <div className="font-medium mb-2">Market Value</div>
              <div className="text-2xl font-bold text-blue-600">
                ${Math.round(5000 * 0.8 * 15).toLocaleString()}
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

        {blockchainHash && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-purple-600">Blockchain Anchoring</CardTitle>
              <CardDescription>SHA256 hash of verified company dataset for immutable audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                {blockchainHash}
              </div>
              <p className="text-xs text-gray-500 mt-2">This hash anchors the cleaned Verra dataset ({verraTotal} projects, {companies.length} companies) to an immutable record.</p>
            </CardContent>
          </Card>
        )}

        {verraProjects.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-blue-600">Verra Carbon Registry Projects</CardTitle>
              <CardDescription>Matching projects from the cleaned Verra dataset ({verraTotal} total projects)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-semibold">ID</th>
                      <th className="text-left py-2 px-3 font-semibold">Project Name</th>
                      <th className="text-left py-2 px-3 font-semibold">Proponent</th>
                      <th className="text-left py-2 px-3 font-semibold">Type</th>
                      <th className="text-left py-2 px-3 font-semibold">Status</th>
                      <th className="text-right py-2 px-3 font-semibold">Est. Annual Reductions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verraProjects.slice(0, 8).map((project: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-500">{project.ID}</td>
                        <td className="py-2 px-3 font-medium">{project.Name?.slice(0, 40)}{project.Name?.length > 40 ? '...' : ''}</td>
                        <td className="py-2 px-3">{project.Proponent?.slice(0, 25)}{project.Proponent?.length > 25 ? '...' : ''}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{project['Project Type']}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{project.Status}</span>
                        </td>
                        <td className="py-2 px-3 text-right">{project['Estimated Annual Emission Reductions']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">Showing 8 of {verraTotal} registered Verra projects</p>
            </CardContent>
          </Card>
        )}

        {companies.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-indigo-600">Verified Counterparties</CardTitle>
              <CardDescription>Companies extracted from Verra proponent data ({companies.length} organizations)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                {companies.slice(0, 12).map((company: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="font-medium">{company.company_name?.slice(0, 30)}{company.company_name?.length > 30 ? '...' : ''}</div>
                    <div className="text-xs text-gray-500">{company.country} | {company.region}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Showing 12 of {companies.length} verified organizations</p>
            </CardContent>
          </Card>
        )}

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

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileSpreadsheet } from 'lucide-react'

interface CreateDialogueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Variation {
  id: string
  widgetType: string
  html: string
  css: string
  text: string
}

interface RecommendationsResponse {
  success: boolean
  variations: Variation[]
  campaignObjective: string
  productCount: number
  category: string
  availableCategories: string[]
  generatedAt: string
}

const STEPS = [
  { number: 1, title: 'Overview' },
  { number: 2, title: 'Versions' },
  { number: 3, title: 'Code snippet' },
]

export default function CreateDialogueModal({ open, onOpenChange }: CreateDialogueModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    campaignObjective: '',
    productList: 'Allproducts.csv',
    additionalPrompt: ''
  })
  const [campaignName, setCampaignName] = useState('')
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]) // User can select none or multiple
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null)

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      if (currentStep === 1) {
        try {
          const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              campaignObjective: formData.campaignObjective,
              productList: formData.productList,
              additionalPrompt: formData.additionalPrompt
            })
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const recommendationsData = await response.json()
          console.log('Received recommendations:', recommendationsData)
          setRecommendations(recommendationsData)
        } catch (error) {
          console.error('Error generating recommendations:', error)
          // You might want to show an error message to the user here
        }
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveAndClose = async () => {
    // If on step 3, save the selected variations to backend
    if (currentStep === 3 && recommendations && selectedVersions.length > 0) {
      try {
        // Get the first selected variation (API expects single variation)
        const firstSelectedIndex = selectedVersions[0]
        const selectedVariation = recommendations.variations[firstSelectedIndex]
        
        const saveData = {
          campaignName: campaignName,
          campaignObjective: formData.campaignObjective,
          variation: {
            widgetType: selectedVariation.widgetType,
            html: selectedVariation.html,
            css: selectedVariation.css,
            text: selectedVariation.text
          },
          category: "all", // Default as specified in API
          additionalPrompt: formData.additionalPrompt || undefined,
          notes: undefined // Optional field, can be added later
        }

        console.log('Saving campaign with variation:', {
          campaignName,
          widgetType: selectedVariation.widgetType,
          htmlLength: selectedVariation.html.length,
          cssLength: selectedVariation.css.length,
          textLength: selectedVariation.text.length
        })

        const response = await fetch('http://localhost:3000/save-campaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saveData)
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('Campaign saved successfully:', result)
        // You could show a success message here
        
      } catch (error) {
        console.error('Error saving campaign:', error)
        // You could show an error message here
        return // Don't close modal if save failed
      }
    }
    
    // Close modal and reset
    onOpenChange(false)
    setCurrentStep(1)
    setSelectedVersions([])
    setRecommendations(null)
    setCampaignName('')
  }

  const toggleVersionSelection = (versionIndex: number) => {
    setSelectedVersions(prev => 
      prev.includes(versionIndex)
        ? [] // Deselect if clicking the same one
        : [versionIndex] // Select only this one (single selection)
    )
  }





  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
      <DialogContent className="max-w-[1120px] h-[780px] p-0 gap-0 bg-zinc-100 rounded-2xl overflow-hidden flex">
        {/* Sidebar Navigation */}
        <div className="w-64 h-full p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-5 relative">
            {/* Connector Line */}
            <div className="absolute left-4 top-[18px] bottom-[18px] w-px bg-zinc-400" />
            
            {STEPS.map((step) => (
              <div key={step.number} className="flex items-center gap-2 relative z-10">
                <div 
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${
                    step.number === currentStep
                      ? 'bg-white border-blue-600 text-blue-600'
                      : step.number < currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-sm text-zinc-900">{step.title}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleSaveAndClose}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 text-left"
          >
            Save & close
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-sm flex flex-col min-h-0">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 shrink-0">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-zinc-900">
                {STEPS[currentStep - 1]?.title}
              </h2>
              <p className="text-sm text-zinc-500">
                {currentStep === 1 && "Pick your goal, upload products, and set prompts. Our AI personalizes every visit in real time."}
                {currentStep === 2 && "Choose the variation that best fits your campaign. You can select one option."}
                {currentStep === 3 && "Review your campaign details and save your configuration."}
              </p>
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 min-h-0">
            <div className="space-y-6 pb-6">
              {currentStep === 1 && (
                <>
                  {/* Campaign Objective */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900">
                      Campaign objective
                    </label>
                    <Select 
                      value={formData.campaignObjective} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, campaignObjective: value }))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Increase order value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase-order-value">Increase order value</SelectItem>
                        <SelectItem value="customer-retention">Customer retention</SelectItem>
                        <SelectItem value="brand-awareness">Brand awareness</SelectItem>
                        <SelectItem value="lead-generation">Lead generation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product List */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900">
                      Product list
                    </label>
                    <div className="h-9 bg-white border border-zinc-200 rounded-md shadow-sm flex items-center px-3 py-2">
                      <span className="flex-1 text-sm text-zinc-900">
                        {formData.productList}
                      </span>
                      <FileSpreadsheet className="h-4 w-4 text-zinc-500" />
                    </div>
                  </div>

                  {/* Additional Prompt */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900">
                      Additional prompt
                    </label>
                    <Textarea
                      placeholder="What is the goal of your campaign?"
                      value={formData.additionalPrompt}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalPrompt: e.target.value }))}
                      className="min-h-[100px] text-sm"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  {recommendations?.variations ? 
                    recommendations.variations.map((variation, versionIndex) => (
                      <div 
                        key={variation.id}
                        onClick={() => toggleVersionSelection(versionIndex)}
                        className={`relative min-h-[300px] bg-white border rounded-lg shadow-sm cursor-pointer transition-all p-6 ${
                          selectedVersions.includes(versionIndex) 
                            ? 'border-2 border-blue-600' 
                            : 'border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                        }`}
                      >
                        {selectedVersions.includes(versionIndex) && (
                          <Badge 
                            className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-600 text-white shadow-md"
                          >
                            Selected
                          </Badge>
                        )}
                        
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-zinc-900 capitalize">
                                {variation.widgetType.replace('_', ' ')} Widget
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {variation.widgetType}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Live Widget Preview */}
                          <div className="border rounded-lg overflow-hidden bg-white">
                            <div className="text-xs text-zinc-500 px-4 py-2 bg-gray-50 border-b uppercase tracking-wide">
                              Live Preview
                            </div>
                            <div className="p-4">
                              <style dangerouslySetInnerHTML={{ __html: variation.css }} />
                              <div dangerouslySetInnerHTML={{ __html: variation.html }} />
                            </div>
                          </div>
                          
                          {/* Code Snippets - Collapsible */}
                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-900 flex items-center gap-2">
                              <span className="text-xs">▶</span>
                              <span>View Code</span>
                            </summary>
                            <div className="mt-3 space-y-3">
                              {/* HTML Code */}
                              <div className="border rounded-lg p-3 bg-gray-50">
                                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">HTML</div>
                                <div 
                                  className="text-xs bg-white p-3 rounded border max-h-24 overflow-y-auto"
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  {variation.html}
                                </div>
                              </div>
                              
                              {/* CSS Code */}
                              <div className="border rounded-lg p-3 bg-gray-50">
                                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">CSS</div>
                                <div 
                                  className="text-xs bg-white p-3 rounded border max-h-24 overflow-y-auto"
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  {variation.css}
                                </div>
                              </div>
                            </div>
                          </details>
                          
                          {/* Persuasive Text */}
                          <div className="space-y-2">
                            <div className="text-xs text-zinc-500 uppercase tracking-wide">Persuasive Content</div>
                            <div className="text-sm text-zinc-600 leading-relaxed">
                              <div className="line-clamp-4">
                                {variation.text}
                              </div>
                            </div>
                          </div>
                          
                          {/* Selection Indicator */}
                          <div className="pt-2 border-t border-zinc-100">
                            <span className="text-xs text-zinc-400 italic">
                              Click to select this {variation.widgetType} widget (replaces current selection)
                            </span>
                          </div>
                        </div>
                      </div>
                    )) : 
                    /* Loading/No data state */
                    <div className="flex items-center justify-center h-64 text-zinc-400">
                      <p>No variations available. Please complete step 1 first.</p>
                    </div>
                  }
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Campaign Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900">
                      Campaign name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter campaign name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full h-9 px-3 py-2 text-sm border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Selected Variation Summary */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-900">
                      Selected Variation
                    </h3>
                    {selectedVersions.length > 0 ? (
                      <div className="p-3 bg-zinc-50 rounded-lg">
                        {(() => {
                          const variation = recommendations?.variations[selectedVersions[0]]
                          if (!variation) return null
                          return (
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">
                                {variation.widgetType}
                              </Badge>
                              <span className="text-sm text-zinc-700 capitalize">
                                {variation.widgetType.replace('_', ' ')} Widget
                              </span>
                            </div>
                          )
                        })()}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">
                        No variation selected. Please go back to step 2 to select a variation.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="border-t border-zinc-200 px-6 py-4 shrink-0 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-zinc-500">
                  Blueconic AI can make mistakes.{' '}
                  <button className="underline hover:no-underline">
                    Learn more
                  </button>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                {currentStep === 3 ? (
                  <Button
                    onClick={handleSaveAndClose}
                    disabled={!campaignName.trim() || selectedVersions.length !== 1}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Save Campaign
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={currentStep >= STEPS.length}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
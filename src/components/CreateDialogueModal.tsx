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
import { FileSpreadsheet, Copy } from 'lucide-react'

interface CreateDialogueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]) // User can select none or multiple

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveAndClose = () => {
    onOpenChange(false)
    setCurrentStep(1)
  }

  const toggleVersionSelection = (versionIndex: number) => {
    setSelectedVersions(prev => 
      prev.includes(versionIndex)
        ? prev.filter(index => index !== versionIndex)
        : [...prev, versionIndex]
    )
  }

  const codeSnippet = `<iframe src="https://VWHAM.ai/c/2rF5KEXRnon0" class="formless-embed" width="100%" height="600px" loading="lazy" style="border: 0; display: block"></iframe>

<script src="https://embed.VWHAM.ai/embed.js" async></script>`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet)
      // Could add a toast notification here in the future
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
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
                {currentStep === 2 && "Your selections will help tune the output for users. You can select as many options as you like"}
                {currentStep === 3 && "Copy and paste this code into your application"}
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
                  {[0, 1, 2, 3, 4].map((versionIndex) => (
                    <div 
                      key={versionIndex}
                      onClick={() => toggleVersionSelection(versionIndex)}
                      className={`relative h-[300px] bg-zinc-100 rounded-lg shadow-sm cursor-pointer transition-all ${
                        selectedVersions.includes(versionIndex) 
                          ? 'border-2 border-blue-600' 
                          : 'border border-transparent hover:border-zinc-300'
                      }`}
                    >
                      {selectedVersions.includes(versionIndex) && (
                        <Badge 
                          className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-600 text-white shadow-md"
                        >
                          Selected
                        </Badge>
                      )}
                      {/* Placeholder content - this would be populated from backend */}
                      <div className="flex items-center justify-center h-full text-zinc-400">
                        <p>Version {versionIndex + 1} Preview</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-zinc-500">Code snippet step content coming soon...</p>
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
                <Button
                  onClick={handleNext}
                  disabled={currentStep >= STEPS.length}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
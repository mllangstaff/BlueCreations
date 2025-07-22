import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Loader2, Copy, Check } from "lucide-react";
import { CodeBlock, dracula } from "react-code-blocks";

interface CreateDialogueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Variation {
  id: string;
  widgetType: string;
  html: string;
  css: string;
  text: string;
}

interface RecommendationsResponse {
  success: boolean;
  variations: Variation[];
  campaignObjective: string;
  productCount: number;
  category: string;
  availableCategories: string[];
  generatedAt: string;
}

const STEPS = [
  { number: 1, title: "Overview" },
  { number: 2, title: "Versions" },
  { number: 3, title: "Code snippet" },
];

export default function CreateDialogueModal({
  open,
  onOpenChange,
}: CreateDialogueModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    campaignObjective: "",
    productList: "Allproducts.csv",
    additionalPrompt: "",
  });
  const [campaignName, setCampaignName] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]); // User can select none or multiple
  const [recommendations, setRecommendations] =
    useState<RecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [iframeCode, setIframeCode] = useState<string>("");
  const [isGeneratingIframe, setIsGeneratingIframe] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showCampaignNamingDialog, setShowCampaignNamingDialog] = useState(false);
  const [tempCampaignName, setTempCampaignName] = useState("");

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      if (currentStep === 1) {
        setIsLoading(true);
        try {
          const response = await fetch(
            "http://localhost:3000/backoffice/generate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                campaignObjective: formData.campaignObjective,
                productList: formData.productList,
                additionalPrompt: formData.additionalPrompt,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const recommendationsData = await response.json();
          console.log("Received recommendations:", recommendationsData);
          setRecommendations(recommendationsData);

          // Only advance to next step after successful API call
          setCurrentStep(currentStep + 1);
        } catch (error) {
          console.error("Error generating recommendations:", error);
          // You might want to show an error message to the user here
        } finally {
          setIsLoading(false);
        }
      } else if (currentStep === 2) {
        // Show campaign naming dialog before moving to Step 3
        if (selectedVersions.length > 0) {
          setTempCampaignName(campaignName || "");
          setShowCampaignNamingDialog(true);
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        // For other steps, advance immediately
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const generateIframeCode = async () => {
    setIsGeneratingIframe(true);
    try {
      const selectedVariationIds = selectedVersions.map(
        (index) => recommendations!.variations[index].id
      );

      const response = await fetch(
        "http://localhost:3000/backoffice/generate-iframe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaignName: campaignName,
            campaignObjective: formData.campaignObjective,
            selectedVariationIds: selectedVariationIds,
            additionalPrompt: formData.additionalPrompt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Generated iframe code:", data);
      setIframeCode(data.iframeCode || "");
    } catch (error) {
      console.error("Error generating iframe code:", error);
      // Fallback iframe code if API fails
      const campaignId = Math.random().toString(36).substr(2, 9);
      const campaignSlug = campaignName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setIframeCode(`<iframe 
  src="https://your-domain.com/widget/${campaignSlug}-${campaignId}" 
  data-campaign="${campaignName}"
  width="100%" 
  height="400" 
  frameborder="0">
</iframe>

<script>
  // ${campaignName} - Launch Script
  window.BlueconicConfig = {
    campaign: "${campaignName}",
    campaignId: "${campaignSlug}-${campaignId}"
  };
</script>`);
    } finally {
      setIsGeneratingIframe(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleCampaignNameConfirm = async () => {
    if (tempCampaignName.trim()) {
      setCampaignName(tempCampaignName.trim());
      setShowCampaignNamingDialog(false);
      
      // Generate iframe code with the campaign name
      if (selectedVersions.length > 0 && recommendations) {
        await generateIframeCode();
      }
      
      // Move to Step 3
      setCurrentStep(3);
    }
  };

  const handleCampaignNameCancel = () => {
    setShowCampaignNamingDialog(false);
    setTempCampaignName("");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndClose = async () => {
    // If on step 3, save the selected variations to backend
    if (currentStep === 3 && recommendations && selectedVersions.length > 0) {
      try {
        // Save each selected variation as a separate campaign
        for (let i = 0; i < selectedVersions.length; i++) {
          const versionIndex = selectedVersions[i];
          const selectedVariation = recommendations.variations[versionIndex];
          
          // Create unique campaign name if multiple selections
          const uniqueCampaignName = selectedVersions.length > 1 
            ? `${campaignName} - ${selectedVariation.widgetType} ${i + 1}`
            : campaignName;

          const saveData = {
            campaignName: uniqueCampaignName,
            campaignObjective: formData.campaignObjective,
            variation: {
              widgetType: selectedVariation.widgetType,
              html: selectedVariation.html,
              css: selectedVariation.css,
              text: selectedVariation.text,
            },
            targetingCriteria: {}, // You can populate this with targeting data
            category: "all", // Default as specified in API
            notes: "", // Empty string for now
          };

          console.log(`Saving campaign ${i + 1}/${selectedVersions.length}:`, {
            campaignName: uniqueCampaignName,
            widgetType: selectedVariation.widgetType,
            htmlLength: selectedVariation.html.length,
            cssLength: selectedVariation.css.length,
            textLength: selectedVariation.text.length,
          });

          const response = await fetch(
            "http://localhost:3000/backoffice/save-campaign",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(saveData),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log(`Campaign ${i + 1} saved successfully:`, result);
        }
        // You could show a success message here
      } catch (error) {
        console.error("Error saving campaigns:", error);
        // You could show an error message here
        return; // Don't close modal if save failed
      }
    }

    // Close modal and reset
    onOpenChange(false);
    setCurrentStep(1);
    setSelectedVersions([]);
    setRecommendations(null);
    setCampaignName("");
    setIframeCode("");
    setIsCopied(false);
    setShowCampaignNamingDialog(false);
    setTempCampaignName("");
  };

  const toggleVersionSelection = (versionIndex: number) => {
    setSelectedVersions(
      (prev) =>
        prev.includes(versionIndex)
          ? prev.filter(index => index !== versionIndex) // Remove from selection
          : [...prev, versionIndex] // Add to selection (multiple selection)
    );
  };

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
              <div
                key={step.number}
                className="flex items-center gap-2 relative z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${
                    step.number === currentStep
                      ? "bg-white border-primary text-primary"
                      : step.number < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-white border-zinc-200 text-zinc-900"
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
            className="text-sm font-medium text-primary hover:text-primary/80 text-left"
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
                {currentStep === 1 &&
                  "Pick your goal, upload products, and set prompts. Our AI personalizes every visit in real time."}
                {currentStep === 2 &&
                  "Choose the variation that best fits your campaign. You can select multiple options."}
                {currentStep === 3 &&
                  "Copy the code below and paste it into any <div> on your site where you want the Dialogue to appear."}
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
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          campaignObjective: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Increase order value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase-order-value">
                          Increase order value
                        </SelectItem>
                        <SelectItem value="customer-retention">
                          Customer retention
                        </SelectItem>
                        <SelectItem value="brand-awareness">
                          Brand awareness
                        </SelectItem>
                        <SelectItem value="lead-generation">
                          Lead generation
                        </SelectItem>
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          additionalPrompt: e.target.value,
                        }))
                      }
                      className="min-h-[100px] text-sm"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  {recommendations?.variations ? (
                    recommendations.variations.map(
                      (variation, versionIndex) => (
                        <div
                          key={variation.id}
                          onClick={() => toggleVersionSelection(versionIndex)}
                          className={`relative cursor-pointer transition-all p-6 rounded-lg ${
                            selectedVersions.includes(versionIndex)
                              ? "border-2 border-primary bg-primary/5"
                              : "border border-zinc-200 hover:border-zinc-300 hover:shadow-md bg-white"
                          }`}
                        >
                          {selectedVersions.includes(versionIndex) && (
                            <Badge className="absolute -top-2 -right-2 bg-primary hover:bg-primary text-primary-foreground shadow-md">
                              Selected
                            </Badge>
                          )}

                          {/* Header */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Hey User, based on your history I've got some products I think you'll love!
                          </h3>
                          
                          {/* Description with Persuasive Text */}
                          <p className="text-sm text-gray-600 mb-6">
                            {variation.text}
                          </p>
                          
                          {/* Products from API */}
                          <div className="bg-white rounded-lg p-4 border">
                            {/* Inject CSS from API */}
                            <style
                              dangerouslySetInnerHTML={{
                                __html: variation.css,
                              }}
                            />
                            {/* Inject HTML from API */}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: variation.html,
                              }}
                            />
                          </div>
                          
                          {/* Footer */}
                          <div className="mt-4 text-center">
                            <p className="text-xs text-gray-400">Blueconic AI can make mistakes. Learn more</p>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    /* Loading/No data state */
                    <div className="flex items-center justify-center h-64 text-zinc-400">
                      <p>
                        No variations available. Please complete step 1 first.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col h-full">
                  {/* Content Section */}
                  <div className="flex-1 px-6 py-6">
                    <div className="space-y-6">
                      {/* Code Block Section */}
                      <div className="rounded-lg border border-primary overflow-hidden">
                        <div className="bg-[#1c1c1c] p-5">
                          {isGeneratingIframe ? (
                            <div className="flex items-center justify-center h-32">
                              <div className="flex items-center gap-2 text-zinc-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating embed code...
                              </div>
                            </div>
                          ) : iframeCode ? (
                            <div className="font-mono text-sm text-white/40 leading-5">
                              <pre className="whitespace-pre-wrap">
                                <code 
                                  dangerouslySetInnerHTML={{ 
                                    __html: iframeCode
                                      .replace(/</g, '&lt;')
                                      .replace(/>/g, '&gt;')
                                      .replace(/(&lt;)(\/?)(iframe|script)(\s|&gt;)/g, '$1<span class="text-blue-400/60">$2$3</span>$4')
                                      .replace(/(src|width|height|loading|style|async|class|frameborder)/g, '<span class="text-blue-400">$1</span>')
                                      .replace(/=("[^"]*")/g, '=<span class="text-orange-300">$1</span>')
                                  }} 
                                />
                              </pre>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-32">
                              <p className="text-zinc-400 text-sm">
                                No embed code generated yet
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Copy Button */}
                        <Button
                          onClick={handleCopyCode}
                          disabled={!iframeCode || isGeneratingIframe}
                          className="w-full h-9 bg-primary hover:bg-primary/90 text-white rounded-none rounded-b-lg shadow-sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {isCopied ? "Copied!" : "Copy Code"}
                        </Button>
                      </div>
                    </div>
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
                  Blueconic AI can make mistakes.{" "}
                  <button className="underline hover:no-underline">
                    Learn more
                  </button>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep === 3 ? (
                  <Button
                    onClick={handleSaveAndClose}
                    disabled={
                      !campaignName.trim() || selectedVersions.length === 0
                    }
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={currentStep >= STEPS.length || isLoading || (currentStep === 2 && isGeneratingIframe)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-gray-400"
                  >
                    {isLoading || (currentStep === 2 && isGeneratingIframe) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {currentStep === 2 ? "Generating..." : "Loading..."}
                      </>
                    ) : (
                      "Next"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Campaign Naming Dialog */}
      {showCampaignNamingDialog && (
        <Dialog open={showCampaignNamingDialog} onOpenChange={setShowCampaignNamingDialog}>
          <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
          <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Name your campaign
                </h3>
                <p className="text-sm text-zinc-500">
                  Give your campaign a memorable name that will be included in the embed script.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">
                  Campaign name
                </label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  value={tempCampaignName}
                  onChange={(e) => setTempCampaignName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tempCampaignName.trim()) {
                      handleCampaignNameConfirm();
                    }
                  }}
                  className="w-full h-9 px-3 py-2 text-sm border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  autoFocus
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleCampaignNameCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCampaignNameConfirm}
                  disabled={!tempCampaignName.trim() || isGeneratingIframe}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isGeneratingIframe ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}

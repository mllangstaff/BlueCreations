import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import CreateDialogueModal from './CreateDialogueModal'
import {
  LayoutGrid,
  BarChart3,
  FileSpreadsheet,
  PanelLeft,
  Plus,
  Filter,
  MoreVertical
} from 'lucide-react'

// Campaign interface
interface Campaign {
  id: string
  name: string
  objective: string
  variation: {
    widgetType: string
    html: string
    css: string
    text: string
  }
  category?: string
  additionalPrompt?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

// API Response interface
interface CampaignsResponse {
  success: boolean
  campaigns: Campaign[]
  pagination: {
    total: number
    limit: number
    offset: number
    page: number
    totalPages: number
    hasMore: boolean
  }
  filters: {
    category: string
    search: string | null
  }
}

function Sidebar() {
  return (
    <div className="bg-muted flex flex-col w-16 h-full border-r border-border">
      {/* Brand Logo */}
      <div className="p-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <div className="w-5 h-5 bg-white rounded-sm" />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-2 py-2 space-y-1">
        <Button
          variant="secondary"
          size="sm"
          className="w-full h-8 justify-center p-0"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 justify-center p-0"
        >
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 justify-center p-0"
        >
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* User Avatar */}
      <div className="p-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

function Header({ onCreateDialogue }: { onCreateDialogue: () => void }) {
  return (
    <div className="h-16 border-b border-border bg-background">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-normal text-foreground">Dashboard</span>
        </div>
        <Button 
          onClick={onCreateDialogue}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Dialogue
        </Button>
      </div>
    </div>
  )
}

function FilterTabs() {
  return (
    <div className="flex items-center justify-between w-full">
      <Tabs defaultValue="all" className="w-auto">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="all" className="text-sm font-medium">All</TabsTrigger>
          <TabsTrigger value="active" className="text-sm font-medium">Active</TabsTrigger>
          <TabsTrigger value="draft" className="text-sm font-medium">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="text-sm font-medium">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  )
}

// Helper function to format relative time
function getRelativeTime(dateString?: string) {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function DialogueCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="overflow-hidden">
      {/* Placeholder image area */}
      <div className="aspect-[3/2] bg-muted" />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-card-foreground truncate">
              {campaign.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign.variation.widgetType.replace('_', ' ')} • {campaign.objective.replace('-', ' ')}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Updated {getRelativeTime(campaign.updatedAt || campaign.createdAt)}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 shrink-0">
            <MoreVertical className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [isCreateDialogueModalOpen, setIsCreateDialogueModalOpen] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('http://localhost:3000/campaigns')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: CampaignsResponse = await response.json()
        console.log('Fetched campaigns:', data)
        
        if (data.success && data.campaigns) {
          setCampaigns(data.campaigns)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns')
        setCampaigns([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  // Refetch campaigns when a new campaign is created
  const handleCreateDialogue = () => {
    setIsCreateDialogueModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setIsCreateDialogueModalOpen(open)
    // Refetch campaigns when modal closes (in case a new campaign was saved)
    if (!open) {
      const refetchCampaigns = async () => {
        try {
          const response = await fetch('http://localhost:3000/campaigns')
          if (response.ok) {
            const data: CampaignsResponse = await response.json()
            if (data.success && data.campaigns) {
              setCampaigns(data.campaigns)
            }
          }
        } catch (err) {
          console.error('Error refetching campaigns:', err)
        }
      }
      refetchCampaigns()
    }
  }

  return (
    <div className="flex h-screen bg-background border border-border">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onCreateDialogue={handleCreateDialogue} />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-12 py-6 space-y-6">
            {/* Filter Controls */}
            <FilterTabs />
            
            {/* Campaign Cards Grid */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Loading campaigns...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">No campaigns found. Create your first campaign!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaigns.map((campaign) => (
                    <DialogueCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Dialogue Modal */}
      <CreateDialogueModal
        open={isCreateDialogueModalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
}
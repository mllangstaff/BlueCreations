import { useState } from 'react'
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

// Mock dialogue data
const mockDialogues = [
  { id: '1', title: 'My New Dialogue', editedAt: '1 day ago' },
  { id: '2', title: 'My New Dialogue (2)', editedAt: '4 days ago' },
  { id: '3', title: 'My New Dialogue (3)', editedAt: '5 days ago' },
  { id: '4', title: 'My New Dialogue (4)', editedAt: '1 day ago' },
  { id: '5', title: 'My New Dialogue (5)', editedAt: '4 days ago' },
  { id: '6', title: 'My New Dialogue (6)', editedAt: '5 days ago' }
]

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

function DialogueCard({ dialogue }: { dialogue: typeof mockDialogues[0] }) {
  return (
    <Card className="overflow-hidden">
      {/* Placeholder image area */}
      <div className="aspect-[3/2] bg-muted" />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-card-foreground truncate">
              {dialogue.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              Edited {dialogue.editedAt}
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

  const handleCreateDialogue = () => {
    setIsCreateDialogueModalOpen(true)
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
            
            {/* Dialogue Cards Grid */}
            <div className="space-y-4">
              {/* First row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDialogues.slice(0, 3).map((dialogue) => (
                  <DialogueCard key={dialogue.id} dialogue={dialogue} />
                ))}
              </div>
              
              {/* Second row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDialogues.slice(3, 6).map((dialogue) => (
                  <DialogueCard key={dialogue.id} dialogue={dialogue} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Dialogue Modal */}
      <CreateDialogueModal
        open={isCreateDialogueModalOpen}
        onOpenChange={setIsCreateDialogueModalOpen}
      />
    </div>
  )
}
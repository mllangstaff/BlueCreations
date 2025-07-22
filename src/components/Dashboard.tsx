import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import CreateDialogueModal from './CreateDialogueModal'
import Products from './Products'
import GroupIcon from '../assets/Group.svg'
import { ThemeToggle } from './ThemeToggle'
import {
  LayoutGrid,
  BarChart3,
  FileSpreadsheet,
  PanelLeft,
  Plus,
  Filter,
  MoreVertical,
  Upload
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

function AppSidebar({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="w-8 h-8 bg-[#355df9] rounded-lg flex items-center justify-center">
          <img src={GroupIcon} alt="Group" className="w-5 h-5" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'dashboard'} 
                  tooltip="Dashboard"
                  onClick={() => onNavigate('dashboard')}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'analytics'} 
                  tooltip="Analytics"
                  onClick={() => onNavigate('analytics')}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'products'} 
                  tooltip="Products"
                  onClick={() => onNavigate('products')}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-center gap-2">
          <ThemeToggle />
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-zinc-900 text-white text-xs">U</AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function Header({ onCreateDialogue, currentPage }: { onCreateDialogue: () => void; currentPage: string }) {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Dashboard'
      case 'analytics': return 'Analytics'
      case 'products': return 'My Products'
      default: return 'Dashboard'
    }
  }

  const renderActionButton = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Button 
            onClick={onCreateDialogue}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dialogue
          </Button>
        )
      case 'products':
        return (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Product Feed
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-16 border-b border-border bg-background">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" disabled>
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-normal text-foreground">{getPageTitle(currentPage)}</span>
        </div>
        {renderActionButton()}
      </div>
    </div>
  )
}

function FilterTabs() {
  return (
    <div className="flex items-center justify-between w-full">
      <Tabs defaultValue="all" className="w-auto">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="all" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">All</TabsTrigger>
          <TabsTrigger value="active" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">Active</TabsTrigger>
          <TabsTrigger value="draft" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">Archived</TabsTrigger>
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

function DashboardContent() {
  return (
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
  )
}

export default function Dashboard() {
  const [isCreateDialogueModalOpen, setIsCreateDialogueModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleCreateDialogue = () => {
    setIsCreateDialogueModalOpen(true)
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />
      case 'products':
        return <Products />
      case 'analytics':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Analytics</h2>
              <p className="text-muted-foreground">Analytics page coming soon...</p>
            </div>
          </div>
        )
      default:
        return <DashboardContent />
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <SidebarInset>
        {/* Header */}
        <Header onCreateDialogue={handleCreateDialogue} currentPage={currentPage} />
        
        {/* Content Area */}
        {renderContent()}
      </SidebarInset>

      {/* Create Dialogue Modal */}
      <CreateDialogueModal
        open={isCreateDialogueModalOpen}
        onOpenChange={setIsCreateDialogueModalOpen}
      />
    </SidebarProvider>
  )
}
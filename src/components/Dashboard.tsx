import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import CreateDialogueModal from "./CreateDialogueModal";
import Products from "./Products";
import GroupIcon from "../assets/Group.svg";
import { ThemeToggle } from "./ThemeToggle";
import {
  LayoutGrid,
  BarChart3,
  FileSpreadsheet,
  PanelLeft,
  Plus,
  Filter,
  MoreVertical,
  Upload,
  Search,
  ShoppingCart,
  ExternalLink,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";

// Campaign interface
interface Campaign {
  id: string;
  name: string;
  objective: string;
  variation: {
    widgetType: string;
    html: string;
    css: string;
    text: string;
  };
  category?: string;
  additionalPrompt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response interface
interface CampaignsResponse {
  success: boolean;
  campaigns: Campaign[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    category: string;
    search: string | null;
  };
}

function AppSidebar({
  currentPage,
  onNavigate,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
}) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="w-8 h-8 bg-[#FF8921] rounded-lg flex items-center justify-center">
          <img src={GroupIcon} alt="Group" className="w-5 h-5" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === "dashboard"}
                  tooltip="Dashboard"
                  onClick={() => onNavigate("dashboard")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === "analytics"}
                  tooltip="Analytics"
                  onClick={() => onNavigate("analytics")}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === "products"}
                  tooltip="Products"
                  onClick={() => onNavigate("products")}
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
            <AvatarFallback className="bg-zinc-900 text-white text-xs">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function Header({
  onCreateDialogue,
  currentPage,
}: {
  onCreateDialogue: () => void;
  currentPage: string;
}) {
  const getPageTitle = (page: string) => {
    switch (page) {
      case "dashboard":
        return "My Dashboard";
      case "analytics":
        return "Analytics";
      case "products":
        return "My Products";
      default:
        return "My Dashboard";
    }
  };

  const renderActionButton = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Button
            onClick={onCreateDialogue}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dialogue
          </Button>
        );
      case "products":
        return (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Upload className="h-4 w-4 mr-2" />
            Upload Product Feed
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-16 border-b border-border bg-background">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" disabled>
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-normal text-foreground">
            {getPageTitle(currentPage)}
          </span>
        </div>
        {renderActionButton()}
      </div>
    </div>
  );
}

function FilterTabs() {
  return (
    <div className="flex items-center justify-between w-full">
      <Tabs defaultValue="all" className="w-auto">
        <TabsList className="bg-muted p-1">
          <TabsTrigger
            value="all"
            className="text-sm font-medium data-[state=inactive]:text-muted-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="text-sm font-medium data-[state=inactive]:text-muted-foreground"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="text-sm font-medium data-[state=inactive]:text-muted-foreground"
          >
            Draft
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="text-sm font-medium data-[state=inactive]:text-muted-foreground"
          >
            Archived
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-4">
        <div className="relative w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search...."
            className="w-full h-9 pl-9 pr-3 py-1 text-sm bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
}

// Helper function to format relative time
function getRelativeTime(dateString?: string) {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function DialogueCard({ campaign }: { campaign: Campaign }) {
  const handleVisitPage = () => {
    const url = `http://localhost:3001?campaignName=${encodeURIComponent(campaign.name)}`;
    window.open(url, "_blank");
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit campaign:", campaign.id);
  };

  const handleRename = () => {
    // TODO: Implement rename functionality
    console.log("Rename campaign:", campaign.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete campaign:", campaign.id);
  };

  return (
    <Card className="overflow-hidden">
      {/* Placeholder image area */}
      <div className="aspect-[3/2] bg-muted" style={{ 
          backgroundImage: `url(src/assets/thumbnail.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center'
      }}/>

      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-card-foreground truncate">
              {campaign.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign.variation.widgetType.replace("_", " ")} •{" "}
              {campaign.objective.replace("-", " ")}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Updated{" "}
              {getRelativeTime(campaign.updatedAt || campaign.createdAt)}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6 shrink-0">
                <MoreVertical className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={handleVisitPage} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit} className="gap-2">
                <Wrench className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRename} className="gap-2">
                <Pencil className="h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent({
  campaigns,
  isLoading,
  error,
}: {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
}) {
  return (
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
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center space-y-10">
              {/* Shopping Cart Illustration */}
              <div className="w-[284px] h-[280px] overflow-hidden relative">
                <img 
                  src="http://localhost:3845/assets/0e775bdb5516d7b0ebb9ddc6e18a6188a1c42209.svg" 
                  alt="Shopping cart illustration"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl font-semibold text-slate-900 leading-7">
                  Nothing here… yet!
                </h3>
                <p className="text-sm text-slate-500 leading-5">
                  Create a dialogue and start selling smarter
                </p>
              </div>
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
  );
}

export default function Dashboard() {
  const [isCreateDialogueModalOpen, setIsCreateDialogueModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:3000/backoffice/campaigns"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignsResponse = await response.json();
        console.log("Fetched campaigns:", data);

        if (data.success && data.campaigns) {
          setCampaigns(data.campaigns);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch campaigns"
        );
        setCampaigns([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCreateDialogue = () => {
    setIsCreateDialogueModalOpen(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleModalClose = (open: boolean) => {
    setIsCreateDialogueModalOpen(open);
    // Refetch campaigns when modal closes (in case a new campaign was saved)
    if (!open) {
      const refetchCampaigns = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/backoffice/campaigns"
          );
          if (response.ok) {
            const data: CampaignsResponse = await response.json();
            if (data.success && data.campaigns) {
              setCampaigns(data.campaigns);
            }
          }
        } catch (err) {
          console.error("Error refetching campaigns:", err);
        }
      };
      refetchCampaigns();
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "analytics":
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Analytics page coming soon...
            </p>
          </div>
        );
      case "products":
        return <Products />;
      default:
        return (
          <DashboardContent
            campaigns={campaigns}
            isLoading={isLoading}
            error={error}
          />
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <SidebarInset>
        {/* Header */}
        <Header
          onCreateDialogue={handleCreateDialogue}
          currentPage={currentPage}
        />

        {/* Content Area */}
        {renderContent()}
      </SidebarInset>

      {/* Create Dialogue Modal */}
      <CreateDialogueModal
        open={isCreateDialogueModalOpen}
        onOpenChange={handleModalClose}
      />
    </SidebarProvider>
  );
}

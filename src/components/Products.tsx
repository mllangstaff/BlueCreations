import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Filter, MoreHorizontal } from "lucide-react";

// Mock product data matching the Figma design
const mockProducts = [
  {
    id: "1",
    title: "Laser Lemonade Machi...",
    description: "I am a product & this is my description",
    price: "$100",
    stock: "29",
    redirect: "Nike.com/productname",
    image: "/placeholder-product.jpg",
  },
  {
    id: "2",
    title: "Hypernova Headphone...",
    description: "I am a product & this is my description",
    price: "$100",
    stock: "30",
    redirect: "Nike.com/productname",
    image: "/placeholder-product.jpg",
  },
  {
    id: "3",
    title: "AeroGlow Desk Lamp...",
    description: "I am a product & this is my description",
    price: "$100",
    stock: "34",
    redirect: "Nike.com/productname",
    image: "/placeholder-product.jpg",
  },
  {
    id: "4",
    title: "TechTonic Energy Drink...",
    description: "I am a product & this is my description",
    price: "$100",
    stock: "32",
    redirect: "Nike.com/productname",
    image: "/placeholder-product.jpg",
  },
  {
    id: "5",
    title: "Gamer Gear Pro Contro...",
    description: "I am a product & this is my description",
    price: "$100",
    stock: "38",
    redirect: "Nike.com/productname",
    image: "/placeholder-product.jpg",
  },
];

function FilterTabs() {
  return (
    <div className="flex items-center justify-between w-full">
      <Tabs defaultValue="all" className="w-auto">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="all" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">
            All
          </TabsTrigger>
          <TabsTrigger value="in-stock" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">
            In-stock
          </TabsTrigger>
          <TabsTrigger value="out-of-stock" className="text-sm font-medium data-[state=inactive]:text-muted-foreground">
            Out-of-stock
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
}

export default function Products() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Filter Controls */}
        <FilterTabs />

        {/* Products Table */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead className="w-[100px]">Stock</TableHead>
                <TableHead className="w-[200px]">Redirect</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-muted rounded flex-shrink-0" />
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {product.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{product.price}</span>
                  </TableCell>
                  <TableCell>
                    <span>{product.stock}</span>
                  </TableCell>
                  <TableCell>
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 hover:underline"
                    >
                      {product.redirect}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-5 of 32 products
          </p>
        </div>
      </div>
    </div>
  );
}

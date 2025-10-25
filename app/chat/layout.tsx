import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar  />
      <main className="min-w-full">
        
        {children}
      </main>
    </SidebarProvider>
  )
}
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Clock, CheckCircle, BarChart3, Shield, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "대시보드",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "내 허가서",
    url: "/my-permits",
    icon: FileText,
  },
  {
    title: "승인 대기",
    url: "/pending",
    icon: Clock,
  },
  {
    title: "전체 허가서",
    url: "/all-permits",
    icon: CheckCircle,
  },
  {
    title: "통계",
    url: "/statistics",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-base" data-testid="text-sidebar-title">안전작업허가</h2>
            <p className="text-xs text-muted-foreground">Safety Permit</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 mb-2">
            <p className="text-xs text-muted-foreground font-medium">메뉴</p>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.url}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link href="/create">
          <Button className="w-full" data-testid="button-sidebar-create">
            <Plus className="w-4 h-4 mr-2" />
            새 허가서 작성
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

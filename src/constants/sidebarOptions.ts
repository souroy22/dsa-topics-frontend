import { CheckCircle, CircleDashed, Home } from "lucide-react";

export const sidebarOptions = [
  { title: "All Topics", IconComponent: Home, value: "all" },
  { title: "Pending Topics", IconComponent: CircleDashed, value: "pending" },
  { title: "Completed", IconComponent: CheckCircle, value: "completed" },
];

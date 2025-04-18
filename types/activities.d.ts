export interface Activity {
   id: string;
   type: "scheduled" | "manual" | "scan" | "error" | "connection";
   timestamp: string;
   details: string;
}

export interface FilterButtonProps {
   label: string;
   isActive: boolean;
   onPress: () => void;
}

export interface ActivityItemProps {
   activity: Activity;
   icon: React.ReactNode;
}

import { Text, View } from "react-native";
import { Bell } from "lucide-react-native";
import { iconWithClassName } from "@/lib/utils";
import { Link } from "expo-router";

iconWithClassName(Bell);

function Header() {
   return (
      <View className="h-16 px-5 flex flex-row justify-between items-center bg-white/5">
         <Link href="/(routes)/tabs/home">
            <Text className="font-logo text-3xl text-gray-300">Pawmigo</Text>
         </Link>
         <Bell size={20} className="text-white" />
      </View>
   );
}

export default Header;

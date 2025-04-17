import { Text, View } from "react-native";
import { Notification } from "@/icons";

function Header() {
   return (
      <View className="h-16 px-5 flex flex-row justify-between items-center bg-white/5">
         <Text className="font-logo text-3xl text-gray-300">Pawmigo</Text>
         <Notification size={20} fill="white" />
      </View>
   );
}

export default Header;

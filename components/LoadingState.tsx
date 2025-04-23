import React from "react";
import { View, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

export default function LoadingState() {
   return (
      <View className="flex-1 items-center justify-center">
         <LottieView
            style={{ width: width * 0.8, height: width * 0.8, opacity: 0.5 }}
            source={require("@/assets/animations/paw-loading.json")}
            autoPlay
            loop
         />
      </View>
   );
}

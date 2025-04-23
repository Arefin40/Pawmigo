import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
   withRepeat,
   useAnimatedStyle,
   withTiming,
   Easing,
   useSharedValue
} from "react-native-reanimated";

export default function RFID() {
   const scale = useSharedValue(1);
   const opacity = useSharedValue(0.35);

   React.useEffect(() => {
      const EasingFn = Easing.bezier(0.25, -0.5, 0.25, 1);
      // Start animations immediately
      scale.value = withRepeat(
         withTiming(1.5, { duration: 1000, easing: EasingFn }),
         -1, // Infinite repeats
         false // Reverse animation
      );
      opacity.value = withRepeat(
         withTiming(0, { duration: 1000, easing: EasingFn }),
         -1, // Infinite repeats
         false // Reverse animation
      );
   }, [scale, opacity]); // Add dependencies

   const pulseAnimation = useAnimatedStyle(() => {
      return {
         transform: [{ scale: scale.value }],
         opacity: opacity.value,
         backgroundColor: "#0ea5e9"
      };
   });

   return (
      <View className="flex flex-col items-center justify-center">
         <View className="relative">
            <Animated.View style={[pulseAnimation]} className="absolute inset-0 rounded-full" />

            <View
               style={{ width: 96, height: 96 }}
               className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gray-100"
            >
               <Svg viewBox="0 0 24 24" width={40} height={40}>
                  <Path
                     fill="#55abff"
                     d="M22.887 9.862l-8.75-8.75a3.75 3.75 0 00-2.65-1.1H3.762a3.75 3.75 0 00-3.75 3.75v7.725a3.75 3.75 0 001.1 2.65l8.75 8.75a3.75 3.75 0 005.313 0l7.712-7.712a3.75 3.75 0 000-5.313z"
                  />
                  <Path
                     fill="#dadde2"
                     d="M6.262 7.512a1.25 1.25 0 01-.875-.362 1.25 1.25 0 01-.275-1.4 1.088 1.088 0 01.275-.4 1.25 1.25 0 011.363-.238 1.088 1.088 0 01.4.275 1.25 1.25 0 01.275.363 1.25 1.25 0 01-1.163 1.725z"
                  />
               </Svg>
            </View>
         </View>
      </View>
   );
}

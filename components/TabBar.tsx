import React from "react";
import { cn } from "@/lib/utils";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
   return (
      <View className="flex flex-row bg-white/5">
         {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
               options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
               const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true
               });

               if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
               }
            };

            const onLongPress = () => {
               navigation.emit({
                  type: "tabLongPress",
                  target: route.key
               });
            };

            const animatedStyle = useAnimatedStyle(() => ({
               transform: [{ scaleX: withTiming(isFocused ? 1 : 0.5, { duration: 120 }) }]
            }));

            return (
               <Pressable
                  key={route.key}
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarButtonTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  className="pb-1 pt-4 flex flex-1 items-center"
               >
                  <View className="relative px-5 py-1.5">
                     <Animated.View
                        style={animatedStyle}
                        className={cn("absolute inset-0 !rounded-full overflow-hidden", {
                           "bg-secondary": isFocused
                        })}
                     />

                     {options.tabBarIcon?.({
                        focused: isFocused,
                        color: isFocused ? "#145f3e" : "#d1d5db",
                        size: 24
                     })}
                  </View>

                  <Text className="font-strong text-sm pt-1 text-center text-gray-300">
                     {label}
                  </Text>
               </Pressable>
            );
         })}
      </View>
   );
};

export default TabBar;

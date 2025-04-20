import React from "react";
import Storage from "@/lib/storage";
import Lottie from "lottie-react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Dimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react-native";
import { iconWithClassName } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

iconWithClassName(ArrowRight);
const { width } = Dimensions.get("window");

const handleOnboarding = async () => {
   await Storage.store("onboarded", true);
   router.push("/(routes)/tabs/home");
};

export default function onboarding() {
   const [currentPage, setCurrentPage] = React.useState(0);

   return (
      <>
         <StatusBar style="light" backgroundColor={currentPage === 0 ? "#E9F7EC" : "white"} />
         <Onboarding
            onSkip={handleOnboarding}
            onDone={handleOnboarding}
            showSkip
            bottomBarHighlight={false}
            pageIndexCallback={(index) => setCurrentPage(index)}
            SkipButtonComponent={({ onPress }) => (
               <Button variant="link" onPress={onPress}>
                  <Text className="text-lg font-sans text-black">Skip</Text>
               </Button>
            )}
            NextButtonComponent={({ onPress }) => (
               <Button
                  variant="link"
                  onPress={onPress}
                  className="no-underline group-active:no-underline"
               >
                  <Text className="text-lg font-sans text-black">Next</Text>
               </Button>
            )}
            DoneButtonComponent={({ onPress }) => (
               <View style={{ width }} className="flex-1 gap-2 flex items-center justify-start">
                  <Button
                     onPress={onPress}
                     className="flex flex-row items-center justify-center gap-2 bg-primary px-10 py-4 rounded-full"
                  >
                     <Text className="text-lg text-white font-em flex-shrink-0">Get Started</Text>
                     <ArrowRight size={20} className="text-white border" />
                  </Button>
               </View>
            )}
            pages={[
               {
                  backgroundColor: "#E9F7EC",
                  image: (
                     <Lottie
                        autoPlay
                        style={{ width: width * 0.9, height: width }}
                        source={require("@/assets/animations/pet-care.json")}
                     />
                  ),
                  title: "Stay Connected",
                  subtitle: "Stay close to your pet anytime, anywhere.",
                  titleStyles: { fontFamily: "Mulish_700Bold" },
                  subTitleStyles: { fontFamily: "Mulish_500Medium" }
               },
               {
                  backgroundColor: "#fff",
                  image: (
                     <Lottie
                        autoPlay
                        loop={false}
                        style={{ width: width * 0.9, height: width }}
                        source={require("@/assets/animations/footstep.json")}
                     />
                  ),
                  title: "Smart Arrival Alerts",
                  subtitle: "Get notified as your pet nears the feeder.\nNever miss a mealtime.",
                  titleStyles: { fontFamily: "Mulish_700Bold" },
                  subTitleStyles: { fontFamily: "Mulish_500Medium" }
               },
               {
                  backgroundColor: "#fff",
                  image: (
                     <View className="overflow-hidden">
                        <Lottie
                           autoPlay
                           loop={false}
                           style={{
                              width: width * 0.9,
                              height: width * 0.9,
                              transform: [{ scale: 2 }]
                           }}
                           source={require("@/assets/animations/pet.json")}
                        />
                     </View>
                  ),
                  title: "Make Feeding Smart",
                  subtitle: "Personalize the feeder for seamless meals",
                  titleStyles: { fontFamily: "Mulish_700Bold" },
                  subTitleStyles: { fontFamily: "Mulish_500Medium" }
               }
            ]}
         />
      </>
   );
}

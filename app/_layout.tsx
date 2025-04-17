import "@/global.css";
import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Platform, Text } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useColorScheme } from "@/lib/useColorScheme";
import { Sora_700Bold } from "@expo-google-fonts/sora";
import { Mulish_500Medium, Mulish_600SemiBold, Mulish_700Bold } from "@expo-google-fonts/mulish";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";

const LIGHT_THEME: Theme = {
   ...DefaultTheme,
   colors: NAV_THEME.light
};
const DARK_THEME: Theme = {
   ...DarkTheme,
   colors: NAV_THEME.dark
};

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
   const [fontsLoaded] = useFonts({
      Mulish_500Medium,
      Mulish_600SemiBold,
      Mulish_700Bold,
      Sora_700Bold
   });

   if (!fontsLoaded) {
      return <Text>Loading fonts...</Text>;
   }

   const hasMounted = React.useRef(false);
   const { colorScheme, isDarkColorScheme } = useColorScheme();
   const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

   useIsomorphicLayoutEffect(() => {
      if (hasMounted.current) {
         return;
      }

      if (Platform.OS === "web") {
         document.documentElement.classList.add("bg-background");
      }
      setAndroidNavigationBar(colorScheme);
      setIsColorSchemeLoaded(true);
      hasMounted.current = true;
   }, []);

   if (!isColorSchemeLoaded) {
      return null;
   }

   return (
      <>
         <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <Stack>
               <Stack.Screen
                  name="index"
                  options={{
                     title: "Starter Base",
                     headerRight: () => <ThemeToggle />
                  }}
               />
            </Stack>
            <PortalHost />
         </ThemeProvider>
         <PortalHost />
      </>
   );
}

const useIsomorphicLayoutEffect =
   Platform.OS === "web" && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

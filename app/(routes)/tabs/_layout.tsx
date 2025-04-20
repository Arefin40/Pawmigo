import React from "react";
import { Tabs } from "expo-router";
import { Home, Activities, Pets } from "@/icons";
import TabBar from "@/components/TabBar";

const TabLayout = () => {
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: "transparent" }
         }}
         tabBar={(props) => <TabBar {...props} />}
      >
         <Tabs.Screen
            name="home"
            options={{
               title: "Home",
               tabBarIcon: (props) => <Home {...props} filled={props.focused} fill={props.color} />
            }}
         />
         <Tabs.Screen
            name="activities"
            options={{
               title: "Activities",
               tabBarIcon: (props) => (
                  <Activities {...props} filled={props.focused} fill={props.color} />
               )
            }}
         />
         <Tabs.Screen
            name="pets"
            options={{
               title: "Pets",
               tabBarIcon: (props) => <Pets {...props} filled={props.focused} fill={props.color} />
            }}
         />
      </Tabs>
   );
};
export default TabLayout;

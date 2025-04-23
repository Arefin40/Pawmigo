import React from "react";
import { Paw } from "@/icons";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { iconWithClassName } from "@/lib/utils";
import { View, Image, ScrollView, Pressable } from "react-native";
import ScanRFIDModal from "@/components/ScanRFIDModal";
import LoadingState from "@/components/LoadingState";
import { router } from "expo-router";

iconWithClassName(Plus);

export default function MyPetsScreen() {
   const pets = useQuery(api.pets.getPets);
   const [open, setOpen] = React.useState(false);

   if (pets === undefined) {
      return <LoadingState />;
   }

   return (
      <View className="flex flex-1 p-4">
         <Text className="font-strong text-2xl text-white mb-6">My Pets</Text>

         {pets.length === 0 ? (
            <View className="flex-1 items-center justify-center">
               <View className="w-48 h-48 mb-6 items-center justify-center">
                  <Paw size={120} fill="#8D9187" />
               </View>
               <Text className="text-white/60 text-xl text-center font-em mb-2">
                  No pets added yet
               </Text>
               <Text className="text-white/40 text-base text-center font-em">
                  Tap the + button to add your first pet
               </Text>
            </View>
         ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 w-full">
               {pets.map((pet) => (
                  <Pressable
                     key={pet._id}
                     onPress={() => router.push(`/schedules/${pet._id}`)}
                     className="bg-white/10 rounded-xl p-4 mb-4 flex-row items-center"
                  >
                     {pet.image ? (
                        <Image
                           source={{ uri: pet.image }}
                           className="w-16 h-16 rounded-full mr-4"
                        />
                     ) : (
                        <View className="w-16 h-16 rounded-full bg-white/10 mr-4 items-center justify-center">
                           <Paw size={28} fill="#8D9187" />
                        </View>
                     )}

                     <View className="flex flex-col gap-y-1">
                        <Text className="text-xl text-white font-semibold font-em">{pet.name}</Text>
                        <Text className="text-muted-foreground font-sans">{pet.rfid}</Text>
                     </View>
                  </Pressable>
               ))}
            </ScrollView>
         )}

         <Button
            onPress={() => setOpen(true)}
            className="absolute bottom-8 right-8 !w-16 !h-16 rounded-full flex-shrink-0 elevation-md"
         >
            <Text className="text-white font-semibold text-3xl font-strong">
               <Plus className="w-6 h-6 text-white flex-shrink-0" />
            </Text>
         </Button>
         {open && <ScanRFIDModal open={open} onOpenChange={(state) => setOpen(state)} />}
      </View>
   );
}

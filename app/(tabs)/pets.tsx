import React from "react";
import { View, Image, ScrollView } from "react-native";
import { Paw } from "@/icons";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import ScanRFIDModal from "@/components/ScanRFIDModal";
import { iconWithClassName } from "@/lib/icons";
import { axios, isAxiosError } from "@/hooks/axios";

iconWithClassName(Plus);

interface Pet {
   id: string;
   name: string;
   rfid: string;
   photo?: string;
}

export default function MyPetsScreen() {
   const [open, setOpen] = React.useState(false);
   const [pets, setPets] = React.useState<Pet[]>([]);

   React.useEffect(() => {
      const fetchPets = async () => {
         try {
            const { data } = await axios.get("/pets");
            setPets(data.pets);
         } catch (error) {
            if (isAxiosError(error)) {
               console.error("Failed to fetch pets:", error.response?.data || error.message);
            } else {
               console.error("An unexpected error occurred:", error);
            }
         }
      };
      fetchPets();
   }, []);

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
                  <View
                     key={pet.id}
                     className="bg-white/10 rounded-xl p-4 mb-4 flex-row items-center"
                  >
                     {pet.photo ? (
                        <Image
                           source={{ uri: pet.photo }}
                           className="w-16 h-16 rounded-full mr-4"
                        />
                     ) : (
                        <View className="w-16 h-16 rounded-full bg-white/10 mr-4 items-center justify-center">
                           <Paw size={28} fill="#8D9187" />
                        </View>
                     )}

                     <View className="flex flex-col gap-y-2">
                        <Text className="text-xl text-white font-semibold font-em">{pet.name}</Text>
                        <Text className="text-muted-foreground font-sans">{pet.rfid}</Text>
                     </View>
                  </View>
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

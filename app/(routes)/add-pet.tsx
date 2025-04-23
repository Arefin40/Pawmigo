import React from "react";
import { Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Upload } from "lucide-react-native";
import { iconWithClassName } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams, router } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as ImagePicker from "expo-image-picker";

iconWithClassName(Upload);

interface PetData {
   name: string;
   image: ImagePickerAsset;
   rfid: string;
}

interface Pet {
   name: string;
   rfid: string;
   image?: string;
}

export default function NewPet() {
   const { rfid } = useLocalSearchParams();
   const [petData, setPetData] = React.useState<PetData>({
      name: "",
      image: {} as ImagePickerAsset,
      rfid: rfid ? (rfid as string) : ""
   });
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const addPet = useMutation(api.pets.addPet);

   React.useEffect(() => {
      (async () => {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to upload pet photos!");
         }
      })();
   }, []);

   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ["images"],
         allowsEditing: true,
         aspect: [1, 1],
         quality: 1,
         base64: true
      });

      if (!result.canceled) {
         setPetData({ ...petData, image: result.assets[0] });
      }
   };

   const handleSubmit = async () => {
      if (!petData.name.trim() || !petData.rfid.trim()) {
         Alert.alert("Error", "Please enter both pet name and RFID");
         return;
      }

      const pet: Pet = {
         name: petData.name.trim(),
         rfid: petData.rfid.trim()
      };

      setIsSubmitting(true);

      try {
         // Upload image to Cloudinary if one was selected
         if (petData.image.base64) {
            try {
               const imageUrl = await uploadToCloudinary(petData.image.base64);
               pet.image = imageUrl;
            } catch (error) {
               console.error("Error uploading image:", error);
               Alert.alert("Warning", "Failed to upload image, but will continue adding pet");
            }
         }

         // Save pet data to Convex
         await addPet(pet);

         // Reset form and navigate to pets page
         setPetData({ name: "", image: {} as ImagePickerAsset, rfid: "" });
         router.push("/tabs/pets");
      } catch (error) {
         console.error("Error saving pet:", error);
         Alert.alert("Error", "Failed to add pet. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <View className="flex flex-1 gap-y-10 p-4 items-center">
         <Text className="font-strong text-2xl text-white">Welcome Your New Pet</Text>

         <View className="items-center justify-center max-w-md mx-auto w-full">
            <View className="flex gap-y-2 mb-10">
               <View className="flex flex-row justify-center">
                  <View className="relative">
                     <Avatar
                        className="h-48 w-48 border-4 border-white/20 elevation-lg transition-transform active:scale-95"
                        alt="Pet Image"
                     >
                        {petData.image ? (
                           <AvatarImage
                              source={{ uri: petData.image.uri }}
                              className="opacity-95"
                           />
                        ) : (
                           <AvatarFallback className="bg-white/10 backdrop-blur-sm">
                              <Upload className="h-20 w-20 text-white/70" />
                           </AvatarFallback>
                        )}
                     </Avatar>
                     <Pressable
                        onPress={pickImage}
                        className="absolute inset-0 opacity-0 rounded-full"
                     />
                  </View>
               </View>

               <Text className="text-white/70 text-center font-medium text-lg font-em">
                  {petData.image ? "Tap to change photo" : "Add a photo of your pet"}
               </Text>
            </View>

            <View className="w-full gap-8 bg-white/10 rounded-3xl p-6">
               <View>
                  <Text className="text-white/90 font-medium mb-3 text-lg font-em">Pet's Name</Text>
                  <Input
                     placeholder="Enter your pet's name"
                     value={petData.name}
                     onChangeText={(text) => setPetData({ ...petData, name: text })}
                  />
               </View>

               <View>
                  <Text className="text-white/90 font-medium mb-3 text-lg font-em">RFID</Text>
                  <Input
                     editable={!rfid}
                     placeholder="Enter your pet's RFID"
                     value={petData.rfid}
                     onChangeText={(text) => setPetData({ ...petData, rfid: text })}
                  />
               </View>

               <Button
                  onPress={handleSubmit}
                  className="h-16 elevation-md backdrop-blur-sm active:scale-98"
                  disabled={isSubmitting}
               >
                  <Text className="text-white font-semibold text-xl font-em">
                     {isSubmitting ? "Adding..." : "Add Pet"}
                  </Text>
               </Button>
            </View>
         </View>
      </View>
   );
}

import React from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import RFID from "@/icons/RFID";
import { View } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { Link, router } from "expo-router";

interface ScanRFIDModalProps {
   open: boolean;
   onOpenChange: (value: boolean) => void;
}

// Initialize NFCManager
NfcManager.start();

const ScanRFIDModal: React.FC<ScanRFIDModalProps> = ({ open = false, onOpenChange }) => {
   const [error, setError] = React.useState<string | null>(null);
   const [isScanning, setIsScanning] = React.useState<boolean>(false);

   const handleNFCError = (err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load NFC module");
   };

   const validateNFC = async () => {
      if (!NfcManager) throw new Error("NFCManager is not imported");

      const isSupported = await NfcManager.isSupported();
      if (!isSupported) throw new Error("NFC is not supported");

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) throw new Error("NFC is not enabled");
   };

   const checkNFC = React.useCallback(async () => {
      try {
         await validateNFC();
      } catch (err) {
         handleNFCError(err);
      }
   }, []);

   const handleTagFound = (tag: { id?: string }) => {
      if (tag?.id) {
         onOpenChange(false);
         router.push({ pathname: "/new-pet", params: { rfid: tag.id } });
      }
   };

   const readNFC = React.useCallback(async () => {
      try {
         await NfcManager.cancelTechnologyRequest();
         await NfcManager.requestTechnology(NfcTech.Ndef);
         setIsScanning(true);

         const tag = await NfcManager.getTag();
         if (tag) handleTagFound(tag);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to read NFC tag");
      } finally {
         setIsScanning(false);
         await NfcManager.cancelTechnologyRequest();
      }
   }, [onOpenChange]);

   React.useEffect(() => {
      checkNFC();
      return () => {
         NfcManager.cancelTechnologyRequest();
      };
   }, [checkNFC]);

   React.useEffect(() => {
      if (open && !isScanning) {
         readNFC();
      }
   }, [open, isScanning, readNFC]);

   return (
      <Dialog open={open} onOpenChange={onOpenChange} className="!w-full !max-w-none">
         <DialogContent className="sm:max-w-[425px] !w-full !max-w-none sm:w-full rounded-3xl py-6">
            <RFID />
            <DialogHeader className="gap-y-3">
               <DialogTitle className="text-center native:text-2xl">
                  {isScanning ? "Scanning..." : "Tap to Scan"}
               </DialogTitle>
               <DialogDescription className="text-center native:text-xl">
                  {error && typeof error === "string"
                     ? error
                     : "Hold your phone near your pet's RFID tag to scanning."}
               </DialogDescription>

               <View className="relative border-b border-border w-full my-8">
                  <Text className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-2 bg-white text-muted-foreground font-strong">
                     OR
                  </Text>
               </View>

               <DialogFooter className="flex flex-row justify-center">
                  <Link href="/new-pet" asChild>
                     <Button
                        onPress={() => onOpenChange(false)}
                        className="bg-sky-100 py-6 px-24 rounded-full"
                     >
                        <Text className="font-strong text-sky-600 text-base text-center uppercase">
                           Add Manually
                        </Text>
                     </Button>
                  </Link>
               </DialogFooter>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   );
};

export default ScanRFIDModal;

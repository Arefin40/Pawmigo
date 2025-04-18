import React from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from "@/components/ui/dialog";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import RFID from "@/icons/RFID";
import { Link } from "expo-router";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { View } from "react-native";

interface ScanRFIDModalProps {
   open: boolean;
   onOpenChange: (value: boolean) => void;
}

interface NFCState {
   isSupported: boolean;
   isEnabled: boolean;
   isLoading: boolean;
   isScanning: boolean;
}

// Initialize NFCManager
NfcManager.start();

const ScanRFIDModal: React.FC<ScanRFIDModalProps> = ({ open = false, onOpenChange }) => {
   const [tag, setTag] = React.useState<string | null>(null);
   const [error, setError] = React.useState<string | null>(null);
   const [nfcState, setNfcState] = React.useState<NFCState>({
      isSupported: false,
      isEnabled: false,
      isLoading: false,
      isScanning: false
   });

   const checkNFC = React.useCallback(async () => {
      try {
         setNfcState((prev) => ({ ...prev, isLoading: true }));

         if (!NfcManager) {
            throw new Error("NFCManager is not imported");
         }

         const isSupported = await NfcManager.isSupported();
         if (!isSupported) {
            throw new Error("NFC is not supported");
         }

         const isEnabled = await NfcManager.isEnabled();
         if (!isEnabled) {
            throw new Error("NFC is not enabled");
         }

         setNfcState((prev) => ({
            ...prev,
            isSupported,
            isEnabled,
            isLoading: false
         }));
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to load NFC module");
         setNfcState((prev) => ({ ...prev, isLoading: false }));
      }
   }, []);

   const readNFC = React.useCallback(async () => {
      try {
         await NfcManager.requestTechnology(NfcTech.Ndef);
         setNfcState((prev) => ({ ...prev, isScanning: true }));

         const tag = await NfcManager.getTag();
         setTag(tag?.id ?? null);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to read NFC tag");
      } finally {
         await NfcManager.cancelTechnologyRequest();
         setNfcState((prev) => ({ ...prev, isScanning: false }));
      }
   }, []);

   React.useEffect(() => {
      checkNFC();
      return () => {
         NfcManager.cancelTechnologyRequest();
      };
   }, [checkNFC]);

   React.useEffect(() => {
      if (open && nfcState.isEnabled && !nfcState.isScanning) {
         readNFC();
      }
   }, [open, nfcState.isEnabled, nfcState.isScanning, readNFC]);

   console.log(nfcState);

   return (
      <Dialog open={open} onOpenChange={onOpenChange} className="!w-full !max-w-none">
         <DialogContent className="sm:max-w-[425px] !w-full !max-w-none sm:w-full rounded-3xl py-6">
            <RFID />
            <DialogHeader className="gap-y-3">
               <DialogTitle className="text-center native:text-2xl">
                  {nfcState.isScanning ? "Scanning..." : "Tap to Scan"}
               </DialogTitle>
               <DialogDescription className="text-center native:text-xl">
                  {error || "Hold your phone near your pet's RFID tag to scan."}
               </DialogDescription>

               <View className="relative border-b border-border w-full my-4">
                  <Text className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-2 bg-white text-muted-foreground">
                     OR
                  </Text>
               </View>

               <DialogFooter>
                  <Link href="/new-pet" asChild>
                     <Button
                        onPress={() => onOpenChange(false)}
                        className="bg-sky-100 py-4 px-8 rounded-full"
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

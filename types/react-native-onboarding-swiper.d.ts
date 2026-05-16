declare module "react-native-onboarding-swiper" {
   import type { ComponentType } from "react";
   import type { StyleProp, TextStyle, ViewStyle } from "react-native";

   type OnboardingButtonProps = {
      onPress?: () => void;
   };

   type OnboardingPage = {
      backgroundColor: string;
      image: React.ReactNode;
      title: string;
      subtitle: string;
      titleStyles?: StyleProp<TextStyle>;
      subTitleStyles?: StyleProp<TextStyle>;
   };

   type OnboardingProps = {
      pages: OnboardingPage[];
      onSkip?: () => void;
      onDone?: () => void;
      showSkip?: boolean;
      bottomBarHighlight?: boolean;
      pageIndexCallback?: (index: number) => void;
      SkipButtonComponent?: ComponentType<OnboardingButtonProps>;
      NextButtonComponent?: ComponentType<OnboardingButtonProps>;
      DoneButtonComponent?: ComponentType<OnboardingButtonProps>;
   };

   const Onboarding: ComponentType<OnboardingProps>;
   export default Onboarding;
}

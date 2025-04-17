import React from "react";
import { cn } from "@/lib/utils";
import Svg, { Path, SvgProps } from "react-native-svg";

interface NotificationProps extends Omit<SvgProps, "children"> {
   size: number;
   filled?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ size, className, filled, ...props }) => {
   return (
      <Svg
         viewBox="0 0 24 24"
         width={size}
         height={size}
         {...props}
         className={cn("w-4 h-4 flex-shrink-0 fill-current stroke-current", className)}
      >
         <Path d="m22.137 15.14-1.09-1.09a1.09 1.09 0 0 1-.327-.775V8.73a8.72 8.72 0 0 0-17.44 0v4.545a1.09 1.09 0 0 1-.327.774l-1.09 1.09a2.681 2.681 0 0 0-.763 1.864 2.627 2.627 0 0 0 2.627 2.627H7.64a4.36 4.36 0 0 0 8.72 0h3.913a2.627 2.627 0 0 0 2.627-2.627 2.681 2.681 0 0 0-.763-1.864zM12 21.81a2.18 2.18 0 0 1-2.18-2.18h4.36A2.18 2.18 0 0 1 12 21.81zm8.273-4.36H3.727a.447.447 0 0 1-.447-.447.414.414 0 0 1 .13-.316l1.09-1.09a3.27 3.27 0 0 0 .96-2.322V8.73a6.54 6.54 0 0 1 13.08 0v4.545a3.27 3.27 0 0 0 .96 2.322l1.09 1.09a.414.414 0 0 1 .13.316.447.447 0 0 1-.447.447z" />
      </Svg>
   );
};

export default Notification;

import * as React from "react";
import { cn } from "@/lib/utils";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BowlProps extends Omit<SvgProps, "children"> {
   size: number;
}

const Bowl: React.FC<BowlProps> = ({ size, className, ...props }) => {
   return (
      <Svg
         viewBox="0 0 512 512"
         width={size}
         height={size}
         className={cn("relative w-4 h-4 flex-shrink-0 fill-current stroke-current", className)}
         {...props}
      >
         <Path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M11.36 136.4h489.438c5.837 0 10.608 4.699 10.385 10.53-3.335 86.783-57.552 179.623-135.511 232.413a10.443 10.443 0 01-5.855 1.777h-227.73a10.4 10.4 0 01-5.78-1.73C59.201 328.016 5.866 233.82.972 147.132.64 141.224 5.443 136.4 11.36 136.4zm127.576 255.36a10.64 10.64 0 00-10.64 10.64v31.92c0 11.753 9.526 21.28 21.28 21.28h212.8c11.753 0 21.28-9.527 21.28-21.28V402.4a10.64 10.64 0 00-10.64-10.64z"
         />
      </Svg>
   );
};

export default Bowl;

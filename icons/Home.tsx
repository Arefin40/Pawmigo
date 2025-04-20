import React from "react";
import { cn } from "@/lib/utils";
import Svg, { Path, SvgProps } from "react-native-svg";

interface HomeProps extends Omit<SvgProps, "children"> {
   size: number;
   filled?: boolean;
}

const Home: React.FC<HomeProps> = ({ size, className, filled, ...props }) => {
   return (
      <Svg
         viewBox="0 0 24 24"
         width={size}
         height={size}
         {...props}
         className={cn("relative w-4 h-4 flex-shrink-0 fill-current stroke-current", className)}
      >
         {filled ? (
            <Path d="M22.175 6.694 15.712 1.35a5.777 5.777 0 0 0-7.424 0L1.825 6.694C.661 7.657 0 9.116 0 10.639v8.334C0 21.68 2.08 24 4.8 24h2.4a2.4 2.4 0 0 0 2.4-2.4v-3.902c0-1.522 1.142-2.628 2.4-2.628s2.4 1.106 2.4 2.628V21.6a2.4 2.4 0 0 0 2.4 2.4h2.4c2.72 0 4.8-2.32 4.8-5.028v-8.333c0-1.523-.66-2.982-1.825-3.945z" />
         ) : (
            <Path d="M14.183 3.2a3.378 3.378 0 0 0-4.366 0L3.354 8.543C2.766 9.031 2.4 9.8 2.4 10.639v8.334c0 1.52 1.142 2.627 2.4 2.627h2.4v-3.902c0-2.706 2.08-5.028 4.8-5.028s4.8 2.322 4.8 5.028V21.6h2.4c1.258 0 2.4-1.106 2.4-2.628v-8.333c0-.839-.365-1.608-.954-2.095zm1.529-1.85 6.463 5.344C23.339 7.657 24 9.116 24 10.639v8.334C24 21.68 21.92 24 19.2 24h-2.4a2.4 2.4 0 0 1-2.4-2.4v-3.902c0-1.522-1.142-2.628-2.4-2.628s-2.4 1.106-2.4 2.628V21.6A2.4 2.4 0 0 1 7.2 24H4.8C2.08 24 0 21.68 0 18.972v-8.333c0-1.523.66-2.982 1.825-3.945L8.288 1.35a5.777 5.777 0 0 1 7.424 0z" />
         )}
      </Svg>
   );
};

export default Home;

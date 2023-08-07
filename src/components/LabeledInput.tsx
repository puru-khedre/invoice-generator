import { Label } from "@radix-ui/react-label";
import { LucideIcon } from "lucide-react";
import { FC, ReactNode } from "react";

interface LabeledInputProps {
  className?: string;
  Icon: LucideIcon;
  children: ReactNode;
  isIconLeft?: boolean;
  labelFor: string;
}
const LabeledInput: FC<LabeledInputProps> = ({
  className = "",
  Icon,
  children,
  isIconLeft = false,
  labelFor,
}) => {
  // w-1/2 flex flex-row items-center bg-gray-300 rounded-md border border-gray-500 print:hidden
  return (
    <div
      className={`flex flex-row items-center bg-gray-300 rounded-md border border-gray-500 ${className}`}
    >
      {!isIconLeft && children}
      <Label htmlFor={labelFor}>
        <Icon className="mx-2" />
      </Label>
      {isIconLeft && children}
    </div>
  );
};

export default LabeledInput;

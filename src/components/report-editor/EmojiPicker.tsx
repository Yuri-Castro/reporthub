import React, { useState } from "react";
import EmojiPickerReact from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiObject: any) => {
    onChange(emojiObject.emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-10 w-20 justify-center ${className}`}
        >
          {value ? (
            <span className="text-lg">{value}</span>
          ) : (
            <Smile className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <EmojiPickerReact
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={false}
          searchPlaceholder="Search emoji..."
          width={300}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};

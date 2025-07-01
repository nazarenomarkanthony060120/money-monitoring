import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

interface HapticTabProps {
  children: React.ReactNode;
  onPress?: () => void;
  [key: string]: any;
}

export function HapticTab({ children, onPress, ...props }: HapticTabProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
}

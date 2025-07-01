import { View } from "react-native";
import { BlurView } from "expo-blur";

interface TabBarBackgroundProps {
  children: React.ReactNode;
}

export default function TabBarBackground({ children }: TabBarBackgroundProps) {
  return (
    <BlurView intensity={80} tint="light" style={{ flex: 1 }}>
      {children}
    </BlurView>
  );
}

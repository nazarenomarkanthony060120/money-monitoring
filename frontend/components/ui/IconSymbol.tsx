import { Text } from "react-native";

interface IconSymbolProps {
  name: string;
  size: number;
  color: string;
}

export function IconSymbol({ name, size, color }: IconSymbolProps) {
  // Simple icon mapping - in a real app you'd use a proper icon library
  const iconMap: { [key: string]: string } = {
    house: "🏠",
    "house.fill": "🏠",
    "chart.bar": "📊",
    "chart.bar.fill": "📊",
    person: "👤",
    "person.fill": "👤",
  };

  const icon = iconMap[name] || "📱";

  return <Text style={{ fontSize: size, color }}>{icon}</Text>;
}

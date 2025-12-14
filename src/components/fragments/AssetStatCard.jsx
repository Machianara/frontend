import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const AssetStatCard = ({
  icon,
  title,
  value,
  label,
  delta,
  colorScheme,
}) => {
  return (
    <Card className={`rounded-2xl  border-none ${colorScheme.bg}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div
          className={`h-12 w-12 rounded-full ${colorScheme.iconBg} flex items-center justify-center`}
        >
          {React.cloneElement(icon, {
            className: `h-6 w-6 ${colorScheme.text}`,
          })}
        </div>
        <CardTitle className={`text-md font-medium ${colorScheme.text}`}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-sm text-gray-700">{label}</p>
        <p className="text-xs text-blue-600 mt-2">{delta}</p>
      </CardContent>
    </Card>
  );
};

import * as React from "react";
import { routes, useRoute } from "@/routes";
import { Button } from "@/common/Button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Props {}

export const AppHeader: React.FC<Props> = ({}) => {
  const route = useRoute();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-[var(--color-border)] shadow-sm">
      <div className="flex items-center">
        {route.name === "image" ? (
          <Button
            variant="secondary"
            className="rounded-full shadow text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => routes.dashboard().push()}
            aria-label="返回"
          >
            <span className="text-xl mr-1">←</span> 返回
          </Button>
        ) : route.name === "settings" ? (
          <Button
            variant="secondary"
            className="rounded-full shadow text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => routes.dashboard().push()}
            aria-label="返回仪表盘"
          >
            <span className="text-xl mr-1">←</span> 返回
          </Button>
        ) : (
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto max-w-[180px]"
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        {route.name === "dashboard" && (
          <button
            onClick={() => routes.settings().push()}
            className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-white font-semibold text-sm hover:bg-blue-300 hover:shadow-lg hover:scale-105 transition-all duration-200"
            aria-label="用户设置"
          >
            👤
          </button>
        )}
      </div>
    </header>
  );
};

import { Link } from "react-router-dom";
import { Bell, UserPlus, MessageSquare, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications, useNotificationCount, NotificationItem } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

const typeIcon: Record<string, typeof UserPlus> = {
  connection_request: UserPlus,
  unread_message: MessageSquare,
  booking_update: CalendarCheck,
};

const typeColor: Record<string, string> = {
  connection_request: "text-neon",
  unread_message: "text-blue-400",
  booking_update: "text-amber-400",
};

const NotificationRow = ({ item }: { item: NotificationItem }) => {
  const Icon = typeIcon[item.type] || Bell;
  const color = typeColor[item.type] || "text-muted-foreground";

  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link to={item.link} className="flex items-start gap-3 py-3 px-3">
        <div className={`mt-0.5 flex-shrink-0 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">{item.title}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: sv })}
          </p>
        </div>
      </Link>
    </DropdownMenuItem>
  );
};

const NotificationBell = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const { total } = useNotificationCount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {total > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-neon px-1 text-[10px] font-bold text-neon-foreground">
              {total > 9 ? "9+" : total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[420px] overflow-y-auto">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="font-display text-sm font-semibold text-foreground">Notifikationer</h3>
        </div>
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Laddar...</div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Inga notifikationer</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 15).map((item, i) => (
              <div key={item.id}>
                <NotificationRow item={item} />
                {i < Math.min(notifications.length, 15) - 1 && <DropdownMenuSeparator className="my-0" />}
              </div>
            ))}
            {notifications.length > 15 && (
              <div className="px-3 py-2 text-center border-t border-border">
                <Link to="/connections" className="text-xs text-neon hover:underline">
                  Visa alla
                </Link>
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

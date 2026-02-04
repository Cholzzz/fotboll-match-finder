import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isSameDay, startOfDay, parse, isAfter, isBefore } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  availableDays?: string[];
  availableHoursStart?: string;
  availableHoursEnd?: string;
  sessionDuration?: number;
  bookedSlots?: { date: string; startTime: string }[];
  onSelectSlot?: (date: Date, time: string) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

const dayNameMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const generateTimeSlots = (
  startHour: string,
  endHour: string,
  duration: number,
  bookedTimes: string[]
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const start = parse(startHour, "HH:mm", new Date());
  const end = parse(endHour, "HH:mm", new Date());
  
  let current = start;
  while (isBefore(current, end)) {
    const timeString = format(current, "HH:mm");
    slots.push({
      time: timeString,
      available: !bookedTimes.includes(timeString),
    });
    current = new Date(current.getTime() + duration * 60000);
  }
  
  return slots;
};

const BookingCalendar = ({
  availableDays = ["monday", "tuesday", "wednesday", "thursday", "friday"],
  availableHoursStart = "09:00",
  availableHoursEnd = "17:00",
  sessionDuration = 60,
  bookedSlots = [],
  onSelectSlot,
  selectedDate: controlledDate,
  selectedTime: controlledTime,
}: BookingCalendarProps) => {
  const [internalDate, setInternalDate] = useState<Date | undefined>(undefined);
  const [internalTime, setInternalTime] = useState<string | null>(null);
  
  const selectedDate = controlledDate !== undefined ? controlledDate : internalDate;
  const selectedTime = controlledTime !== undefined ? controlledTime : internalTime;
  
  const setSelectedDate = (date: Date | undefined) => {
    if (controlledDate === undefined) {
      setInternalDate(date);
    }
  };
  
  const setSelectedTime = (time: string | null) => {
    if (controlledTime === undefined) {
      setInternalTime(time);
    }
  };

  // Get available day numbers
  const availableDayNumbers = useMemo(() => 
    availableDays.map(day => dayNameMap[day.toLowerCase()]),
    [availableDays]
  );

  // Disable dates that are not in available days or are in the past
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    const dayOfWeek = date.getDay();
    return isBefore(date, today) || !availableDayNumbers.includes(dayOfWeek);
  };

  // Get booked times for selected date
  const bookedTimesForDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = format(selectedDate, "yyyy-MM-dd");
    return bookedSlots
      .filter(slot => slot.date === dateString)
      .map(slot => slot.startTime);
  }, [selectedDate, bookedSlots]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(
      availableHoursStart,
      availableHoursEnd,
      sessionDuration,
      bookedTimesForDate
    );
  }, [selectedDate, availableHoursStart, availableHoursEnd, sessionDuration, bookedTimesForDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && onSelectSlot) {
      onSelectSlot(selectedDate, time);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateSelect}
          locale={sv}
          disabled={disabledDays}
          className="w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-lg border border-border hover:bg-muted",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-full text-center text-sm p-0 relative",
            day: "h-9 w-9 p-0 font-normal mx-auto rounded-lg hover:bg-neon/10 hover:text-neon transition-colors aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-neon text-neon-foreground hover:bg-neon hover:text-neon-foreground focus:bg-neon focus:text-neon-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "day-outside text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-neon" />
            <h4 className="font-medium text-foreground">
              Tillgängliga tider - {format(selectedDate, "d MMMM", { locale: sv })}
            </h4>
          </div>

          {timeSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Inga tillgängliga tider denna dag
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-all",
                    slot.available
                      ? selectedTime === slot.time
                        ? "bg-neon text-neon-foreground"
                        : "bg-muted hover:bg-neon/10 hover:text-neon text-foreground"
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed line-through"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <div className="rounded-xl border border-neon/30 bg-neon/5 p-4">
          <div className="flex items-center gap-2 text-neon mb-2">
            <Check className="h-4 w-4" />
            <span className="font-medium">Vald tid</span>
          </div>
          <p className="text-foreground">
            {format(selectedDate, "EEEE d MMMM", { locale: sv })} kl. {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;

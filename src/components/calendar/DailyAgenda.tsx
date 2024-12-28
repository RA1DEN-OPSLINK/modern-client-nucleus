import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean;
}

interface DailyAgendaProps {
  selectedDate: Date | null;
  events: Event[];
}

export function DailyAgenda({ selectedDate, events }: DailyAgendaProps) {
  const getDailyAgenda = () => {
    if (!selectedDate) return [];
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return events.filter((event: Event) => 
      event.start_time.startsWith(selectedDateStr)
    ).sort((a: Event, b: Event) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDate 
            ? `Agenda for ${format(selectedDate, 'MMMM d, yyyy')}`
            : 'Daily Agenda'
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedDate ? (
            getDailyAgenda().length > 0 ? (
              getDailyAgenda().map((event: Event) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start_time), 'h:mm a')} - 
                    {format(new Date(event.end_time), 'h:mm a')}
                  </p>
                  {event.description && (
                    <p className="mt-2 text-sm">{event.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No events scheduled for this day</p>
            )
          ) : (
            <p className="text-muted-foreground">Select a date to view agenda</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
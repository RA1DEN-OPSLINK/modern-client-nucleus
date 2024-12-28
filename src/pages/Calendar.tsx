import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useToast } from "@/components/ui/use-toast";

export default function Calendar() {
  const { toast } = useToast();

  const handleDateClick = (arg: any) => {
    toast({
      title: "Date clicked",
      description: `You clicked on: ${arg.dateStr}`,
    });
  };

  const handleEventClick = (arg: any) => {
    toast({
      title: "Event clicked",
      description: `You clicked on: ${arg.event.title}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your schedule and appointments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[800px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              events={[
                // Example events - you can replace these with your own data
                {
                  title: 'Example Event',
                  start: new Date(),
                  allDay: true
                }
              ]}
              height="100%"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
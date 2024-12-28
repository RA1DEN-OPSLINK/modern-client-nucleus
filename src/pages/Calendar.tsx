import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean;
}

interface NewEvent {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
}

export default function Calendar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    all_day: false,
  });

  // Fetch events
  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (event: NewEvent) => {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setIsCreateEventOpen(false);
      setNewEvent({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        all_day: false,
      });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setNewEvent(prev => ({
      ...prev,
      start_time: `${arg.dateStr}T09:00:00`,
      end_time: `${arg.dateStr}T17:00:00`,
    }));
    setIsCreateEventOpen(true);
  };

  const handleEventClick = (arg: any) => {
    toast({
      title: arg.event.title,
      description: arg.event.extendedProps.description || "No description provided",
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate(newEvent);
  };

  // Filter events for the selected date
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your schedule and appointments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
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
                events={events.map((event: Event) => ({
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  start: event.start_time,
                  end: event.end_time,
                  allDay: event.all_day,
                }))}
                height="100%"
              />
            </div>
          </CardContent>
        </Card>

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
      </div>

      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_time" className="text-sm font-medium">Start Time</label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end_time" className="text-sm font-medium">End Time</label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventDialog } from "@/components/calendar/EventDialog";
import { DailyAgenda } from "@/components/calendar/DailyAgenda";

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
  organization_id: string;
}

export default function Calendar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [currentEvent, setCurrentEvent] = useState<NewEvent>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    all_day: false,
    organization_id: "", // Will be set when creating/editing the event
  });

  // Fetch organization_id
  const { data: orgData } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_org_id');
      if (error) throw error;
      return { organization_id: data };
    },
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
      setIsEventDialogOpen(false);
      resetEventForm();
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

  // Update event mutation
  const updateEvent = useMutation({
    mutationFn: async (event: NewEvent & { id: string }) => {
      const { id, ...eventData } = event;
      const { data, error } = await supabase
        .from('calendar_events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setIsEventDialogOpen(false);
      resetEventForm();
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update event: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setCurrentEvent(prev => ({
      ...prev,
      start_time: `${arg.dateStr}T09:00:00`,
      end_time: `${arg.dateStr}T17:00:00`,
    }));
    setDialogMode('create');
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (arg: any) => {
    const event = events.find((e: Event) => e.id === arg.event.id);
    if (event) {
      setCurrentEvent({
        ...event,
        organization_id: orgData?.organization_id || '',
      });
      setDialogMode('edit');
      setIsEventDialogOpen(true);
    }
  };

  const resetEventForm = () => {
    setCurrentEvent({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      all_day: false,
      organization_id: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgData?.organization_id) {
      toast({
        title: "Error",
        description: "Organization ID not found",
        variant: "destructive",
      });
      return;
    }

    const eventWithOrgId = {
      ...currentEvent,
      organization_id: orgData.organization_id,
    };

    if (dialogMode === 'create') {
      createEvent.mutate(eventWithOrgId);
    } else {
      updateEvent.mutate(eventWithOrgId as NewEvent & { id: string });
    }
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

        <DailyAgenda selectedDate={selectedDate} events={events} />
      </div>

      <EventDialog
        isOpen={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        event={currentEvent}
        setEvent={setCurrentEvent}
        onSubmit={handleSubmit}
        mode={dialogMode}
      />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
  };
  setNewEvent: (event: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EventDialog({ 
  isOpen, 
  onOpenChange, 
  newEvent, 
  setNewEvent, 
  onSubmit 
}: EventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
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
  );
}
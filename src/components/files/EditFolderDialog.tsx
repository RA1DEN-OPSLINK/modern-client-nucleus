import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditFolder: (id: string, name: string) => void;
  folder: { id: string; name: string } | null;
}

export function EditFolderDialog({ 
  open, 
  onOpenChange, 
  onEditFolder,
  folder 
}: EditFolderDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  const handleSubmit = () => {
    if (name.trim() && folder) {
      onEditFolder(folder.id, name);
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
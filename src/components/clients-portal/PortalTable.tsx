import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClientsPortalData } from "./types";

interface PortalTableProps {
  portals: ClientsPortalData[] | null;
}

export function PortalTable({ portals }: PortalTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {portals?.map((portal) => (
          <TableRow key={portal.id}>
            <TableCell className="font-medium">{portal.name}</TableCell>
            <TableCell>{portal.description}</TableCell>
            <TableCell>
              <Badge variant={portal.status === "active" ? "default" : "secondary"}>
                {portal.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(portal.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
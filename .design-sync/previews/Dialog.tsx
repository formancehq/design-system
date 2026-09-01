import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@formance/design-system';

export function Closed() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete ledger</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function Open() {
  return (
    <div className="h-80 w-full">
      <Dialog defaultOpen modal={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete ledger</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The transaction log for
              sandbox-eu-west will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

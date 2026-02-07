import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ConfirmModalProps {
  open: boolean;
  text: string;

  onConfirm: () => void;
  onCancel: () => void;
  //   loading?: boolean;
}

const CustomConfirmModal = ({
  open,
  text,

  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onCancel();
      }}
    >
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-[400px]"
      >
        <DialogHeader>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomConfirmModal;

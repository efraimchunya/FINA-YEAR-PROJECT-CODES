import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";

export default function TourFormModal({ open, onClose, onSubmit, defaultValues }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: "",
    },
  });

  const handleFormSubmit = (values) => {
    onSubmit({ ...defaultValues, ...values });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description", { required: true })} />
          </div>
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { required: true, valueAsNumber: true })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalStore } from "@/context/GlobalContext";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { createBond } from "../_actions/actions";

export default function AddBondButton() {
  const { clientUser } = useGlobalStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const userId = clientUser && clientUser!.id;

      if (!userId) return;

      if (!name || !description) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const response = await createBond({
        name,
        description,
        userId,
      });

      setLoading(false);

      if (response.success && response.data) {
        toast.success("Bond created successfully");
        setOpen(false);
      }
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
      toast.error(error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}>
          <Plus className="h-4 w-4" />
          Create Bond
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bond</DialogTitle>
          <DialogDescription>
            Tell us about your new bond before we create it for you.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              placeholder="Chillar Party"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="Friends of batch '26"
              onChange={(e) => setDescription(e.target.value)}
              className="max-h-[300px]"
            />
          </div>

          <Button className="mt-2 w-full" type={"submit"} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

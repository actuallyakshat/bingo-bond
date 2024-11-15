"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStore } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../_components/Header";
import { updateUser } from "./_actions/actions";

export default function Profile() {
  const { clientUser } = useGlobalStore();

  const [name, setName] = useState(clientUser?.name || "");
  const [emailPreferences, setEmailPreferences] = useState<boolean>(
    clientUser?.emailPreferences || false
  );
  const [loading, setLoading] = useState(false);
  const [allowSave, setAllowSave] = useState(false);

  useEffect(() => {
    if (
      name !== clientUser?.name ||
      emailPreferences !== clientUser?.emailPreferences
    ) {
      setAllowSave(true);
    } else {
      setAllowSave(false);
    }
  }, [name, clientUser, emailPreferences]);

  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await updateUser({
        userId: clientUser!.id,
        name,
        emailPreferences,
      });

      setLoading(false);
      if (response.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  if (!clientUser) return null;

  return (
    <div>
      <Header headerTitle="Profile" />
      <div className="px-10 pt-3">
        <h2 className="font-bold text-2xl">Edit your profile</h2>
        <p className="test-sm text-muted-foreground">
          Update your profile details here.
        </p>
        <form
          className="max-w-md mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              defaultValue={clientUser?.name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              placeholder="Enter your email"
              disabled
              className="cursor-not-allowed"
              defaultValue={clientUser?.email}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 my-2">
              <Checkbox
                name="emailPreferences"
                onCheckedChange={(value) => setEmailPreferences(!!value)}
                defaultChecked={clientUser.emailPreferences}
              />
              <p className="text-[0.8rem]">
                I prefer to receive email reminders a day before my upcoming
                plan
              </p>
            </div>
          </div>
          <Button type="submit" disabled={loading || !allowSave}>
            {loading ? "Saving" : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { saveImageToDB } from "../_actions/actions";
import { Button } from "@/components/ui/button";

export default function FileUploadButton({ memoryId }: { memoryId: string }) {
  return (
    <div>
      <CldUploadWidget
        options={{
          sources: ["local", "url"],
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
        }}
        uploadPreset="bingo-bond"
        onSuccess={async (result: CloudinaryUploadWidgetResults) => {
          const info = result.info;
          if (typeof info !== "string" && info!.secure_url) {
            await saveImageToDB({
              memoryId: memoryId,
              url: info!.secure_url,
            });
          } else {
            console.error("Secure URL not available in the response");
          }
        }}
      >
        {({ open }) => (
          <Button variant={"link"} onClick={() => open()}>
            Upload
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}

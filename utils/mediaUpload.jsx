import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  "https://guaxykwlwvybejqayzfg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXh5a3dsd3Z5YmVqcWF5emZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3OTMsImV4cCI6MjA2OTk5Mjc5M30.29sck266mcjaHW8OeJeGgbWcOVl88yu6CiF687Odi3k"
);
export default function mediaUpload(file){

    const promise = new Promise((resolve, reject) => {
        if(file == null){
            reject("no file selected");
        }
        const timeStamp = new Date().getTime();
        const fileName = timeStamp + file.name;

        supabase.storage.from("images").upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        }).then(() => {
            const imageUrl = supabase.storage.from("images").getPublicUrl(fileName);
            console.log("Image URL:", imageUrl.data.publicUrl);
            resolve(imageUrl.data.publicUrl);
        }).catch((error) => {
            console.error("Error uploading file:", error);
            reject("Failed to upload file. Please try again.");
        });
    });
    return promise;
}


 
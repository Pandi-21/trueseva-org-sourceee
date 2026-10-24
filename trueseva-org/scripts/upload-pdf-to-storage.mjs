import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL || "https://lhzypkmjiueudnfevzbq.supabase.co";
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_6Vu1YUPG2nFY829d1bYJSg_3tUjFUYT";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets, "Error:", error);

  if (buckets && buckets.length > 0) {
    const bucketName = buckets[0].name;
    const fileBuffer = fs.readFileSync(path.resolve("public/TrueSeva_Sample_Receipt.pdf"));
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from(bucketName)
      .upload("TrueSeva_Official_Receipt.pdf", fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    console.log("Upload result:", uploadData, "Upload error:", uploadErr);
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl("TrueSeva_Official_Receipt.pdf");

    console.log("PUBLIC PDF URL:", publicUrlData?.publicUrl);
  }
}

testStorage().catch(console.error);

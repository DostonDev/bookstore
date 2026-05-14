const { createClient } = require("@supabase/supabase-js");
const config = require("../config");

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
const BUCKET = config.supabase.bucketName;

async function uploadFile(fileBuffer, originalName, folder = "pdfs") {
  const ext = originalName.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, {
      contentType: folder === "pdfs" ? "application/pdf" : "image/*",
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload xatosi: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, path: fileName };
}

async function deleteFile(filePath) {
  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
  if (error) throw new Error(`Supabase delete xatosi: ${error.message}`);
}

async function createSignedUrl(filePath, expiresIn = 60) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, expiresIn);
  if (error) throw new Error(`Signed URL xatosi: ${error.message}`);
  return data.signedUrl;
}

module.exports = { supabase, uploadFile, deleteFile, createSignedUrl, BUCKET };

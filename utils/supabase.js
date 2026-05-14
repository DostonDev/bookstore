const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = process.env.SUPABASE_BUCKET_NAME || "pdf-books";

/**
 * PDF faylni Supabase Storage ga yuklaydi
 * @param {Buffer} fileBuffer - Fayl buffer
 * @param {string} originalName - Asl fayl nomi
 * @param {string} folder - "pdfs" | "covers"
 * @returns {{ url: string, path: string }}
 */
async function uploadFile(fileBuffer, originalName, folder = "pdfs") {
  const ext = originalName.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

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

/**
 * Supabase Storage dan faylni o'chiradi
 * @param {string} filePath - Bucket ichidagi fayl yo'li
 */
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

module.exports = { supabase, uploadFile, deleteFile, createSignedUrl };

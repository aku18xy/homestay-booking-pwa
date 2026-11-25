/**
 * JADI HOMESTAY - GOOGLE APPS SCRIPT WEBHOOK SYNC
 * 
 * CARA PEMASANGAN (HANYA 1 MINIT):
 * 1. Buka Google Sheet: https://docs.google.com/spreadsheets/d/1EEwLFpLNMxGuqbcXj5hl5-fSb82oecSfZ9uj6DceIAk/edit
 * 2. Pada menu atas, klik Extensions > Apps Script.
 * 3. Padam sebarang kod lama dan tampal keseluruhan kod di bawah ini.
 * 4. Klik ikon Save (Disket).
 * 5. Klik butang biru "Deploy" di penjuru kanan atas > "New deployment".
 * 6. Pilih Jenis (Select type): "Web app".
 *    - Description: "JADI Homestay Webhook"
 *    - Execute as: "Me (akaun anda)"
 *    - Who has access: "Anyone" (Penting supaya sistem web boleh hantar data).
 * 7. Klik "Deploy", luluskan kebenaran (Authorize Access jika diminta), dan salin URL Web App yang tertera (bermula dengan https://script.google.com/macros/s/...).
 * 8. Tampal URL tersebut di Portal Pemilik JADI Homestay (/admin) di bawah tab "Tetapan DuitNow & Bank".
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var timestamp = Utilities.formatDate(new Date(), "Asia/Kuala_Lumpur", "M/d/yyyy HH:mm:ss");

    // Susunan baris lajur tepat mengikut Google Sheet JADI Homestay:
    // Kolum A: Timestamp
    // Kolum B: Email Address
    // Kolum C: Nama penuh seperti dalam kad pengenalan:
    // Kolum D: Nombor kad pengenalan (tanpa tanda -):
    // Kolum E: Nombor telefon:
    // Kolum F: Email:
    // Kolum G: Alamat penuh:
    // Kolum H: Tarikh daftar masuk (check in):
    // Kolum I: Tarikh daftar keluar (check out):
    // Kolum J: Jumlah orang yang bakal menginap:
    // Kolum K: Tujuan menginap di Jadi Homestay:
    // Kolum L: Sila muat naik gambar kad pengenalan penyewa:
    // Kolum M: Sila muat naik resit bayaran deposit Jadi Homestay:
    // Kolum N: Nyatakan nombor akaun bank, nama dan bank untuk pemulangan deposit:
    // Kolum O: Sila pastikan semua senarai semak tempahan telah dipenuhi:
    // Kolum P: Unit Homestay & Kod Tempahan:

    var checklistText = "Saya telah membuat bayaran deposit dan memuat naik salinan resit seperti diminta, Saya telah mengisi butiran yang diperlukan di dalam borang di atas dengan maklumat yang betul, Saya telah membaca, memahami dan bersetuju dengan syarat-syarat dan terma yang dinyatakan untuk menginap di Jadi Homestay";

    var newRow = [
      timestamp,
      data.guest_email || "",
      data.guest_name || "",
      data.ic_number || "",
      data.guest_phone || "",
      data.guest_email || "",
      data.guest_address || "",
      data.check_in || "",
      data.check_out || "",
      data.guest_count || "",
      data.stay_purpose || "Majlis Keraian/Kenduri",
      data.ic_image_url || "",
      data.payment_receipt_url || "",
      data.refund_bank_info || "",
      checklistText,
      (data.unit_name || "") + " (" + (data.booking_code || "") + ")"
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", row: sheet.getLastRow() })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("JADI Homestay Webhook Service is Active & Running.");
}

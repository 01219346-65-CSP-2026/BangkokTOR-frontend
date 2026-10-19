import type { Locale } from "@/i18n/Translations";

// Bangkok's 50 เขต by BMA district code — the same table as the backend's
// lib/geo/bangkokDistricts.ts. The code is the only thing that joins the
// insights' byDistrict to the boundary file (src/data/bangkokKhet.json); names
// here are for display.

const KHET: Record<string, { th: string; en: string }> = {
  "01": { th: "พระนคร", en: "Phra Nakhon" },
  "02": { th: "ดุสิต", en: "Dusit" },
  "03": { th: "หนองจอก", en: "Nong Chok" },
  "04": { th: "บางรัก", en: "Bang Rak" },
  "05": { th: "บางเขน", en: "Bang Khen" },
  "06": { th: "บางกะปิ", en: "Bang Kapi" },
  "07": { th: "ปทุมวัน", en: "Pathum Wan" },
  "08": { th: "ป้อมปราบศัตรูพ่าย", en: "Pom Prap Sattru Phai" },
  "09": { th: "พระโขนง", en: "Phra Khanong" },
  "10": { th: "มีนบุรี", en: "Min Buri" },
  "11": { th: "ลาดกระบัง", en: "Lat Krabang" },
  "12": { th: "ยานนาวา", en: "Yan Nawa" },
  "13": { th: "สัมพันธวงศ์", en: "Samphanthawong" },
  "14": { th: "พญาไท", en: "Phaya Thai" },
  "15": { th: "ธนบุรี", en: "Thon Buri" },
  "16": { th: "บางกอกใหญ่", en: "Bangkok Yai" },
  "17": { th: "ห้วยขวาง", en: "Huai Khwang" },
  "18": { th: "คลองสาน", en: "Khlong San" },
  "19": { th: "ตลิ่งชัน", en: "Taling Chan" },
  "20": { th: "บางกอกน้อย", en: "Bangkok Noi" },
  "21": { th: "บางขุนเทียน", en: "Bang Khun Thian" },
  "22": { th: "ภาษีเจริญ", en: "Phasi Charoen" },
  "23": { th: "หนองแขม", en: "Nong Khaem" },
  "24": { th: "ราษฎร์บูรณะ", en: "Rat Burana" },
  "25": { th: "บางพลัด", en: "Bang Phlat" },
  "26": { th: "ดินแดง", en: "Din Daeng" },
  "27": { th: "บึงกุ่ม", en: "Bueng Kum" },
  "28": { th: "สาทร", en: "Sathon" },
  "29": { th: "บางซื่อ", en: "Bang Sue" },
  "30": { th: "จตุจักร", en: "Chatuchak" },
  "31": { th: "บางคอแหลม", en: "Bang Kho Laem" },
  "32": { th: "ประเวศ", en: "Prawet" },
  "33": { th: "คลองเตย", en: "Khlong Toei" },
  "34": { th: "สวนหลวง", en: "Suan Luang" },
  "35": { th: "จอมทอง", en: "Chom Thong" },
  "36": { th: "ดอนเมือง", en: "Don Mueang" },
  "37": { th: "ราชเทวี", en: "Ratchathewi" },
  "38": { th: "ลาดพร้าว", en: "Lat Phrao" },
  "39": { th: "วัฒนา", en: "Watthana" },
  "40": { th: "บางแค", en: "Bang Khae" },
  "41": { th: "หลักสี่", en: "Lak Si" },
  "42": { th: "สายไหม", en: "Sai Mai" },
  "43": { th: "คันนายาว", en: "Khan Na Yao" },
  "44": { th: "สะพานสูง", en: "Saphan Sung" },
  "45": { th: "วังทองหลาง", en: "Wang Thonglang" },
  "46": { th: "คลองสามวา", en: "Khlong Sam Wa" },
  "47": { th: "บางนา", en: "Bang Na" },
  "48": { th: "ทวีวัฒนา", en: "Thawi Watthana" },
  "49": { th: "ทุ่งครุ", en: "Thung Khru" },
  "50": { th: "บางบอน", en: "Bang Bon" },
};

/** "เขตหลักสี่" / "Lak Si". An unknown code comes back as itself. */
export function khetName(code: string, locale: Locale): string {
  const khet = KHET[code];
  if (!khet) return code;
  return locale === "th" ? `เขต${khet.th}` : khet.en;
}

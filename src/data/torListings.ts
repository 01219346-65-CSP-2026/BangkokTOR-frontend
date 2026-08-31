import type { Tor } from "@/types/tor";

/**
 * Fifty real terms of reference scraped from egp2.bangkok.go.th, generated from
 * testTOR/data/manifest.jsonl. Thai free-text values (status, procurement method,
 * document kind) are mapped to id keys that `Translations.tsx` renders in either
 * locale; anything unrecognised upstream falls back rather than throwing.
 *
 * Static mock data for now — swap for a real TOR API once it exists. The backend
 * currently mounts only a health check and its TOR data model is undesigned, so
 * this file is the single seam where a fetch will replace an import.
 */
export const MOCK_TORS: Tor[] = [
  {
    "id": "3a9519e3-e92b-4f04-bc67-69409888973b",
    "projectNumber": "69089197783",
    "title": "ประกวดราคาซื้อครุภัณฑ์คอมพิวเตอร์ จำนวน ๒ รายการ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 9427000,
    "referencePrice": 9427000,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์คอมพิวเตอร์",
    "category": "it",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/3a9519e3-e92b-4f04-bc67-69409888973b",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-20T17:00:00Z",
        "filename": "รายละเอียดคุณลักษณะเฉพาะฯ_1787294045402.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/f86ba4b1-2f9e-4e01-97fd-8cf1de3dbded/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%AF_1787294045402.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-20T17:00:00Z",
        "filename": "ราคากลาง_1787294145624.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/049716a9-1a23-43d3-9df5-3acb8baec565/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1787294145624.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-20T17:00:00Z",
        "filename": "ร่างประกาศ-คอม_2_รายการ_1787294201273.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/152d3018-08ef-4ca9-8eb5-da00eb016164/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8-%E0%B8%84%E0%B8%AD%E0%B8%A1_2_%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3_1787294201273.pdf",
        "textLayer": "scanned",
        "pages": 15
      }
    ],
    "publishedAt": "2026-08-20T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "6cdd1858-d091-4c6c-85df-37dbfbae66e9",
    "projectNumber": "69089021558",
    "title": "จ้างเหมาทำกรงสุนัข",
    "agency": "สำนักอนามัย",
    "department": "สำนักงานสัตว์แพทย์สาธารณสุข",
    "budget": 1446000,
    "referencePrice": 1445356,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "วัสดุครุภัณฑ์อื่นๆ",
    "category": "equipment",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/6cdd1858-d091-4c6c-85df-37dbfbae66e9",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-08-19T17:00:00Z",
        "filename": "DOC200826-20082026080551_1787204093199.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/9d82f996-0221-4945-bd05-e0cdf5b99920/DOC200826-20082026080551_1787204093199.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-08-19T17:00:00Z",
        "filename": "DOC200826-20082026080533_1787205061204.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/a4ed1c2c-8197-4b3a-bc66-9a347b22a73b/DOC200826-20082026080533_1787205061204.pdf",
        "textLayer": "scanned",
        "pages": 7
      }
    ],
    "publishedAt": "2026-08-19T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "75bc17f8-5bef-450d-aeed-f3aef9f4dff4",
    "projectNumber": "69089258271",
    "title": "ประกวดราคาจ้างเหมาบริการตรวจวินิจฉัยผู้ป่วยด้วยเครื่องตรวจอวัยวะภายในด้วยสนามแม่เหล็กไฟฟ้า (MRI) ประจำปีงบประมาณ 2570 ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 35002000,
    "referencePrice": 35002000,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 14,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/75bc17f8-5bef-450d-aeed-f3aef9f4dff4",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ร่าง_TOR_MRI_2570_1787129757096.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/634f46bb-22b3-4b00-8046-8999d7b174a7/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87_TOR_MRI_2570_1787129757096.pdf",
        "textLayer": "scanned",
        "pages": 14
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ราคากลาง_MRI_2570_1787129805379.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/da96c9e8-a302-4f3d-9415-679b939b01c5/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_MRI_2570_1787129805379.pdf",
        "textLayer": "scanned",
        "pages": 11
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ร่างประกาศ_MRI_2570_-_19-8-69_1787129860628.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/27625faf-2801-412d-ae07-dc13edf529ed/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_MRI_2570_-_19-8-69_1787129860628.pdf",
        "textLayer": "scanned",
        "pages": 16
      }
    ],
    "publishedAt": "2026-08-18T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "16fe9d8d-6e6a-49e2-ad1a-08c7c196f7eb",
    "projectNumber": "69089257484",
    "title": "ประกวดราคาจ้างเหมาบริการแปลและรายงานผลภาพการตรวจด้วยเครื่องเอกซเรย์คอมพิวเตอร์ ประจำปีงบประมาณ 2570 ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 4630500,
    "referencePrice": 4630500,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 10,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/16fe9d8d-6e6a-49e2-ad1a-08c7c196f7eb",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ราคากลาง_งบประมาณ_2570_1787121943050.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/22e475d6-752c-437a-82d6-fad71e5f5afa/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%87%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%B2%E0%B8%93_2570_1787121943050.pdf",
        "textLayer": "scanned",
        "pages": 3
      },
      {
        "kind": "tor",
        "published": "2026-08-18T17:00:00Z",
        "filename": "TOR_งบประมาณ_2570_1787122008253.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/36ef4873-8728-4ccd-bd95-63a67eabb609/TOR_%E0%B8%87%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%B2%E0%B8%93_2570_1787122008253.pdf",
        "textLayer": "scanned",
        "pages": 10
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-18T17:00:00Z",
        "filename": "5._ร่างประกาศ_2570_1787122063960.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/6fb69c76-57be-40ae-ac58-8532fe3b1881/5._%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_2570_1787122063960.pdf",
        "textLayer": "scanned",
        "pages": 13
      }
    ],
    "publishedAt": "2026-08-18T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "325ae3f2-53fd-4170-824e-4aa50e7151a9",
    "projectNumber": "69079162301",
    "title": "ประกวดราคาซื้อตู้ให้ความอบอุ่นพร้อมระบบทำหัตถการสำหรับทารกแรกเกิดในภาวะวิกฤต จำนวน 2 เครื่อง ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 2400000,
    "referencePrice": 2400000,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/325ae3f2-53fd-4170-824e-4aa50e7151a9",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-18T17:00:00Z",
        "filename": "TOR_ตู้ให้ความอบอุ่นฯ_17_สค_69_1787113557359.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/b3f17a5d-aa65-4444-a03c-b6231842a562/TOR_%E0%B8%95%E0%B8%B9%E0%B9%89%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%AF_17_%E0%B8%AA%E0%B8%84_69_1787113557359.pdf",
        "textLayer": "scanned",
        "pages": 7
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ราคากลาง_ตู้ให้ความอบอุ่น_17-8-69_1787113610530.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/3537c79b-6194-4ea8-b4ef-b4123e37fd1d/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%95%E0%B8%B9%E0%B9%89%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_17-8-69_1787113610530.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ร่างประกาศ_ตู้ให้ความอบอุ่นฯ_1787113691851.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/da3e3b22-a6d0-483e-8896-96a83b478324/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B8%95%E0%B8%B9%E0%B9%89%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%AF_1787113691851.pdf",
        "textLayer": "scanned",
        "pages": 15
      }
    ],
    "publishedAt": "2026-08-18T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "b33b5545-92e4-4a91-8833-a48c405f003f",
    "projectNumber": "69079471348",
    "title": "ประกวดราคาจ้างเหมาบริการตรวจวินิจฉัยผู้ป่วยด้วยเครื่องตรวจอวัยวะภายในด้วยสนามแม่เหล็กไฟฟ้า (MRI) จำนวน 1 งาน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลตากสิน",
    "budget": 18829500,
    "referencePrice": 18829500,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/b33b5545-92e4-4a91-8833-a48c405f003f",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-08-17T17:00:00Z",
        "filename": "ราคากลาง_MRI_ปี_70_1787111437666.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/04365151-9ac0-4069-a4b5-61b01f558d9b/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_MRI_%E0%B8%9B%E0%B8%B5_70_1787111437666.pdf",
        "textLayer": "scanned",
        "pages": 6
      },
      {
        "kind": "tor",
        "published": "2026-08-17T17:00:00Z",
        "filename": "TOR_MRI_ปี_70_(เพิ่มร้อยละ_60)_1787111479147.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/51c4cfdc-dc31-487d-bd8f-b48b87d8add7/TOR_MRI_%E0%B8%9B%E0%B8%B5_70_%28%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B8%A5%E0%B8%B0_60%29_1787111479147.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-17T17:00:00Z",
        "filename": "ร่างประกาศ_จ้าง_MRI_ปี_70_1787112219762.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/96a0d69e-1c26-44dd-bb1e-f2e14dd793d2/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87_MRI_%E0%B8%9B%E0%B8%B5_70_1787112219762.pdf",
        "textLayer": "scanned",
        "pages": 16
      }
    ],
    "publishedAt": "2026-08-17T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "70c47636-d805-47ea-b9b1-422dc7c3b0d4",
    "projectNumber": "69089194636",
    "title": "ประกวดราคาจ้างเหมาบริการทำและซ่อมวัสดุทางทันตกรรมชนิดติดแน่น จำนวน 6 รายการ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 2000000,
    "referencePrice": 2000000,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/70c47636-d805-47ea-b9b1-422dc7c3b0d4",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-16T17:00:00Z",
        "filename": "TOR_ปี.70-ทันตกรรมชนิดติดแน่น_1786949520251.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/75a18465-fb3a-4384-9cab-ac99359231fb/TOR_%E0%B8%9B%E0%B8%B5.70-%E0%B8%97%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B8%99%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B9%81%E0%B8%99%E0%B9%88%E0%B8%99_1786949520251.pdf",
        "textLayer": "scanned",
        "pages": 7
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-16T17:00:00Z",
        "filename": "ราคากลาง_1786949567550.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/6606b9c5-3f03-4159-a856-90886f55dab3/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1786949567550.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-17T17:00:00Z",
        "filename": "ร่างเอกสารประกาศเชิญชวน_1787020512485.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/477c71f4-2da4-44d5-bac0-e95b1881ce71/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99_1787020512485.pdf",
        "textLayer": "scanned",
        "pages": 14
      }
    ],
    "publishedAt": "2026-08-16T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "392421d8-7653-430e-b4a6-2e6ae38e0d81",
    "projectNumber": "69089085197",
    "title": "น้ำยาตรวจวิเคราะห์การแข็งตัวของเลือด จำนวน ๒ รายการ",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลตากสิน",
    "budget": 2694000,
    "referencePrice": 2694000,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/392421d8-7653-430e-b4a6-2e6ae38e0d81",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-16T17:00:00Z",
        "filename": "TOR_Coag_70_1786962236537.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/e1301660-12a9-4ed8-94dc-9759f91258dd/TOR_Coag_70_1786962236537.pdf",
        "textLayer": "scanned",
        "pages": 7
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-16T17:00:00Z",
        "filename": "ราคากลาง_Coag_70_(บก.06)_1786962393986.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/f5ed0060-769e-4b52-80d4-32addb62170c/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_Coag_70_%28%E0%B8%9A%E0%B8%81.06%29_1786962393986.pdf",
        "textLayer": "scanned",
        "pages": 4
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-16T17:00:00Z",
        "filename": "ร่างประกวดCoag-70_1786962542452.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/62ba5085-d809-4b94-a929-2329cad44dfe/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94Coag-70_1786962542452.pdf",
        "textLayer": "scanned",
        "pages": 11
      }
    ],
    "publishedAt": "2026-08-16T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "c31bb4d0-a2cc-4d6b-bbb4-c10567446b61",
    "projectNumber": "69079177503",
    "title": "ประกวดราคาซื้อถุงพลาสติกสีเขียวสำหรับทิ้งเศษอาหาร ขนาด 18x20 นิ้ว สำหรับผู้ลงทะเบียนรับสิทธิ์ แยกขยะลดค่าธรรมเนียม จำนวน 7,200,000 ใบ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักสิ่งแวดล้อม",
    "department": "สำนักงานยุทธศาสตร์จัดการมูลฝอย",
    "budget": 3960000,
    "referencePrice": 3960000,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์อื่นๆ",
    "category": "equipment",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 6,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/c31bb4d0-a2cc-4d6b-bbb4-c10567446b61",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-16T17:00:00Z",
        "filename": "0._TOR_ถุง_20-07-69_1786955720039.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/180009b0-74cd-4d21-af76-7198c7fcc05b/0._TOR_%E0%B8%96%E0%B8%B8%E0%B8%87_20-07-69_1786955720039.pdf",
        "textLayer": "scanned",
        "pages": 6
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-16T17:00:00Z",
        "filename": "0._แบบ6_1786955780697.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/2e9aa5b0-2e82-4e37-bfac-6209803ac2d3/0._%E0%B9%81%E0%B8%9A%E0%B8%9A6_1786955780697.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-16T17:00:00Z",
        "filename": "0._ร่างลงสยป_1786955926144.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/65dba2e5-8e20-41ab-a56a-05b73ef56e8b/0._%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A5%E0%B8%87%E0%B8%AA%E0%B8%A2%E0%B8%9B_1786955926144.pdf",
        "textLayer": "digital",
        "pages": 32
      }
    ],
    "publishedAt": "2026-08-16T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "4630980b-422b-4dd2-a52c-1919f60bab58",
    "projectNumber": "69089001822",
    "title": "ซื้อวัสดุวิทยาศาสตร์ทางการแพทย์ จำนวน 6 รายการ",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลตากสิน",
    "budget": 10582000,
    "referencePrice": 0,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 12,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/4630980b-422b-4dd2-a52c-1919f60bab58",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-13T17:00:00Z",
        "filename": "สเปคแก๊ส_ปี_70_1786698406251.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/1ee18201-d2a5-4a05-aaf3-c5f64afbc7b4/%E0%B8%AA%E0%B9%80%E0%B8%9B%E0%B8%84%E0%B9%81%E0%B8%81%E0%B9%8A%E0%B8%AA_%E0%B8%9B%E0%B8%B5_70_1786698406251.pdf",
        "textLayer": "scanned",
        "pages": 12
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-13T17:00:00Z",
        "filename": "ราคากลางแก๊ส__ปี_70_1786698439059.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/09b41b6c-88a4-4612-a046-d018407b94e6/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%81%E0%B9%8A%E0%B8%AA__%E0%B8%9B%E0%B8%B5_70_1786698439059.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-13T17:00:00Z",
        "filename": "ร่างประกาศแก๊ส_70_1786698493756.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/2b5fc542-0e7a-4f3a-b4c2-2cbc24f90ef2/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%81%E0%B8%81%E0%B9%8A%E0%B8%AA_70_1786698493756.pdf",
        "textLayer": "scanned",
        "pages": 17
      },
      {
        "kind": "invitation",
        "published": "2026-08-19T17:00:00Z",
        "filename": "ประกาศเชิญชวน_แก๊ส_ปี_70_1787278295644.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/6b74be06-b455-426a-9460-10e6c5abc47f/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99_%E0%B9%81%E0%B8%81%E0%B9%8A%E0%B8%AA_%E0%B8%9B%E0%B8%B5_70_1787278295644.pdf",
        "textLayer": "scanned",
        "pages": 17
      }
    ],
    "publishedAt": "2026-08-13T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "efb7a850-aa30-42e4-9b1b-49f9fdb1f7e7",
    "projectNumber": "69089283521",
    "title": "โครงการชุมชนเข้มแข็งพัฒนาตนเองตามหลักปรัชญาเศรษฐกิจพอเพียง (เต็นท์) จำนวน 7 รายการ",
    "agency": "สำนักงานเขตดุสิต",
    "department": null,
    "budget": 8600000,
    "referencePrice": 279800,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์อื่นๆ",
    "category": "equipment",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/efb7a850-aa30-42e4-9b1b-49f9fdb1f7e7",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-12T17:00:00Z",
        "filename": "คุณลักษณะเต็นท์_7รายการ_1386920260813_15491424_1787042828761.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/3bd6623f-4578-45ac-8410-2e53f5438b52/%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%99%E0%B8%97%E0%B9%8C_7%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3_1386920260813_15491424_1787042828761.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-12T17:00:00Z",
        "filename": "ราคากลางต็นท์_7รายการ_1386920260813_15111403_1787042925715.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/5b609d27-8b62-4f86-b162-2407c3a0e7da/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%95%E0%B9%87%E0%B8%99%E0%B8%97%E0%B9%8C_7%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3_1386920260813_15111403_1787042925715.pdf",
        "textLayer": "scanned",
        "pages": 2
      },
      {
        "kind": "invitation",
        "published": "2026-08-16T17:00:00Z",
        "filename": "ประกวดราคา_merged_1787044335534.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/cd3489a1-d00f-4339-b34c-ba1c30cf84ef/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2_merged_1787044335534.pdf",
        "textLayer": "digital",
        "pages": 15
      }
    ],
    "publishedAt": "2026-08-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "b9532dd2-9922-43cc-9755-b76bd2d545af",
    "projectNumber": "69089196634",
    "title": "ประกวดราคาจ้างเหมาบริการส่งตรวจเอกซเรย์เต้านมระบบดิจิทัล (Digital Mammogram) ร่วมกับการตรวจอัลตราซาวนด์ (Ultrasound) และส่งตรวจเอกซเรย์เต้านมระบบดิจิทัล (Digital Mammogram) จำนวน 1 งาน ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 7219000,
    "referencePrice": 7219000,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/b9532dd2-9922-43cc-9755-b76bd2d545af",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-08-12T17:00:00Z",
        "filename": "ราคากลาง_(Digital_Mammogram)_70_1786932632296.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/d2b0f469-7a17-43ca-b76c-76c60627fbe4/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%28Digital_Mammogram%29_70_1786932632296.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-08-12T17:00:00Z",
        "filename": "TOR_Mammo_ปี_70_1786932704153.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/b32c933c-e7a5-4605-a9f3-f5944fe31ca5/TOR_Mammo_%E0%B8%9B%E0%B8%B5_70_1786932704153.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-16T17:00:00Z",
        "filename": "ร่างส่งตราจฯ_70_1786932788571.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/8e210be8-d33d-479a-982c-7c338d994f76/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%88%E0%B8%AF_70_1786932788571.pdf",
        "textLayer": "scanned",
        "pages": 14
      }
    ],
    "publishedAt": "2026-08-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "45509e6b-e046-4d7d-97ce-546754e89677",
    "projectNumber": "69089072235",
    "title": "ซื้ออวัยวะเทียมและอุปกรณ์บำบัด จำนวน ๒ รายการ สำหรับใช้ในปีงบประมาณ ๒๕๗๐ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 1412400,
    "referencePrice": 1412400,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 6,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/45509e6b-e046-4d7d-97ce-546754e89677",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-12T17:00:00Z",
        "filename": "1-1_คุณลักษณะเฉพาะ_1786587793779.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/42c0c25b-f829-46cf-bbcb-41dca4e8be6b/1-1_%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0_1786587793779.pdf",
        "textLayer": "digital",
        "pages": 6
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-12T17:00:00Z",
        "filename": "1-2_ตารางราคากลาง_1786587896249.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/bc7b6f45-c27d-4199-b57f-fe512f845ae8/1-2_%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1786587896249.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-08-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "2abca073-f6d4-4b75-ad06-17e2eb242748",
    "projectNumber": "69089039111",
    "title": "ซื้อสารเภสัชรังสีและสารกัมมันตรังสี จำนวน ๑๖ รายการ สำหรับใช้ในปีงบประมาณ ๒๕๗๐ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 2649500,
    "referencePrice": 2649500,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 20,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/2abca073-f6d4-4b75-ad06-17e2eb242748",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-12T17:00:00Z",
        "filename": "1-1_คุณลักษณะเฉพาะ_1786592623770.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/fa023f17-89b4-47eb-aeaf-8d3beb0d9d7f/1-1_%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0_1786592623770.pdf",
        "textLayer": "digital",
        "pages": 20
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-12T17:00:00Z",
        "filename": "1-2_ตารางราคากลาง_1786592662830.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/62ae13e1-2596-4fd5-9054-e5de56dd7f63/1-2_%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1786592662830.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-08-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "b10ef6fa-0f04-4176-92fe-92fda009e66f",
    "projectNumber": "69079375882",
    "title": "จ้างเหมาจัดทำใบเกียรติบัตร เทศกิจทำความดี พร้อมปก จำนวน 92 ชุด โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักเทศกิจ",
    "department": "สำนักงานเลขานุการ",
    "budget": 73600,
    "referencePrice": 73600,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 5,
    "status": "deliveredOnTime",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/b10ef6fa-0f04-4176-92fe-92fda009e66f",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-12T17:00:00Z",
        "filename": "TOR_และราคากลาง_จัดทำใบเกียรติบัตร_เทศกิจทำความดีฯ_92_ชุด_1786618233113.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/5f4f14aa-2905-4b6a-86c5-5f4d23ff0b71/TOR_%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B8%B3%E0%B9%83%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B8%B5%E0%B8%A2%E0%B8%A3%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3_%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%81%E0%B8%B4%E0%B8%88%E0%B8%97%E0%B8%B3%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%94%E0%B8%B5%E0%B8%AF_92_%E0%B8%8A%E0%B8%B8%E0%B8%94_1786618233113.pdf",
        "textLayer": "scanned",
        "pages": 5
      }
    ],
    "publishedAt": "2026-08-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "9fb54df6-ce97-4f30-a14c-ae073445e571",
    "projectNumber": "69089244210",
    "title": "จ้างเหมาปรับภูมิทัศน์บริเวณโดยรอบท้องสนามหลวง ฝั่งถนนหน้าพระลานและถนนหน้าพระธาตุ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักสิ่งแวดล้อม",
    "department": "สำนักงานบริหารจัดการพื้นที่สีเขียว",
    "budget": 5843799.5,
    "referencePrice": 5839680,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 3,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/9fb54df6-ce97-4f30-a14c-ae073445e571",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-08-10T17:00:00Z",
        "filename": "ตารางแสดงวงเงินงบประมาณ_1786619048420.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/eb8de9d3-4fed-487c-b002-3ec9940b5e2b/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87%E0%B8%A7%E0%B8%87%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%87%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%B2%E0%B8%93_1786619048420.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-08-10T17:00:00Z",
        "filename": "ร่างขอบเขตของงานจ้างเหมาปรับภูมิทัศน์บริเวณโดยรอบท้องสนามหลวงฯ_1786619128447.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/cf61ad7a-9b3c-48e8-a146-9d3d1c51d96c/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4%E0%B8%97%E0%B8%B1%E0%B8%A8%E0%B8%99%E0%B9%8C%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%93%E0%B9%82%E0%B8%94%E0%B8%A2%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B8%97%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87%E0%B8%AF_1786619128447.pdf",
        "textLayer": "scanned",
        "pages": 3
      }
    ],
    "publishedAt": "2026-08-10T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "c1df0ba1-e07a-4585-a23b-31da9ca8ec4d",
    "projectNumber": "69089069590",
    "title": "ประกวดราคาจ้างก่อสร้างก่อสร้างประตูระบายน้ำริมคลองสนามชัย บริเวณปลายซอยเทียนทะเล 20 แยก 7 ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding) ครั้งที่ 2",
    "agency": "สำนักการระบายน้ำ",
    "department": "สำนักงานพัฒนาระบบระบายน้ำ",
    "budget": 20100000,
    "referencePrice": 0,
    "procurementMethod": "competitive",
    "procurementType": "จ้างก่อสร้าง",
    "goodsCategory": "จ้างก่อสร้างชลประทาน",
    "category": "construction",
    "contractType": "construction",
    "torTextLayer": "digital",
    "torPages": 13,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/c1df0ba1-e07a-4585-a23b-31da9ca8ec4d",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-10T17:00:00Z",
        "filename": "ร่างเทียนทะเล_20_ล่าสุด_1787284485441.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/9be14260-51e2-4a65-be34-88b14db06fc9/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%A5_20_%E0%B8%A5%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B8%E0%B8%94_1787284485441.pdf",
        "textLayer": "digital",
        "pages": 13
      },
      {
        "kind": "invitation",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ประกาศ_กทม.ประกวดราคาจ้างเทียนทะเล_20_ที่เเสกนไว้เเละมีลายเซ็น_ผอเเเทนผู้ว่า_1787284683260.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/e00578c8-a2ec-44fa-a3a5-3992c919908a/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B8%81%E0%B8%97%E0%B8%A1.%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%A5_20_%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B9%80%E0%B8%AA%E0%B8%81%E0%B8%99%E0%B9%84%E0%B8%A7%E0%B9%89%E0%B9%80%E0%B9%80%E0%B8%A5%E0%B8%B0%E0%B8%A1%E0%B8%B5%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99_%E0%B8%9C%E0%B8%AD%E0%B9%80%E0%B9%80%E0%B9%80%E0%B8%97%E0%B8%99%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%A7%E0%B9%88%E0%B8%B2_1787284683260.pdf",
        "textLayer": "digital",
        "pages": 16
      }
    ],
    "publishedAt": "2026-08-10T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "c6016ac2-4f91-463f-b862-ebb7f567a57e",
    "projectNumber": "69089367709",
    "title": "จ้างเหมาประกอบอาหาร(ปรุงสำเร็จ)สำหรับนักเรียนโรงเรียนวัดราษฎร์นิยมธรรม(พิบูลสงคราม) อาหารเช้า จำนวน ๙๓๘ คน อาหารกลางวัน จำนวน ๑,๐๔๒ คน ระหว่างวันที่ ๒๔ - ๒๘ สิงหาคม ๒๕๖๙ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักงานเขตสายไหม",
    "department": "โรงเรียนวัดราษฎร์นิยมธรรม",
    "budget": 200600,
    "referencePrice": 0,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "digital",
    "torPages": 4,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/c6016ac2-4f91-463f-b862-ebb7f567a57e",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-10T17:00:00Z",
        "filename": "ร่างขอบเขตงาน_สป_15_compressed_1787038840368.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/ffe6765d-3ed5-4af7-b597-17f13c612ce6/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%87%E0%B8%B2%E0%B8%99_%E0%B8%AA%E0%B8%9B_15_compressed_1787038840368.pdf",
        "textLayer": "digital",
        "pages": 4
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-12T17:00:00Z",
        "filename": "ตารางแสดงราคากลาง_สป_15_1787039895187.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/4fa27a44-65e5-4b26-b10f-d1f3bc139016/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%AA%E0%B8%9B_15_1787039895187.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-08-10T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "d5e756c1-8615-4d47-8726-470efa907e3e",
    "projectNumber": "69089032198",
    "title": "ซื้อสารเภสัชรังสีและสารกัมมันตรังสี จำนวน ๘ รายการ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 549980,
    "referencePrice": 549980,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 12,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/d5e756c1-8615-4d47-8726-470efa907e3e",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-10T17:00:00Z",
        "filename": "1-1_คุณลักษณะเฉพาะ_1786433818036.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/944ac3fa-7866-4237-af41-d91dc8530244/1-1_%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0_1786433818036.pdf",
        "textLayer": "digital",
        "pages": 12
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-10T17:00:00Z",
        "filename": "1-2_ตารางราคากลาง_1786433884210.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/cb6563e7-465b-4523-a741-4f51244df466/1-2_%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1786433884210.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-08-10T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "1f3be7c1-cd5b-4f81-beb8-9f7a0ff504e9",
    "projectNumber": "69079433058",
    "title": "จัดซื้อคอมพิวเตอร์สำหรับงานสำนักงานและอุปกรณ์ ตามโครงการชุมชนเข้มแข็งพัฒนาตนเองตามหลักปรัชญาเศรษฐกิจพอเพียง ปี 2569",
    "agency": "สำนักงานเขตหนองแขม",
    "department": "ฝ่ายปกครอง",
    "budget": 945600,
    "referencePrice": 0,
    "procurementMethod": "competitive",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์คอมพิวเตอร์",
    "category": "it",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/1f3be7c1-cd5b-4f81-beb8-9f7a0ff504e9",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-10T17:00:00Z",
        "filename": "รายละเอียดแนบท้าย_TOR_สำหรับจัดซื้อคอมพิวเตอร์ฯ_1786435701655.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/189b5e60-f15a-4708-b871-cbcac39ab688/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B9%81%E0%B8%99%E0%B8%9A%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B8%A2_TOR_%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AF_1786435701655.pdf",
        "textLayer": "scanned",
        "pages": 7
      }
    ],
    "publishedAt": "2026-08-10T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "1ac93ccc-023e-4a11-97fb-7c0e3a4e4d5a",
    "projectNumber": "69079068760",
    "title": "ประกวดราคาจ้างเหมาบริการตรวจวิเคราะห์ทางห้องปฏิบัติการภายนอกโรงพยาบาลกลาง ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 10958600,
    "referencePrice": 0,
    "procurementMethod": "competitive",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "digital",
    "torPages": 29,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/1ac93ccc-023e-4a11-97fb-7c0e3a4e4d5a",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-09T17:00:00Z",
        "filename": "A.ร่างขอบเขตของงานจ้างเหมา(TOR)_2570_1786358314873.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/288fbb55-75e7-4645-ba0d-5a303b80322f/A.%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%9A%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B2%28TOR%29_2570_1786358314873.pdf",
        "textLayer": "digital",
        "pages": 29
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-09T17:00:00Z",
        "filename": "B.ตารางแสดงวงเงิน_ราคากลาง(แลปนอก)69_1786358527443.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/c58bb68a-ac93-4b8f-bbdd-0b2669230fb5/B.%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87%E0%B8%A7%E0%B8%87%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99_%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%28%E0%B9%81%E0%B8%A5%E0%B8%9B%E0%B8%99%E0%B8%AD%E0%B8%81%2969_1786358527443.pdf",
        "textLayer": "digital",
        "pages": 35
      },
      {
        "kind": "invitation",
        "published": "2026-08-16T17:00:00Z",
        "filename": "เอกสารประกาศประกวด_1787124685953.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/3f2a18c9-8527-497d-9f82-040716b4dcda/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94_1787124685953.pdf",
        "textLayer": "scanned",
        "pages": 17
      }
    ],
    "publishedAt": "2026-08-09T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "c7e27329-e046-4493-b982-249ec5e8e979",
    "projectNumber": "69089307895",
    "title": "จ้างเหมาซ่อมแซมครุภัณฑ์ จำนวน ๑๓ รายการ",
    "agency": "สำนักงานเขตสายไหม",
    "department": "โรงเรียนวัดหนองใหญ่",
    "budget": 50000,
    "referencePrice": 0,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "digital",
    "torPages": 4,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/c7e27329-e046-4493-b982-249ec5e8e979",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-09T17:00:00Z",
        "filename": "TOr_ซ่อม_1787296860024.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/ed6108e1-290c-4083-86d0-00c593aa6174/TOr_%E0%B8%8B%E0%B9%88%E0%B8%AD%E0%B8%A1_1787296860024.pdf",
        "textLayer": "digital",
        "pages": 4
      }
    ],
    "publishedAt": "2026-08-09T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "d9f649c5-2960-4336-9b16-43ff0529cf38",
    "projectNumber": "69089208458",
    "title": "จ้างเหมาจัดทำป้ายไวนิล จำนวน 1 ผืน โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักเทศกิจ",
    "department": "สำนักงานเลขานุการ",
    "budget": 5500,
    "referencePrice": 5500,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 5,
    "status": "deliveredOnTime",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/d9f649c5-2960-4336-9b16-43ff0529cf38",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-09T17:00:00Z",
        "filename": "TOR_จ้างเหมาจัดทำป้ายไวนิล_1_ผืน_1787049407728.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/1d807a74-5818-41d3-8243-6d8f8f2b4f11/TOR_%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B8%B3%E0%B8%9B%E0%B9%89%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%A7%E0%B8%99%E0%B8%B4%E0%B8%A5_1_%E0%B8%9C%E0%B8%B7%E0%B8%99_1787049407728.pdf",
        "textLayer": "scanned",
        "pages": 5
      }
    ],
    "publishedAt": "2026-08-09T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "ffe0f6b7-5fd2-444a-8486-83810c5957ca",
    "projectNumber": "69089148280",
    "title": "ซื้อเมล็ดพันธุ์ไม้ดอก สำหรับเตรียมการจัดงานพระราชพิธีถวายพระเพลิงพระบรมศพสมเด็จพระเจ้าลูกเธอ เจ้าฟ้าพัชรกิติยาภา นเรนทิราเทพยวดี กรมหลวงราชสาริณีสิริพัชร มหาวัชรราชธิดา จำนวน ๘ รายการ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักสิ่งแวดล้อม",
    "department": "สำนักงานบริหารจัดการพื้นที่สีเขียว",
    "budget": 499500,
    "referencePrice": 499000,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์การเกษตร",
    "category": "agriculture",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 5,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/ffe0f6b7-5fd2-444a-8486-83810c5957ca",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-08-06T17:00:00Z",
        "filename": "ตาราง_บก_06(จัดซื้อเมล็ดพันธุ์ไม้ดอก_สำหรับเตรียมการจัดงานฯ_จำนวน_8_รายการ)_1787046774134.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/36048f3f-b6b7-4fb7-9bab-2d99f0cd771c/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87_%E0%B8%9A%E0%B8%81_06%28%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%A1%E0%B8%A5%E0%B9%87%E0%B8%94%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B8%94%E0%B8%AD%E0%B8%81_%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AF_%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%99_8_%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%29_1787046774134.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-08-06T17:00:00Z",
        "filename": "รายละเอียดคุณลักษณะ(จัดซื้อเมล็ดพันธุ์ไม้ดอก_สำหรับเตรียมการจัดงานฯ_จำนวน_8_รายการ)_1787047081172.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/aa9cab70-b656-41c7-b8c9-c5067d5d92ed/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%28%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%A1%E0%B8%A5%E0%B9%87%E0%B8%94%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B8%94%E0%B8%AD%E0%B8%81_%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AF_%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%99_8_%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%29_1787047081172.pdf",
        "textLayer": "scanned",
        "pages": 5
      }
    ],
    "publishedAt": "2026-08-06T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "96473e9d-da2b-4dfe-84a2-2de2f5ed259c",
    "projectNumber": "69049250809",
    "title": "ประกวดราคาซื้อพร้อมติดตั้งระบบปรับอากาศป้องกันการแพร่กระจายเชื้อสำหรับห้องควบคุมแรงดันและห้องคลีนรูมทันตกรรม จำนวน 1 ระบบ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 2368514.55,
    "referencePrice": 2368514.55,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์สำนักงาน",
    "category": "office",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 15,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/96473e9d-da2b-4dfe-84a2-2de2f5ed259c",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-05T17:00:00Z",
        "filename": "TOR_ทันตกรรม_5_สค_69_1785986874857.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/22855f07-4f43-4fdb-8a1e-7f2e46f31847/TOR_%E0%B8%97%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1_5_%E0%B8%AA%E0%B8%84_69_1785986874857.pdf",
        "textLayer": "scanned",
        "pages": 15
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-05T17:00:00Z",
        "filename": "ราคากลาง_ระบบปรับอากาศฯ_ทันตกรรม_5_สค_69_1785986918048.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/fa39e1b9-acf9-44af-bd35-6901fa1bbe54/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%AF_%E0%B8%97%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1_5_%E0%B8%AA%E0%B8%84_69_1785986918048.pdf",
        "textLayer": "scanned",
        "pages": 3
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-05T17:00:00Z",
        "filename": "ร่างประกาศ_ระบบปรับอากาศฯ_ทันตกรรม_1785987442896.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/62f928ec-cba5-4c7d-babe-fdc8e2cafff3/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%AF_%E0%B8%97%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1_1785987442896.pdf",
        "textLayer": "scanned",
        "pages": 14
      },
      {
        "kind": "invitation",
        "published": "2026-08-18T17:00:00Z",
        "filename": "ประกาศเชิญชวน_-_ระบบปรับอากาศ-ทันตกรรม_19-8-69_1787116104241.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/07ad95af-72cf-450f-b659-e5d31670f612/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99_-_%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8-%E0%B8%97%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1_19-8-69_1787116104241.pdf",
        "textLayer": "scanned",
        "pages": 14
      }
    ],
    "publishedAt": "2026-08-05T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "7b6d5030-c226-43e6-92c6-78850d551e92",
    "projectNumber": "69089243569",
    "title": "จ้างเหมาประกอบอาหาร(ปรุงสำเร็จ)สำหรับนักเรียนโรงเรียนวัดราษฎร์นิยมธรรม(พิบูลสงคราม) อาหารเช้า จำนวน ๙๓๘ คน อาหารกลางวัน จำนวน ๑,๐๔๒ คน ระหว่างวันที่ ๑๗ - ๒๑ สิงหาคม ๒๕๖๙ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักงานเขตสายไหม",
    "department": "โรงเรียนวัดราษฎร์นิยมธรรม",
    "budget": 200600,
    "referencePrice": 0,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "digital",
    "torPages": 4,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/7b6d5030-c226-43e6-92c6-78850d551e92",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-04T17:00:00Z",
        "filename": "คุณลักษณะ_สป14_1786444021466.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/bc50e97a-e27b-41b9-91dd-fabc6b1b7371/%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0_%E0%B8%AA%E0%B8%9B14_1786444021466.pdf",
        "textLayer": "digital",
        "pages": 4
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-05T17:00:00Z",
        "filename": "ราคากลาง_สป14_1786444058710.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/7323ce6a-e811-4075-a073-978838395a25/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%AA%E0%B8%9B14_1786444058710.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-08-04T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "a1b889eb-54b4-45d7-ad90-f1e5581622a7",
    "projectNumber": "69089042833",
    "title": "จ้างเหมาจัดทำตรายาง จำนวน 21 รายการ",
    "agency": "สำนักงานเขตทวีวัฒนา",
    "department": null,
    "budget": 3360,
    "referencePrice": 0,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "วัสดุครุภัณฑ์สำนักงาน",
    "category": "office",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 3,
    "status": "deliveredComplete",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/a1b889eb-54b4-45d7-ad90-f1e5581622a7",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-04T17:00:00Z",
        "filename": "TOR_0001_1787016828466.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/a9f2bac3-2e50-4da2-898d-e9ae7f76dabf/TOR_0001_1787016828466.pdf",
        "textLayer": "scanned",
        "pages": 3
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-04T17:00:00Z",
        "filename": "ราคากลาง_0001_1787017018694.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/c2fcedaa-ea2d-48a4-b32a-afdddd839872/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_0001_1787017018694.pdf",
        "textLayer": "scanned",
        "pages": 1
      }
    ],
    "publishedAt": "2026-08-04T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "e816a384-c086-4bf0-a54a-5eaaf964c6e5",
    "projectNumber": "69079577106",
    "title": "ประกวดราคาเช่าเครื่องพิมพ์เลเซอร์ หรือ LED ชนิด Network พร้อมอุปกรณ์ จำนวน 2 รายการ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลตากสิน",
    "budget": 4380000,
    "referencePrice": 4380000,
    "procurementMethod": "eBidding",
    "procurementType": "เช่า",
    "goodsCategory": "เช่าอื่นๆ",
    "category": "lease",
    "contractType": "lease",
    "torTextLayer": "scanned",
    "torPages": 8,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/e816a384-c086-4bf0-a54a-5eaaf964c6e5",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-08-03T17:00:00Z",
        "filename": "เช่า_เครื่องพิมพ์_1785818668255.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/02bfd5d2-5739-4c71-ade7-a01beb7ad902/%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2_%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C_1785818668255.pdf",
        "textLayer": "scanned",
        "pages": 8
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-03T17:00:00Z",
        "filename": "ร่าง_เช่าเครื่องพิมพ์_1785818736758.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/24f6df79-cd11-4a8d-98a0-e5f147d59d26/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87_%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C_1785818736758.pdf",
        "textLayer": "scanned",
        "pages": 16
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-03T17:00:00Z",
        "filename": "ราคากลาง_ลงเว็บไซต์_1785818775989.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/01f034f7-242b-4520-a919-b326b1a43f44/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B8%A5%E0%B8%87%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A%E0%B9%84%E0%B8%8B%E0%B8%95%E0%B9%8C_1785818775989.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "invitation",
        "published": "2026-08-10T17:00:00Z",
        "filename": "ประกาศเชิญชวนช่า_Printer_1786509564624.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/51ad61f6-8327-4015-b085-3afe0d8e3278/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%B2_Printer_1786509564624.pdf",
        "textLayer": "scanned",
        "pages": 17
      }
    ],
    "publishedAt": "2026-08-03T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "49c9fff9-3155-423e-9852-e1475af503c6",
    "projectNumber": "69079331703",
    "title": "ประกวดราคาจ้างบริการตรวจเอกซเรย์เต้านมระบบดิจิตอลร่วมกับการตรวจอัลตร้าซาวนด์และตรวจอัลตร้าซาวนด์เต้านม ประจำปีงบประมาณ พ.ศ. ๒๕๗๐ จำนวน ๒ รายการ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลตากสิน",
    "budget": 1406000,
    "referencePrice": 1406000,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมางานตรวจสอบและรับรองมาตรฐาน",
    "category": "inspection",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 8,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/49c9fff9-3155-423e-9852-e1475af503c6",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-23T17:00:00Z",
        "filename": "tor_compressed_1785893794591.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/e49da828-b264-484c-a5ef-27d2ca96527c/tor_compressed_1785893794591.pdf",
        "textLayer": "scanned",
        "pages": 8
      },
      {
        "kind": "invitation",
        "published": "2026-08-03T17:00:00Z",
        "filename": "ประกาศ_1785894189802.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/c96109aa-1c45-49ff-a9b2-17afa9cffd28/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_1785894189802.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "invitation",
        "published": "2026-08-03T17:00:00Z",
        "filename": "เอกสารประกวด_1785894238252.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/96eebbfa-6f3d-47fa-aaed-953002c088ce/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94_1785894238252.pdf",
        "textLayer": "scanned",
        "pages": 14
      }
    ],
    "publishedAt": "2026-07-23T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "ac200729-0c50-4503-8aac-a465fc3179ba",
    "projectNumber": "69069168622",
    "title": "ประกวดราคาซื้ออุปกรณ์ส่วนควบคุมระบบบำบัดมลพิษ เครื่องผลิตแอสฟัลต์ผสมร้อน 1 ระบบ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการโยธา",
    "department": null,
    "budget": 3950000,
    "referencePrice": 3910850,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "ที่ดินและสิ่งก่อสร้าง",
    "category": "construction",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/ac200729-0c50-4503-8aac-a465fc3179ba",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-22T17:00:00Z",
        "filename": "1_TOR_1785151446654.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/8f80d853-4e36-4e5d-a66d-a352e1913d40/1_TOR_1785151446654.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-22T17:00:00Z",
        "filename": "1_ราคากลาง_1785151489225.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/cb04dba7-4b24-4e8e-8fdc-a812a665434a/1_%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1785151489225.pdf",
        "textLayer": "scanned",
        "pages": 2
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-02T17:00:00Z",
        "filename": "ร่างประกาศกรุงเทพมหานคร_1785757186355.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/ca7b0d9f-9448-4c4f-9d42-de175eb9d2a2/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3_1785757186355.pdf",
        "textLayer": "scanned",
        "pages": 16
      },
      {
        "kind": "invitation",
        "published": "2026-08-09T17:00:00Z",
        "filename": "ประกาศกรุงเทพหานคร__72-2569_1786330488765.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/9e8b6471-3e7d-41a8-ac9c-37b94f33cc67/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3__72-2569_1786330488765.pdf",
        "textLayer": "digital",
        "pages": 16
      }
    ],
    "publishedAt": "2026-07-22T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "7f973e24-740a-4dba-9aa1-0ec4ec88d91b",
    "projectNumber": "69089325724",
    "title": "ซื้อวัสดุกิจกรรมวิชาการ,วัสดุกิจกรรมคุณธรรม จริยธรรม/ลูกเสือ/เนตรนารี/ยุวกาชาด/บำเพ็ญประโยชน์ จำนวน 61 รายการ",
    "agency": "สำนักงานเขตสายไหม",
    "department": "โรงเรียนวัดหนองใหญ่",
    "budget": 464485,
    "referencePrice": 0,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์การศึกษา",
    "category": "education",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 3,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/7f973e24-740a-4dba-9aa1-0ec4ec88d91b",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-22T17:00:00Z",
        "filename": "รายละเอียดคุณลักษณะเฉพาะของพัสดุ_ค่าวัสดุวิชาการ_+_คุณธรรม_แก้ไข_15_ส.ค._69_compressed_1786771613630.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/85cdf4c2-d7c0-4ed7-8f90-785b960bfecd/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%9E%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B8_%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3_%2B_%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1_%E0%B9%81%E0%B8%81%E0%B9%89%E0%B9%84%E0%B8%82_15_%E0%B8%AA.%E0%B8%84._69_compressed_1786771613630.pdf",
        "textLayer": "digital",
        "pages": 3
      }
    ],
    "publishedAt": "2026-07-22T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "90fc9cbd-2c29-47ef-9a15-2eeb79448b0a",
    "projectNumber": "69079565102",
    "title": "ซื้อยาที่มีผู้จำหน่ายเพียงรายเดียว จำนวน ๑ รายการ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 1797600,
    "referencePrice": 1797600,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/90fc9cbd-2c29-47ef-9a15-2eeb79448b0a",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-07-21T17:00:00Z",
        "filename": "ราคากลางยาที่มีผู้จำหน่ายเพียงรายเดียว_จำนวน_1_รายการ_1785134065181.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/5c8e9ba7-ec09-4c7e-a688-a70869b50d62/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%A2%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7_%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%99_1_%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3_1785134065181.pdf",
        "textLayer": "digital",
        "pages": 2
      },
      {
        "kind": "tor",
        "published": "2026-07-21T17:00:00Z",
        "filename": "คุณลักษณะเฉพาะยาที่มีผู้จำหน่ายเพียงรายเดียว_จำนวน_1_รายการ_1785134106295.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/37fcbffd-12a6-4b5c-803d-f8a0e8e07993/%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%A2%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%9E%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7_%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%99_1_%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3_1785134106295.pdf",
        "textLayer": "digital",
        "pages": 7
      }
    ],
    "publishedAt": "2026-07-21T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "29cdd351-2c77-46b6-937e-89fa5d7527cc",
    "projectNumber": "69059395621",
    "title": "ประกวดราคาจ้างก่อสร้างปรับปรุงอาคารเรือนกระจก สวนสราญรมย์ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักสิ่งแวดล้อม",
    "department": "สำนักงานบริหารจัดการพื้นที่สีเขียว",
    "budget": 20200000,
    "referencePrice": 20107358.93,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างก่อสร้าง",
    "goodsCategory": "จ้างปรับปรุง ซ่อมแซมอาคาร",
    "category": "construction",
    "contractType": "construction",
    "torTextLayer": "scanned",
    "torPages": 6,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/29cdd351-2c77-46b6-937e-89fa5d7527cc",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-07-19T17:00:00Z",
        "filename": "ตารางแสดงวงเงินงบประมาณ_1784540893144.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/37bf8a75-979a-412a-b7dd-164edeb525d9/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87%E0%B8%A7%E0%B8%87%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%87%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%B2%E0%B8%93_1784540893144.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-07-19T17:00:00Z",
        "filename": "แบบรูปรายการ_1784540956664.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/fb546cc9-d2cd-46dc-b53d-a99dcf2fd45c/%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3_1784540956664.pdf",
        "textLayer": "scanned",
        "pages": 6
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-19T17:00:00Z",
        "filename": "ร่างประกาศและร่างเอกสารประกวดราคาฯ_1784541006282.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/8a21a289-5edc-44cb-9e33-a76e342a30c5/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%AF_1784541006282.pdf",
        "textLayer": "scanned",
        "pages": 19
      },
      {
        "kind": "invitation",
        "published": "2026-07-23T17:00:00Z",
        "filename": "ประกาศเชิญชวน_1784953755674.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/2f9db76c-536d-40a9-88bf-904ff4561563/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99_1784953755674.pdf",
        "textLayer": "scanned",
        "pages": 18
      }
    ],
    "publishedAt": "2026-07-19T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "dd59f63a-ed04-4b5a-b107-569b78103520",
    "projectNumber": "69089316824",
    "title": "จัดจ้างทำโล่ประกาศเกียรติคุณตามโครงการคัดเลือกข้าราชการกรุงเทพมหานครสามัญและลูกจ้างกรุงเทพมหานครดีเด่น ประจำปีงบประมาณ พ.ศ. 2569",
    "agency": "สำนักปลัดกรุงเทพมหานคร",
    "department": "สำนักงานการเจ้าหน้าที่",
    "budget": 49113,
    "referencePrice": 49113,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 6,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/dd59f63a-ed04-4b5a-b107-569b78103520",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-16T17:00:00Z",
        "filename": "tor_โล่ดีเด่น_0001_1787129615611.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/d4ccd083-dfe1-4e06-8495-c6b5e0244c5c/tor_%E0%B9%82%E0%B8%A5%E0%B9%88%E0%B8%94%E0%B8%B5%E0%B9%80%E0%B8%94%E0%B9%88%E0%B8%99_0001_1787129615611.pdf",
        "textLayer": "scanned",
        "pages": 6
      }
    ],
    "publishedAt": "2026-07-16T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "5af11744-5aa8-4cfb-8fab-9696de0d5cfe",
    "projectNumber": "69089233476",
    "title": "จ้างซ่อมแซมไฟฟ้าสาธารณะส่องสว่างในพื้นที่เขตหลักสี่ จำนวน 1 ซอย โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักงานเขตหลักสี่",
    "department": "ฝ่ายโยธา",
    "budget": 49096.39,
    "referencePrice": 49096.39,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "missing",
    "torPages": 0,
    "status": "contracted",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/5af11744-5aa8-4cfb-8fab-9696de0d5cfe",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-16T17:00:00Z",
        "filename": null,
        "url": null,
        "textLayer": "missing",
        "pages": 0
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-21T17:00:00Z",
        "filename": null,
        "url": null,
        "textLayer": "missing",
        "pages": 0
      }
    ],
    "publishedAt": "2026-07-16T17:00:00Z",
    "extractionIncomplete": true,
    "signalCount": 0
  },
  {
    "id": "3d401d1f-9ae7-4956-b1c1-4319c402ec6f",
    "projectNumber": "69089232985",
    "title": "จ้างซ่อมแซมไฟฟ้าสาธารณะส่องสว่างในพื้นที่เขตหลักสี่ จำนวน 27 ซอย โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักงานเขตหลักสี่",
    "department": "ฝ่ายโยธา",
    "budget": 306852.46,
    "referencePrice": 306852.46,
    "procurementMethod": "specific",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมาอื่นๆ",
    "category": "services",
    "contractType": "hire",
    "torTextLayer": "missing",
    "torPages": 0,
    "status": "contracted",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/3d401d1f-9ae7-4956-b1c1-4319c402ec6f",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-16T17:00:00Z",
        "filename": null,
        "url": null,
        "textLayer": "missing",
        "pages": 0
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-21T17:00:00Z",
        "filename": null,
        "url": null,
        "textLayer": "missing",
        "pages": 0
      }
    ],
    "publishedAt": "2026-07-16T17:00:00Z",
    "extractionIncomplete": true,
    "signalCount": 0
  },
  {
    "id": "3f4da830-1358-447a-a53d-ca68e2bd42bb",
    "projectNumber": "69039511360",
    "title": "ประกวดราคาซื้อเครื่องตรวจภายในหัวใจและหลอดเลือดด้วยการถ่ายภาพคลื่นเสียงสะท้อนความถี่สูง พร้อมระบบวัดแรงดันหลอดเลือดและหัวใจ จำนวน 1 เครื่อง ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 4000000,
    "referencePrice": 4000000,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/3f4da830-1358-447a-a53d-ca68e2bd42bb",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-16T17:00:00Z",
        "filename": "TOR_1785471686858.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/411baf62-e688-4f33-8250-acc4aba9b38d/TOR_1785471686858.pdf",
        "textLayer": "scanned",
        "pages": 7
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-16T17:00:00Z",
        "filename": "ราคากลางเครื่องตรวจภายในหัวใจฯ_1785477996756.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/5b5664be-5edd-48a1-aa60-b52cac62ea24/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%83%E0%B8%88%E0%B8%AF_1785477996756.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-30T17:00:00Z",
        "filename": "ร่างประกาศ_กทม_1785478112853.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/9f1ac6b0-ecfc-4b36-876d-947bdeb50a87/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B8%81%E0%B8%97%E0%B8%A1_1785478112853.pdf",
        "textLayer": "scanned",
        "pages": 15
      },
      {
        "kind": "invitation",
        "published": "2026-08-05T17:00:00Z",
        "filename": "ประกาศ_กทม_1786006032491.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/91e991ae-fad0-4111-8819-99f6fe77ce22/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B8%81%E0%B8%97%E0%B8%A1_1786006032491.pdf",
        "textLayer": "scanned",
        "pages": 15
      }
    ],
    "publishedAt": "2026-07-16T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "875d519b-075d-428b-9201-f2808169fcf3",
    "projectNumber": "69069595878",
    "title": "ประกวดราคาซื้อชุดน้ำยาตรวจวิเคราะห์ความสมบูรณ์ของเม็ดเลือดทางโลหิตวิทยา จำนวน ๑๗๐,๐๐๐ Tests และชุดน้ำยาตรวจวิเคราะห์ตะกอนปัสสาวะรวมแถบวิเคราะห์สารเคมีในปัสสาวะจำนวน ๕๕,๐๐๐ Tests ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 8247950,
    "referencePrice": 8247950,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 14,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/875d519b-075d-428b-9201-f2808169fcf3",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-14T17:00:00Z",
        "filename": "TOR_Bidding_CBC_UA_70_1784090422171.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/94db0aaa-08ee-4109-a045-08c054a33288/TOR_Bidding_CBC_UA_70_1784090422171.pdf",
        "textLayer": "scanned",
        "pages": 14
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-14T17:00:00Z",
        "filename": "ตารางแสดงวงเงิน_Bidding_CBC_UA_70_1784090840230.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/dc665e82-6b66-4ef1-a602-fd70edd3bf70/%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87%E0%B8%A7%E0%B8%87%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99_Bidding_CBC_UA_70_1784090840230.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-14T17:00:00Z",
        "filename": "ร่างประกาศประกวดราคาซื้อน้ำยา_CBC&UA-70_1784091134285.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/49facc2c-9a69-47d0-8456-aeb8097ec718/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A2%E0%B8%B2_CBC%26UA-70_1784091134285.pdf",
        "textLayer": "scanned",
        "pages": 14
      },
      {
        "kind": "invitation",
        "published": "2026-07-23T17:00:00Z",
        "filename": "ประกาศประกวด+เอกสารประกวด_1784868593249.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/b0cd0b48-1354-44b0-a0e4-e72c44cac1d7/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%2B%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94_1784868593249.pdf",
        "textLayer": "scanned",
        "pages": 16
      }
    ],
    "publishedAt": "2026-07-14T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "d05f44ba-a9cd-4c7c-9c85-eb560d64fec5",
    "projectNumber": "69069424487",
    "title": "ประกวดราคาซื้อชุดน้ำยาตรวจหาสารพันธุกรรมไวรัสก่อโรคด้วยเทคนิคทางอณูชีววิทยา ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 4087560,
    "referencePrice": 4087560,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 12,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/d05f44ba-a9cd-4c7c-9c85-eb560d64fec5",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-14T17:00:00Z",
        "filename": "5-2_ร่าง_TOR_bidding_VL_70_1784250794271.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/01342b4e-66b3-40f9-b782-94a51cb011a5/5-2_%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87_TOR_bidding_VL_70_1784250794271.pdf",
        "textLayer": "scanned",
        "pages": 12
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-14T17:00:00Z",
        "filename": "5-3_Price_bidding_VL_70_1784250895642.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/e4ebc415-7df0-46de-a4d7-7baa5cb4c0f7/5-3_Price_bidding_VL_70_1784250895642.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-14T17:00:00Z",
        "filename": "doc_310000110000335_69069424487_1784251214608.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/a7dbbc81-991e-4bd5-964e-bbf50fc993e6/doc_310000110000335_69069424487_1784251214608.pdf",
        "textLayer": "digital",
        "pages": 14
      },
      {
        "kind": "invitation",
        "published": "2026-07-23T17:00:00Z",
        "filename": "10_Announce_bidding_VL_70_1784868498346.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/c21f8376-e70d-4732-b0d2-10b14747b8ea/10_Announce_bidding_VL_70_1784868498346.pdf",
        "textLayer": "scanned",
        "pages": 15
      }
    ],
    "publishedAt": "2026-07-14T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "2cb02b4e-ed0c-4b23-9c2c-6b3017878e99",
    "projectNumber": "69079363681",
    "title": "ซื้อยาที่มีผู้จำหน่ายเพียงรายเดียว รายการยา panitumumab ๑๐๐ mg/๕ mL concentrate for solution for infusion, ๕ mL vial จำนวน ๑๕๐ กล่อง สำหรับใช้ในปีงบประมาณ ๒๕๖๙ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 1229430,
    "referencePrice": 1649940,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 3,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/2cb02b4e-ed0c-4b23-9c2c-6b3017878e99",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-07-13T17:00:00Z",
        "filename": "ราคากลางยา_panitumumab_๑๐๐_mg๕_mL_concentrate_for_solution_for_infusion,_๕_mL_vial_1784254473638.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/cb0c662f-74fe-4dd0-a9af-1a37d22e007a/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%A2%E0%B8%B2_panitumumab_%E0%B9%91%E0%B9%90%E0%B9%90_mg%E0%B9%95_mL_concentrate_for_solution_for_infusion%2C_%E0%B9%95_mL_vial_1784254473638.pdf",
        "textLayer": "digital",
        "pages": 4
      },
      {
        "kind": "tor",
        "published": "2026-07-13T17:00:00Z",
        "filename": "คุณลักษณะเฉพาะยา_panitumumab_๑๐๐_mg๕_mL_concentrate_for_solution_for_infusion,_๕_mL_vial_1784254530171.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/eb3861a4-d2c7-42fe-9bc3-318fb9c07dd2/%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%A2%E0%B8%B2_panitumumab_%E0%B9%91%E0%B9%90%E0%B9%90_mg%E0%B9%95_mL_concentrate_for_solution_for_infusion%2C_%E0%B9%95_mL_vial_1784254530171.pdf",
        "textLayer": "digital",
        "pages": 3
      }
    ],
    "publishedAt": "2026-07-13T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "a88b7438-0db5-4a96-963d-53bf650f0d13",
    "projectNumber": "69059286344",
    "title": "ประกวดราคาซื้อวัสดุและครุภัณฑ์ตามโครงการชุมชนเข้มแข็งพัฒนาตนเองตามหลักปรัชญาเศรษฐกิจพอเพียง (ภาคสนาม) จำนวน 49 รายการ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักงานเขตสวนหลวง",
    "department": null,
    "budget": 1948240,
    "referencePrice": 0,
    "procurementMethod": "competitive",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์อื่นๆ",
    "category": "equipment",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 23,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/a88b7438-0db5-4a96-963d-53bf650f0d13",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-13T17:00:00Z",
        "filename": "2.1รายละเอียดคุณลักษณะเฉพาะ_1784768502525.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/c8362ddc-473f-47fc-bd73-ad5c2fb2097f/2.1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0_1784768502525.pdf",
        "textLayer": "scanned",
        "pages": 23
      },
      {
        "kind": "tor",
        "published": "2026-07-26T17:00:00Z",
        "filename": "5.1รายละเอียดคุณลักษณะเฉพาะ_(ฉบับปรับปรุง)_1785892377875.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/03a795bf-5702-41f7-a774-249ebd4b4fe0/5.1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0_%28%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B8%E0%B8%87%29_1785892377875.pdf",
        "textLayer": "scanned",
        "pages": 23
      },
      {
        "kind": "invitation",
        "published": "2026-08-09T17:00:00Z",
        "filename": "7.3ประกาศเชิญชวน_(scan)_1786342172555.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/3a474219-e60f-45b9-bcd7-7a82efc47a70/7.3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99_%28scan%29_1786342172555.pdf",
        "textLayer": "scanned",
        "pages": 15
      }
    ],
    "publishedAt": "2026-07-13T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "2392692b-e393-45b2-a996-b21956b06e15",
    "projectNumber": "69069583353",
    "title": "จ้างเหมาส่งตรวจวิเคราะห์ทางห้องปฏิบัติการภายนอกโรงพยาบาล จำนวน ๗๗๕ รายการ",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลตากสิน",
    "budget": 12321032,
    "referencePrice": 12321032,
    "procurementMethod": "competitive",
    "procurementType": "จ้างทำของ/จ้างเหมาบริการ",
    "goodsCategory": "จ้างเหมางานบันทึกข้อมูล",
    "category": "dataEntry",
    "contractType": "hire",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/2392692b-e393-45b2-a996-b21956b06e15",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-12T17:00:00Z",
        "filename": "TOR_lab_นอก_ปีงบ_70_1783929172756.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/856a441c-1a06-49e4-baa3-81d089c7e521/TOR_lab_%E0%B8%99%E0%B8%AD%E0%B8%81_%E0%B8%9B%E0%B8%B5%E0%B8%87%E0%B8%9A_70_1783929172756.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-12T17:00:00Z",
        "filename": "ราคากลางต่ำสุด_ปีงบ_70_1783929235154.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/c6c754e8-d04a-4192-8494-892653190067/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%95%E0%B9%88%E0%B8%B3%E0%B8%AA%E0%B8%B8%E0%B8%94_%E0%B8%9B%E0%B8%B5%E0%B8%87%E0%B8%9A_70_1783929235154.pdf",
        "textLayer": "scanned",
        "pages": 18
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-12T17:00:00Z",
        "filename": "ร่าง_ประกวด_70_1783929336158.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/d943160d-dac1-460e-967e-607f50140e8b/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87_%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94_70_1783929336158.pdf",
        "textLayer": "scanned",
        "pages": 13
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-12T17:00:00Z",
        "filename": "ร่าง_ประกาศ_70_1783929383011.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/800b45bb-bbbb-4736-809e-d9b21407e7a7/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87_%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_70_1783929383011.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "invitation",
        "published": "2026-07-21T17:00:00Z",
        "filename": "เอกสารประกาศ+ประกวด_ปี70_1784691874347.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/1c517f99-7fa1-4ca9-9989-fa0a1cb035ab/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%2B%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94_%E0%B8%9B%E0%B8%B570_1784691874347.pdf",
        "textLayer": "scanned",
        "pages": 14
      }
    ],
    "publishedAt": "2026-07-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "69de3983-2971-4b96-b112-ede13d48d45c",
    "projectNumber": "69079363019",
    "title": "ซื้อยาที่มีผู้จำหน่ายเพียงรายเดียว รายการยา pembrolizumab ๑๐๐ mg/๔ mL solution for injection, ๔ mL vial (bundle ๒ vials) จำนวน ๓๐ ชิ้น สำหรับใช้ในปีงบประมาณ ๒๕๖๙ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 2918628.3,
    "referencePrice": 2918628.3,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 3,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/69de3983-2971-4b96-b112-ede13d48d45c",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-07-12T17:00:00Z",
        "filename": "ราคากลางยา_pembrolizumab_๑๐๐_mg๔_mL_solution_for_injection,_๔_mL_vial_(bundle_๒_vials)_1784253410486.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/d8cc3b7e-3701-4b0b-8eb5-7106e5611a93/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%A2%E0%B8%B2_pembrolizumab_%E0%B9%91%E0%B9%90%E0%B9%90_mg%E0%B9%94_mL_solution_for_injection%2C_%E0%B9%94_mL_vial_%28bundle_%E0%B9%92_vials%29_1784253410486.pdf",
        "textLayer": "digital",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-07-12T17:00:00Z",
        "filename": "คุณลักษณะเฉพาะยา_pembrolizumab_๑๐๐_mg๔_mL_solution_for_injection,_๔_mL_vial_(bundle_๒_vials)_1784253449069.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/eac45fb9-1620-457f-a41b-f00aa13821a0/%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%A2%E0%B8%B2_pembrolizumab_%E0%B9%91%E0%B9%90%E0%B9%90_mg%E0%B9%94_mL_solution_for_injection%2C_%E0%B9%94_mL_vial_%28bundle_%E0%B9%92_vials%29_1784253449069.pdf",
        "textLayer": "digital",
        "pages": 3
      }
    ],
    "publishedAt": "2026-07-12T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "fa5f1e26-635d-4afa-83b4-c2446fd3feb6",
    "projectNumber": "69079180190",
    "title": "ซื้อยานวัตกรรม Deferasirox ๒๕๐ mg dispersible tablet จำนวน ๔๐๐ กล่อง โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 160800,
    "referencePrice": 1407056,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 1,
    "status": "deliveredComplete",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/fa5f1e26-635d-4afa-83b4-c2446fd3feb6",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-07-07T17:00:00Z",
        "filename": "รายละเอียดคุณลักษณะเฉพาะของยานวัตกรรม_Deferasirox_๒๕๐_mg_dispersible_tablet_จำนวน_๔๐๐_กล่อง_1783566840812.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/94ef06fb-1243-4318-9731-adea8d08aa1d/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1_Deferasirox_%E0%B9%92%E0%B9%95%E0%B9%90_mg_dispersible_tablet_%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%99_%E0%B9%94%E0%B9%90%E0%B9%90_%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87_1783566840812.pdf",
        "textLayer": "digital",
        "pages": 1
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-07T17:00:00Z",
        "filename": "ราคากลางยานวัตกรรม_Deferasirox_๒๕๐_mg_dispersible_tablet_จำนวน_๔๐๐_กล่อง_1783567327226.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/b97c37e5-2662-4431-9b5c-20278a1e55ac/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1_Deferasirox_%E0%B9%92%E0%B9%95%E0%B9%90_mg_dispersible_tablet_%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%99_%E0%B9%94%E0%B9%90%E0%B9%90_%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87_1783567327226.pdf",
        "textLayer": "digital",
        "pages": 3
      }
    ],
    "publishedAt": "2026-07-07T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "40833000-7e38-41b8-9ee1-521759e3e5b9",
    "projectNumber": "69069352255",
    "title": "ประกวดราคาซื้อขวดอาหารเลี้ยงเชื้อแบคทีเรียในกระแสเลือดจำนวน ๑๙,๒๐๐ Tests ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 2294400,
    "referencePrice": 2294400,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 10,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/40833000-7e38-41b8-9ee1-521759e3e5b9",
    "documents": [
      {
        "kind": "referencePrice",
        "published": "2026-07-05T17:00:00Z",
        "filename": "4.2_Price_Hemo_Klang_70_1783321439360.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/03f79d35-aa7d-4077-afc1-035cbf639e95/4.2_Price_Hemo_Klang_70_1783321439360.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "tor",
        "published": "2026-07-05T17:00:00Z",
        "filename": "4.1_TOR_hemo_culture_2570_1783321516751.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/2fd5f1c2-d9d4-4baa-a80b-30f2066a1085/4.1_TOR_hemo_culture_2570_1783321516751.pdf",
        "textLayer": "scanned",
        "pages": 10
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-05T17:00:00Z",
        "filename": "6.3_ร่างเอกสารประกวดราคา_70_1783321802572.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/3c226e59-1cfa-47ca-b80b-eed3d438ab13/6.3_%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2_70_1783321802572.pdf",
        "textLayer": "scanned",
        "pages": 14
      },
      {
        "kind": "invitation",
        "published": "2026-07-15T17:00:00Z",
        "filename": "annoudoc_310000110000335_69069352255_1784175007484.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/0ce56df0-fb5f-4b56-b26c-21ffc8f9ce9a/annoudoc_310000110000335_69069352255_1784175007484.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-07-05T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "0e0f9e15-0192-432b-9f89-fe6debde585a",
    "projectNumber": "69059505169",
    "title": "ประกวดราคาซื้อเครื่องล้างเครื่องมือแพทย์แบบอัตโนมัติ 2 ประตู พร้อมระบบอบแห้ง ความจุไม่น้อยกว่า 490 ลิตร จำนวน 2 เครื่อง ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 6000000,
    "referencePrice": 6000000,
    "procurementMethod": "eBidding",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 9,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/0e0f9e15-0192-432b-9f89-fe6debde585a",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-06-29T17:00:00Z",
        "filename": "TOR-เครื่องล้างเครื่องมือแพทย์ฯ_1783064972537.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/e26900e3-5554-4db3-90c4-f7b495a24aae/TOR-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B8%AF_1783064972537.pdf",
        "textLayer": "scanned",
        "pages": 9
      },
      {
        "kind": "referencePrice",
        "published": "2026-06-29T17:00:00Z",
        "filename": "บก.06-เครื่องล้างเครื่องมือแพทย์ฯ_1783065037636.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/544981f8-543a-4b2c-9fb1-abe0443fa87e/%E0%B8%9A%E0%B8%81.06-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B8%AF_1783065037636.pdf",
        "textLayer": "scanned",
        "pages": 1
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-02T17:00:00Z",
        "filename": "ร่างประกาศ-เครื่องล้าง_490_ลิตร_1783065104444.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/32a25ddf-2e0d-427b-be9c-64a089e01803/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%87_490_%E0%B8%A5%E0%B8%B4%E0%B8%95%E0%B8%A3_1783065104444.pdf",
        "textLayer": "scanned",
        "pages": 15
      },
      {
        "kind": "invitation",
        "published": "2026-07-09T17:00:00Z",
        "filename": "ประกาศ_35-69_เครื่องล้าง_490_ลิตร_1783669397003.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/aac5ec60-9305-4804-acd8-6c9723a0bd98/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_35-69_%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%87_490_%E0%B8%A5%E0%B8%B4%E0%B8%95%E0%B8%A3_1783669397003.pdf",
        "textLayer": "scanned",
        "pages": 15
      }
    ],
    "publishedAt": "2026-06-29T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "d615c5e1-1f75-4722-8ac3-5b61b519c411",
    "projectNumber": "68109067589",
    "title": "โครงการปรับปรุงผิวจราจรและทางเท้าถนนกําแพงเพชร 6 ช่วงจากอุโมงค์บางซื่อ ถึงสุดเขตกรุงเทพมหานคร พื้นที่เขตจตุจักร เขตหลักสี่และเขตดอนเมือง",
    "agency": "สำนักการโยธา",
    "department": "สำนักงานก่อสร้างและบูรณะ",
    "budget": 77684000,
    "referencePrice": 0,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างก่อสร้าง",
    "goodsCategory": "ที่ดินและสิ่งก่อสร้าง",
    "category": "construction",
    "contractType": "construction",
    "torTextLayer": "scanned",
    "torPages": 7,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/d615c5e1-1f75-4722-8ac3-5b61b519c411",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-06-21T17:00:00Z",
        "filename": "TOR_กำแพงเพชร_6_1783565061161.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/a6906b08-bd74-46c6-a1a5-c2a3130ac389/TOR_%E0%B8%81%E0%B8%B3%E0%B9%81%E0%B8%9E%E0%B8%87%E0%B9%80%E0%B8%9E%E0%B8%8A%E0%B8%A3_6_1783565061161.pdf",
        "textLayer": "scanned",
        "pages": 7
      },
      {
        "kind": "referencePrice",
        "published": "2026-07-13T17:00:00Z",
        "filename": "ราคากลาง_1783565464942.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/52e3b508-d175-498a-b592-b67f2dd813b0/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1783565464942.pdf",
        "textLayer": "scanned",
        "pages": 2
      },
      {
        "kind": "draftBidding",
        "published": "2026-07-13T17:00:00Z",
        "filename": "ร่างประกาศและรายละเอียดประกวดราคา_กำแพงเพชร_6_1783996919229.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/318abf63-7b58-4e4b-bf16-3bb249295d7b/%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2_%E0%B8%81%E0%B8%B3%E0%B9%81%E0%B8%9E%E0%B8%87%E0%B9%80%E0%B8%9E%E0%B8%8A%E0%B8%A3_6_1783996919229.pdf",
        "textLayer": "digital",
        "pages": 18
      },
      {
        "kind": "invitation",
        "published": "2026-07-19T17:00:00Z",
        "filename": "BRW7440BBBD21EF_040501_1784539167566.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/eebede07-3a6f-4ea0-ac7a-a37e86203b48/BRW7440BBBD21EF_040501_1784539167566.pdf",
        "textLayer": "scanned",
        "pages": 18
      }
    ],
    "publishedAt": "2026-06-21T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "619a8c11-413f-4980-8c3f-43964163cc0c",
    "projectNumber": "69069131392",
    "title": "ซื้อเวชภัณฑ์ จำนวน ๗ รายการ สำหรับใช้ในปีงบประมาณ ๒๕๗๐ โดยวิธีเฉพาะเจาะจง",
    "agency": "สำนักการแพทย์",
    "department": "โรงพยาบาลกลาง",
    "budget": 3081942.4,
    "referencePrice": 3081942.4,
    "procurementMethod": "specific",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์วิทยาศาสตร์และการแพทย์",
    "category": "medical",
    "contractType": "purchase",
    "torTextLayer": "digital",
    "torPages": 10,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/619a8c11-413f-4980-8c3f-43964163cc0c",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-06-17T17:00:00Z",
        "filename": "1-1_คุณลักษณะเฉพาะ_1781751157611.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/28cfbd46-7b3d-4151-b5da-1a6ccf215e1f/1-1_%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0_1781751157611.pdf",
        "textLayer": "digital",
        "pages": 10
      },
      {
        "kind": "referencePrice",
        "published": "2026-06-17T17:00:00Z",
        "filename": "1-2_ตารางราคากลาง_1781751418598.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/21527260-c1b0-401f-8256-178dcd5065ac/1-2_%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_1781751418598.pdf",
        "textLayer": "digital",
        "pages": 2
      }
    ],
    "publishedAt": "2026-06-17T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "72dba409-dd7a-45cf-b42d-7c22fdf4d5d7",
    "projectNumber": "69049245958",
    "title": "จัดซื้อวัสดุครุภัณฑ์ที่ใช้ในการจัดกิจกรรมชุมชน ตามโครงการชุมชนเข้มแข็งพัฒนาตนเองตามหลักปรัชญาเศรษฐกิจพอเพียง โดยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักงานเขตลาดพร้าว",
    "department": null,
    "budget": 903350,
    "referencePrice": 622400,
    "procurementMethod": "competitive",
    "procurementType": "ซื้อ",
    "goodsCategory": "วัสดุครุภัณฑ์อื่นๆ",
    "category": "equipment",
    "contractType": "purchase",
    "torTextLayer": "scanned",
    "torPages": 14,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/72dba409-dd7a-45cf-b42d-7c22fdf4d5d7",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-04-26T17:00:00Z",
        "filename": "รายละเอียดคุณลักษณะ_1787309149255.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/3467d1fc-b1d4-4140-9d6d-fd07188cb856/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B8%B0_1787309149255.pdf",
        "textLayer": "scanned",
        "pages": 14
      },
      {
        "kind": "invitation",
        "published": "2026-04-30T17:00:00Z",
        "filename": "ประกาศเชิญชวน_compressed_(1)_1787309263452.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/dd0998da-5743-4188-9c90-966bd56075e4/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%A7%E0%B8%99_compressed_%281%29_1787309263452.pdf",
        "textLayer": "scanned",
        "pages": 30
      }
    ],
    "publishedAt": "2026-04-26T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  },
  {
    "id": "fd176cd1-1c68-40cd-a07d-a652d09ecb4e",
    "projectNumber": "69039339723",
    "title": "ประกวดราคาจ้างก่อสร้างโครงการจัดซ่อมไฟฟ้าส่องสว่างสาธารณะถนนราษฎร์อุทิศ และถนนเลียบวารี พื้นที่เขตมีนบุรีและเขตหนองจอก ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    "agency": "สำนักการโยธา",
    "department": null,
    "budget": 35742000,
    "referencePrice": 35742000,
    "procurementMethod": "eBidding",
    "procurementType": "จ้างก่อสร้าง",
    "goodsCategory": "วัสดุครุภัณฑ์ไฟฟ้าและวิทยุ",
    "category": "electrical",
    "contractType": "construction",
    "torTextLayer": "scanned",
    "torPages": 25,
    "status": "inProgress",
    "sourceUrl": "https://egp2.bangkok.go.th/project-detail/fd176cd1-1c68-40cd-a07d-a652d09ecb4e",
    "documents": [
      {
        "kind": "tor",
        "published": "2026-01-06T17:00:00Z",
        "filename": "TOR_1782190427878.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/2ff9502e-cacc-4406-aa47-215276883485/TOR_1782190427878.pdf",
        "textLayer": "scanned",
        "pages": 25
      },
      {
        "kind": "referencePrice",
        "published": "2026-08-06T17:00:00Z",
        "filename": "ราคากลางราษอุทิศ_1782190561829.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/863f44d0-c30d-4f4b-b604-ecfa4eb61588/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A9%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B4%E0%B8%A8_1782190561829.pdf",
        "textLayer": "scanned",
        "pages": 3
      },
      {
        "kind": "draftBidding",
        "published": "2026-08-06T17:00:00Z",
        "filename": "ราคากลาง_เลียบวารี_ล่าสุด_1786083962224.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/138a2c56-7ca7-489e-acd9-d7e3714699e5/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%81%E0%B8%A5%E0%B8%B2%E0%B8%87_%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%A7%E0%B8%B2%E0%B8%A3%E0%B8%B5_%E0%B8%A5%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B8%E0%B8%94_1786083962224.pdf",
        "textLayer": "scanned",
        "pages": 4
      },
      {
        "kind": "invitation",
        "published": "2026-08-13T17:00:00Z",
        "filename": "ปรกาศ_เลียบ_1786690694828.pdf",
        "url": "https://egp2.bangkok.go.th/api/file/66f9c9f7-3751-4b52-8c77-1f4e29801991/%E0%B8%9B%E0%B8%A3%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B8%A2%E0%B8%9A_1786690694828.pdf",
        "textLayer": "digital",
        "pages": 17
      }
    ],
    "publishedAt": "2026-01-06T17:00:00Z",
    "extractionIncomplete": false,
    "signalCount": 0
  }
];

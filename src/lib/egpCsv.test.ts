import { describe, expect, test } from "bun:test";
import { parseCsv, parseEgpCsv } from "./egpCsv";

// The shape of a real export: three title lines, a blank separator row, then
// the header. Row 2's title carries a comma, so e-GP quotes it.
const EXPORT = [
  "﻿ข้อมูลโครงการจัดซื้อจัดจ้าง ประจำปีงบประมาณ พ.ศ. 2570",
  "โครงการจัดซื้อจัดจ้าง โปรแกรม",
  'ประเภทประกาศ "ประกาศเชิญชวน"',
  ",,,,,,,,,",
  "ลำดับ,หน่วยงาน,จังหวัด,เลขที่โครงการ,ชื่อโครงการ,วันที่ประกาศเชิญชวน,วงเงินงบประมาณ(บาท),ราคากลาง(บาท),วันที่ประกาศผู้ชนะ,สถานะโครงการ",
  '1,กองยุทธศาสตร์ดิจิทัล,กรุงเทพมหานคร,69109071718,ประกวดราคาซื้อสิทธิ์การใช้งานโปรแกรม,09/10/2569,"3,415,700.00","3,415,700.00",,หนังสือเชิญชวน/ประกาศเชิญชวน',
  '2,การไฟฟ้าส่วนภูมิภาคอำเภอเซกา,กรุงเทพมหานคร,69109250539,"งานงดจ่ายไฟ กฟส.เซกา,กฟส.ในสังกัด",21/10/2569,"642,000.00","642,000.00",,ยกเลิกโครงการ',
  "",
].join("\r\n");

describe("parseCsv", () => {
  test("quoted commas, escaped quotes and newlines stay in their field", () => {
    expect(parseCsv('a,"b,c","say ""hi""","two\nlines"\nx,y')).toEqual([
      ["a", "b,c", 'say "hi"', "two\nlines"],
      ["x", "y"],
    ]);
  });
});

describe("parseEgpCsv", () => {
  test("finds the header below the title lines and reads each row", () => {
    const result = parseEgpCsv(EXPORT);
    expect(result?.skipped).toBe(0);
    expect(result?.projects).toEqual([
      {
        projectId: "69109071718",
        title: "ประกวดราคาซื้อสิทธิ์การใช้งานโปรแกรม",
        agency: "กองยุทธศาสตร์ดิจิทัล",
        province: "กรุงเทพมหานคร",
        status: "หนังสือเชิญชวน/ประกาศเชิญชวน",
      },
      {
        projectId: "69109250539",
        title: "งานงดจ่ายไฟ กฟส.เซกา,กฟส.ในสังกัด",
        agency: "การไฟฟ้าส่วนภูมิภาคอำเภอเซกา",
        province: "กรุงเทพมหานคร",
        status: "ยกเลิกโครงการ",
      },
    ]);
  });

  test("bad and repeated project numbers are skipped, not fatal", () => {
    const header = "เลขที่โครงการ,ชื่อโครงการ";
    const result = parseEgpCsv([header, "69109071718,a", "6910907171,b", "69109071718,c", ",,"].join("\n"));
    expect(result?.projects.map((p) => p.projectId)).toEqual(["69109071718"]);
    expect(result?.skipped).toBe(2);
  });

  test("a file with no project-number column is not an e-GP export", () => {
    expect(parseEgpCsv("name,email\nx,y")).toBeNull();
  });
});

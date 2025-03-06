import ExcelJS from "exceljs";

export async function readExcel(
    filePath: string,
  withHeader = false): Promise<string[][] | undefined> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
  
    // Get the first worksheet
    const worksheet = workbook.worksheets[0];
  
    if (!worksheet) {
      console.error("No worksheet found!");
      return;
    }
  
    const data: string[][] = [];
  
    // Iterate over rows starting from the second row (skipping the first row)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1 && withHeader) return; // Skip the header row
  
      let r = row.values as any;
  
      data.push([r[1].text ?? r[1], r[3].text ?? r[3]]); // Slice to remove the first empty index
    });
  
    return data;
  }
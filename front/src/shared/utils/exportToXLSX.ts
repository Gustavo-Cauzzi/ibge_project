import * as XLSX from "xlsx";

const exportToXLSX = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    autofitColumns(data, worksheet);

    const parsedFileName = fileName.endsWith(".xlsx") ? fileName : fileName + ".xlsx";

    XLSX.utils.book_append_sheet(workbook, worksheet, parsedFileName);
    XLSX.writeFile(workbook, parsedFileName);
};

export default exportToXLSX;

const autofitColumns = (json: any[], worksheet: XLSX.WorkSheet, header?: string[]) => {
    const jsonKeys = header ? header : Object.keys(json[0]);

    const objectMaxLength: any[] = [];
    json.forEach((value) => {
        jsonKeys.forEach((k, i) => {
            if (typeof value[k] === "number") {
                objectMaxLength[i] = 10;
            } else {
                const l = value[k] ? value[k].length : 0;

                objectMaxLength[i] = objectMaxLength[i] >= l ? objectMaxLength[i] : l;
            }
        });
    });

    const wscols = objectMaxLength.map((w) => {
        return { width: w + 1 };
    });

    worksheet["!cols"] = wscols;
};

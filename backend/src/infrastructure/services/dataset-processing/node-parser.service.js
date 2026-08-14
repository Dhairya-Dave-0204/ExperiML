import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import XLSX from "xlsx";

class NodeParserService {
  /**
   * Main dataset analysis entry point
   */
  async analyzeDataset({ filePath, datasetFormat }) {
    switch (datasetFormat) {
      case "CSV":
        return this.parseCSV(filePath);

      case "XLSX":
        return this.parseXLSX(filePath);

      case "PARQUET":
        return this.parseParquet(filePath);

      default:
        throw new Error(`Unsupported dataset format: ${datasetFormat}`);
    }
  }

  /**
   * CSV parser
   */
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const columns = [];
      let rowCount = 0;

      const sampleRows = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())

        .on("headers", (headers) => {
          columns.push(...headers);
        })

        .on("data", (row) => {
          rowCount++;

          /*
           * Store only a few rows
           * for datatype inference.
           */
          if (sampleRows.length < 10) {
            sampleRows.push(row);
          }
        })

        .on("end", () => {
          resolve({
            rowCount,

            columnCount: columns.length,

            metadata: {
              columns: this.generateColumnMetadata(columns, sampleRows),
            },
          });
        })

        .on("error", reject);
    });
  }

  /**
   * XLSX parser
   */
  async parseXLSX(filePath) {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet);

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return {
      rowCount: rows.length,

      columnCount: columns.length,

      metadata: {
        sheet: sheetName,

        columns: this.generateColumnMetadata(columns, rows.slice(0, 10)),
      },
    };
  }

  /**
   * PARQUET placeholder.
   *
   * Full support will move to:
   *
   * FastAPI + pyarrow
   */
  async parseParquet(filePath) {
    const exists = fs.existsSync(filePath);

    if (!exists) {
      throw new Error("Parquet file does not exist");
    }

    return {
      rowCount: null,

      columnCount: null,

      metadata: {
        processing: "Parquet processing will be handled by FastAPI",
      },
    };
  }

  /**
   * Generate basic column metadata.
   */
  generateColumnMetadata(columns, sampleRows) {
    return columns.map((column) => {
      const values = sampleRows
        .map((row) => row[column])
        .filter(
          (value) => value !== undefined && value !== null && value !== "",
        );

      return {
        name: column,

        type: this.inferType(values),

        nullable: values.length !== sampleRows.length,
      };
    });
  }

  /**
   * Basic datatype inference.
   */
  inferType(values) {
    if (values.length === 0) {
      return "unknown";
    }

    const allNumbers = values.every((value) => !isNaN(value) && value !== "");

    if (allNumbers) {
      return "number";
    }

    const allBooleans = values.every(
      (value) => value === "true" || value === "false",
    );

    if (allBooleans) {
      return "boolean";
    }

    return "string";
  }
}

export default NodeParserService;

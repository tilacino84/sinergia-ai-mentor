import { supabase } from "@/integrations/supabase/client";

export interface SheetData {
  range: string;
  majorDimension: string;
  values: string[][];
}

/**
 * Lee datos de Google Sheets
 * @param spreadsheetId - ID del spreadsheet (ej: "1Eh5ryU7cjsZW_TnMK6R1tVORfyKOb0QUwViOEoueUFM")
 * @param range - Rango a leer (ej: "Sheet1!A1:D10" o "A1:D10")
 */
export async function readGoogleSheet(
  spreadsheetId: string,
  range?: string
): Promise<SheetData> {
  const { data, error } = await supabase.functions.invoke('google-sheets', {
    body: { spreadsheetId, range }
  });

  if (error) {
    console.error('Error reading Google Sheets:', error);
    throw new Error(`Failed to read Google Sheets: ${error.message}`);
  }

  return data;
}

/**
 * Lee datos del spreadsheet configurado (1Eh5ryU7cjsZW_TnMK6R1tVORfyKOb0QUwViOEoueUFM)
 */
export async function readDefaultSheet(range?: string): Promise<SheetData> {
  return readGoogleSheet("1Eh5ryU7cjsZW_TnMK6R1tVORfyKOb0QUwViOEoueUFM", range);
}

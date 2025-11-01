import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { spreadsheetId, range } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the google-sheets function to get the data
    const { data: sheetData, error: sheetError } = await supabase.functions.invoke('google-sheets', {
      body: { spreadsheetId, range }
    });

    if (sheetError) {
      console.error('Error fetching sheet data:', sheetError);
      throw new Error(`Failed to fetch sheet data: ${sheetError.message}`);
    }

    if (!sheetData || !sheetData.values) {
      throw new Error('No data found in the sheet');
    }

    // Delete existing data for this sheet
    const { error: deleteError } = await supabase
      .from('sheet_data')
      .delete()
      .eq('sheet_id', spreadsheetId);

    if (deleteError) {
      console.error('Error deleting old data:', deleteError);
      throw new Error(`Failed to delete old data: ${deleteError.message}`);
    }

    // Prepare data for insertion
    const headers = sheetData.values[0] || [];
    const rows = sheetData.values.slice(1);

    const recordsToInsert = rows.map((row: string[], index: number) => {
      const rowData: Record<string, string> = {};
      headers.forEach((header: string, i: number) => {
        rowData[header] = row[i] || '';
      });

      return {
        sheet_id: spreadsheetId,
        row_number: index + 2, // +2 because first row is headers and sheets are 1-indexed
        data: rowData,
      };
    });

    // Insert new data
    const { error: insertError } = await supabase
      .from('sheet_data')
      .insert(recordsToInsert);

    if (insertError) {
      console.error('Error inserting data:', insertError);
      throw new Error(`Failed to insert data: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${recordsToInsert.length} rows`,
        rowCount: recordsToInsert.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in sync-sheet-data function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

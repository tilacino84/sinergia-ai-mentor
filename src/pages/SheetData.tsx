import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RefreshCw, ArrowLeft, Database } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SheetRecord {
  id: string;
  sheet_id: string;
  row_number: number;
  data: any;
  synced_at: string;
}

const SheetData = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SheetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);

  const SHEET_ID = "1Eh5ryU7cjsZW_TnMK6R1tVORfyKOb0QUwViOEoueUFM";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: records, error } = await supabase
        .from('sheet_data')
        .select('*')
        .eq('sheet_id', SHEET_ID)
        .order('row_number', { ascending: true });

      if (error) throw error;

      if (records && records.length > 0) {
        setData(records as SheetRecord[]);
        // Extract headers from first record
        const firstRecord = records[0];
        setHeaders(Object.keys(firstRecord.data as Record<string, any>));
      } else {
        setData([]);
        setHeaders([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('sync-sheet-data', {
        body: {
          spreadsheetId: SHEET_ID,
          range: 'A1:Z1000'
        }
      });

      if (error) throw error;

      toast.success(result.message || 'Datos sincronizados correctamente');
      fetchData();
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Error al sincronizar los datos');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Datos del Sheet</h1>
            </div>
          </div>
          
          <Button
            onClick={syncData}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos Sincronizados</CardTitle>
            <CardDescription>
              {data.length > 0 
                ? `${data.length} registros sincronizados`
                : 'No hay datos sincronizados. Haz clic en "Sincronizar" para cargar los datos del Google Sheet.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold">Fila</th>
                      {headers.map((header) => (
                        <th key={header} className="px-4 py-3 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 text-muted-foreground">{record.row_number}</td>
                        {headers.map((header) => (
                          <td key={header} className="px-4 py-3">
                            {(record.data as Record<string, any>)[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SheetData;

-- Tabla para almacenar los datos sincronizados del Google Sheet
CREATE TABLE public.sheet_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id TEXT NOT NULL,
  row_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_sheet_data_sheet_id ON public.sheet_data(sheet_id);
CREATE INDEX idx_sheet_data_synced_at ON public.sheet_data(synced_at);

-- RLS policies (datos públicos de lectura, solo admin puede escribir)
ALTER TABLE public.sheet_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sheet data"
  ON public.sheet_data
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert sheet data"
  ON public.sheet_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
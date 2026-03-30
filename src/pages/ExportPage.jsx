import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useExport } from '../hooks/useExport';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';

function ExportCard({ title, icon, description, format, onExport, loading, features }) {
  return (
    <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <div className="h-1 bg-ctt-red" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-ctt-red/10 flex items-center justify-center text-2xl">{icon}</div>
          <div>
            <h3 className="font-bold text-ctt-gray-900">{title}</h3>
            <span className="text-xs font-mono bg-ctt-gray-100 px-2 py-0.5 rounded text-ctt-gray-500">.{format}</span>
          </div>
        </div>
        <p className="text-sm text-ctt-gray-500 mb-4 leading-relaxed">{description}</p>
        <ul className="space-y-1 mb-5">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-ctt-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-ctt-red flex-none" />
              {f}
            </li>
          ))}
        </ul>
        <Button className="w-full justify-center" onClick={onExport} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/>
              </svg>
              A gerar...
            </span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M1 11h12v2H1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Exportar {format.toUpperCase()}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function ExportPage() {
  const { sessionId } = useParams();
  const { fetchSession } = useSession();
  const { loading, error, exportPPTX, exportPDF, exportHTML } = useExport();
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetchSession(sessionId).then(setSession);
  }, [sessionId]);

  const sessionName = session?.period || sessionId;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header session={session} />
      <div className="flex-1 overflow-y-auto bg-ctt-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="mb-8">
            <div className="text-xs font-semibold text-ctt-gray-400 uppercase tracking-wide mb-1">
              <Link to={`/session/${sessionId}/review`} className="hover:text-ctt-red transition-colors">← Revisão</Link>
            </div>
            <h1 className="text-3xl font-bold text-ctt-gray-900">Exportar sessão</h1>
            {session && <p className="text-sm text-ctt-gray-500 mt-1">{session.name}</p>}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExportCard
              title="PowerPoint"
              icon="📊"
              format="pptx"
              description="Apresentação completa com branding CTT. Inclui todos os produtos e dados preenchidos."
              features={[
                'Branding CTT com cor vermelho oficial',
                'Slide de capa, agenda e encerramento',
                '6 slides por produto',
                'Tabelas de revenue e KPIs formatadas',
              ]}
              onExport={() => exportPPTX(sessionId, sessionName)}
              loading={loading.pptx}
            />
            <ExportCard
              title="PDF"
              icon="📄"
              format="pdf"
              description="Documento PDF landscape, ideal para arquivo e partilha. Gerado via rendering HTML."
              features={[
                'Formato A4 landscape',
                'Cabeçalho e rodapé CTT',
                'Uma página por produto',
                'Print-friendly',
              ]}
              onExport={() => exportPDF(sessionId, sessionName)}
              loading={loading.pdf}
            />
            <ExportCard
              title="Dashboard HTML"
              icon="🌐"
              format="html"
              description="Dashboard interativo standalone. Não requer servidor — abre diretamente no browser."
              features={[
                'Ficheiro HTML self-contained',
                'Navegação por tabs por produto',
                'KPIs com destaque visual',
                'Print-friendly com @media print',
              ]}
              onExport={() => exportHTML(sessionId, sessionName)}
              loading={loading.html}
            />
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="font-semibold text-amber-800 text-sm mb-1">Nota sobre o export PDF</h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  O export PDF requer que o servidor backend esteja em execução (<code className="font-mono bg-amber-100 px-1 rounded">npm run server</code>) e que o <strong>puppeteer</strong> esteja instalado. Na primeira execução pode demorar alguns segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

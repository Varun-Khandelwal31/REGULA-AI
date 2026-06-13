import { useState, useRef } from 'react';
import { Upload, FileText, Download, Eye, RefreshCw, Search, X, Check, AlertTriangle, File, Loader2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  tags: string[];
  date: string;
  status: 'analyzed' | 'pending' | 'uploading';
  progress?: number;
  size?: string;
}

const Vault = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'GSTR-3B_June_2025.pdf', type: 'GST', tags: ['GSTR-3B', 'FY 2025-26'], date: '2025-07-15', status: 'analyzed', size: '245 KB' },
    { id: '2', name: 'GST_Registration_Certificate.pdf', type: 'GST', tags: ['Registration'], date: '2025-01-10', status: 'analyzed', size: '180 KB' },
    { id: '3', name: 'EPF_Annual_Return_2024-25.pdf', type: 'EPFO', tags: ['EPF', 'Annual Return'], date: '2025-05-20', status: 'analyzed', size: '512 KB' },
    { id: '4', name: 'Income_Tax_Notice.pdf', type: 'Notice', tags: ['Income Tax', 'Notice', 'Section 143(1)'], date: '2025-06-05', status: 'analyzed', size: '89 KB' },
    { id: '5', name: 'FSSAI_License.pdf', type: 'FSSAI', tags: ['License', 'FSSAI'], date: '2024-12-01', status: 'analyzed', size: '156 KB' },
    { id: '6', name: 'Udyam_Certificate.pdf', type: 'Udyam', tags: ['MSME', 'Udyam'], date: '2024-11-15', status: 'analyzed', size: '92 KB' },
    { id: '7', name: 'GSTR-1_Q1_2025-26.pdf', type: 'GST', tags: ['GSTR-1', 'FY 2025-26'], date: '2025-07-14', status: 'analyzed', size: '378 KB' },
    { id: '8', name: 'ESI_Contribution_May_2025.pdf', type: 'ESI', tags: ['ESI', 'Contribution'], date: '2025-06-10', status: 'pending', size: '145 KB' },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [analyzingDoc, setAnalyzingDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === 'All' || doc.type === filter;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        name: file.name,
        type: detectType(file.name),
        tags: [],
        date: new Date().toISOString().split('T')[0],
        status: 'uploading',
        progress: 0,
        size: formatFileSize(file.size),
      };
      setDocuments(prev => [newDoc, ...prev]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Start analyzing
          setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'pending', progress: 100 } : d));
          setAnalyzingDoc(newDoc.id);

          // Simulate analysis
          setTimeout(() => {
            const tags = autoTag(file.name);
            setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'analyzed', tags } : d));
            setAnalyzingDoc(null);
          }, 2000 + Math.random() * 1000);
        } else {
          setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, progress } : d));
        }
      }, 200);
    });
  };

  const detectType = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('gstr') || lower.includes('gst')) return 'GST';
    if (lower.includes('epf') || lower.includes('pf')) return 'EPFO';
    if (lower.includes('esi')) return 'ESI';
    if (lower.includes('mca') || lower.includes('form ')) return 'MCA';
    if (lower.includes('fssai') || lower.includes('food')) return 'FSSAI';
    if (lower.includes('udyam') || lower.includes('msme')) return 'Udyam';
    if (lower.includes('notice')) return 'Notice';
    return 'Document';
  };

  const autoTag = (filename: string): string[] => {
    const tags: string[] = [];
    const lower = filename.toLowerCase();
    if (lower.includes('gstr-1')) tags.push('GSTR-1');
    else if (lower.includes('gstr-3b')) tags.push('GSTR-3B');
    else if (lower.includes('gstr')) tags.push('GSTR');
    if (lower.includes('2025') || lower.includes('2025-26')) tags.push('FY 2025-26');
    if (lower.includes('epf')) tags.push('EPF');
    if (lower.includes('esi')) tags.push('ESI');
    if (lower.includes('notice')) tags.push('Notice');
    if (tags.length === 0) tags.push('Document');
    return tags;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const reanalyze = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'pending', tags: [] } : d));
    setAnalyzingDoc(id);

    setTimeout(() => {
      const doc = documents.find(d => d.id === id);
      if (doc) {
        const tags = autoTag(doc.name);
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'analyzed', tags } : d));
      }
      setAnalyzingDoc(null);
    }, 2000);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setSelectedDoc(null);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      GST: 'bg-primary/10 text-primary',
      EPFO: 'bg-purple-100 text-purple-600',
      ESI: 'bg-orange-100 text-orange-600',
      MCA: 'bg-green-100 text-green-600',
      FSSAI: 'bg-pink-100 text-pink-600',
      Udyam: 'bg-indigo-100 text-indigo-600',
      Notice: 'bg-red-100 text-red-600',
      Document: 'bg-gray-100 text-gray-600',
    };
    return colors[type] || colors.Document;
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return '📄';
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return '📊';
    if (name.endsWith('.docx') || name.endsWith('.doc')) return '📝';
    if (name.endsWith('.jpg') || name.endsWith('.png')) return '🖼️';
    return '📎';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Document Vault</h1>
        <p className="text-text-secondary mt-1">
          All your compliance documents, auto-organized and analyzed with AI
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-card p-8 text-center transition ${
          dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
          onChange={e => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-primary' : 'text-text-tertiary'}`} />
        <p className="text-text-secondary mb-2">
          Drop your circulars, notices, or returns here
        </p>
        <p className="text-sm text-text-tertiary mb-4">
          Supported: PDF, Word, Excel, Images • Auto-analyzed with AI
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
        >
          Browse Files
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-text-primary">{documents.length}</div>
          <div className="text-sm text-text-tertiary">Total Documents</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-green">{documents.filter(d => d.status === 'analyzed').length}</div>
          <div className="text-sm text-text-tertiary">Analyzed</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-amber">{documents.filter(d => d.status === 'pending' || d.status === 'uploading').length}</div>
          <div className="text-sm text-text-tertiary">Processing</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-primary">{new Set(documents.map(d => d.type)).size}</div>
          <div className="text-sm text-text-tertiary">Categories</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-card shadow-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'GST', 'MCA', 'EPFO', 'Notice', 'Filed Returns'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:bg-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className={`bg-white rounded-card shadow-card overflow-hidden transition hover:shadow-card-hover ${
              selectedDoc?.id === doc.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Uploading progress */}
            {doc.status === 'uploading' && (
              <div className="h-1 bg-border">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${doc.progress || 0}%` }}
                />
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getFileIcon(doc.name)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary truncate">{doc.name}</h3>

                  {/* Tags */}
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Analyzing indicator */}
                  {analyzingDoc === doc.id && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing with AI...
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-sm">
                    <span className={getTypeColor(doc.type)}>{doc.type}</span>
                    <span className="text-text-tertiary">{doc.date}</span>
                    {doc.size && <span className="text-text-tertiary">{doc.size}</span>}
                    <span
                      className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                        doc.status === 'analyzed'
                          ? 'bg-accent-green/10 text-accent-green'
                          : doc.status === 'uploading'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent-amber/10 text-accent-amber'
                      }`}
                    >
                      {doc.status === 'analyzed' && <Check className="w-3 h-3" />}
                      {doc.status === 'analyzed' ? 'Analyzed' : doc.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex-1 px-3 py-2 bg-surface text-text-secondary rounded-lg text-sm hover:bg-border transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  disabled
                  className="flex-1 px-3 py-2 bg-surface text-text-secondary rounded-lg text-sm hover:bg-border transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                {(doc.status === 'pending' || doc.status === 'analyzed') && analyzingDoc !== doc.id && (
                  <button
                    onClick={() => reanalyze(doc.id)}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          No documents found matching your criteria
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-card max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Document Details</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getFileIcon(selectedDoc.name)}</div>
                <div>
                  <h4 className="font-medium text-text-primary">{selectedDoc.name}</h4>
                  <div className="text-sm text-text-tertiary">{selectedDoc.size || 'Unknown size'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-text-tertiary">Type</div>
                  <div className={`inline-block mt-1 px-2 py-1 rounded ${getTypeColor(selectedDoc.type)}`}>
                    {selectedDoc.type}
                  </div>
                </div>
                <div>
                  <div className="text-text-tertiary">Uploaded</div>
                  <div className="font-medium">{selectedDoc.date}</div>
                </div>
                <div>
                  <div className="text-text-tertiary">Status</div>
                  <div className="font-medium text-accent-green">Analyzed & Organized</div>
                </div>
              </div>

              {selectedDoc.tags.length > 0 && (
                <div>
                  <div className="text-text-tertiary text-sm mb-2">AI-Detected Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="flex-1 px-4 py-2 bg-surface text-text-secondary rounded-lg font-medium hover:bg-border transition"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteDocument(selectedDoc.id)}
                  className="px-4 py-2 bg-accent-red text-white rounded-lg font-medium hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Vault;

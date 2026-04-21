"use client";

import { Upload, Search, Grid, List as ListIcon, Trash2, Image as ImageIcon, Video, FileText, MoreVertical, ExternalLink, Filter, CheckSquare, X, Info, Download, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function MediaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState('All');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [previewAsset, setPreviewAsset] = useState<any>(null);
  const [ingestMode, setIngestMode] = useState<'upload' | 'url'>('upload');
  const [assetUrl, setAssetUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("http://localhost:5000/api/media");
        if (res.ok) {
          const data = await res.json();
          setImages(data.media || []);
        }
      } catch (err) {
        console.error("Failed to fetch media:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'mp4' || ext === 'mov') return <Video size={18} className="text-purple-500" />;
    if (ext === 'pdf' || ext === 'doc') return <FileText size={18} className="text-blue-500" />;
    return <ImageIcon size={18} className="text-emerald-500" />;
  };

  const handleIngestUrl = async () => {
    if (!assetUrl) return;
    setIsProcessing(true);
    try {
      // Extract name from URL if customName is not provided
      const fileName = customName.trim() || assetUrl.split('/').pop()?.split('?')[0] || 'remote-asset';
      const fileExt = assetUrl.split('/').pop()?.split('?')[0]?.split('.').pop()?.toLowerCase() || '';
      
      const payload = {
        name: fileName + (customName.trim() && !customName.includes('.') ? `.${fileExt}` : ''),
        url: assetUrl,
        size: 'Remote',
        type: ['mp4', 'mov'].includes(fileExt) ? 'Video' : ['pdf', 'doc'].includes(fileExt) ? 'Doc' : 'Image'
      };

      const res = await fetch("http://localhost:5000/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setImages([data.asset, ...images]);
        setIsModalOpen(false);
        setAssetUrl('');
        setCustomName('');
      } else {
        alert("Failed to ingest asset from URL.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing URL.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Are you sure you want to purge this asset?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        if (previewAsset?.id === id) setPreviewAsset(null);
        setSelectedAssets(selectedAssets.filter(a => a !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMedia = images.filter(img => {
    if (filterType === 'All') return true;
    const ext = img.name.split('.').pop()?.toLowerCase();
    if (filterType === 'Images') return ['jpg', 'png', 'svg', 'webp', 'jpeg'].includes(ext!);
    if (filterType === 'Videos') return ['mp4', 'mov'].includes(ext!);
    if (filterType === 'Docs') return ['pdf', 'doc', 'txt'].includes(ext!);
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold font-sans">Digital Asset Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Universal storage and optimization for marketing collateral.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedAssets.length > 0 && (
             <button className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:bg-red-600 transition-colors">
                <Trash2 size={18} /> Delete {selectedAssets.length}
             </button>
          )}
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95">
            <Upload size={20} />
            Ingest New Asset
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0f0f0f] p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex gap-2">
           {['All', 'Images', 'Videos', 'Docs'].map((t) => (
             <button 
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
             >
                {t}
             </button>
           ))}
        </div>

        <div className="flex-1 max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search vault keywords..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-2 bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-slate-200 border-t-black dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-in fade-in duration-500">
          {filteredMedia.map((img) => (
            <div 
              key={img.id} 
              className={`group relative rounded-[28px] overflow-hidden bg-white dark:bg-[#0f0f0f] border-2 shadow-sm aspect-[4/5] flex flex-col transition-all duration-300 ${selectedAssets.includes(img.id) ? 'border-blue-500 ring-4 ring-blue-500/10 scale-[0.98]' : 'border-slate-200 dark:border-white/10 hover:border-black dark:hover:border-white'}`}
            >
              <div className="flex-1 bg-slate-100 dark:bg-white/5 relative overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => setPreviewAsset(img)}>
                {img.name.endsWith(".mp4") || img.name.endsWith(".mov") ? (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center animate-pulse">
                       <Video size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Motion Asset</span>
                  </div>
                ) : (
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                   <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"><Maximize2 size={18}/></button>
                   <p className="text-[10px] font-bold text-white uppercase tracking-widest px-3 py-1 bg-white/20 rounded-full">Used in 3 Campaigns</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSelect(img.id); }}
                  className={`absolute top-4 left-4 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedAssets.includes(img.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/20 border-white/40 opacity-0 group-hover:opacity-100'}`}
                >
                  <CheckSquare size={14} />
                </button>
              </div>
              <div className="p-4 bg-white dark:bg-[#0f0f0f] border-t border-slate-100 dark:border-white/10">
                <p className="text-xs font-black truncate uppercase tracking-tight" title={img.name}>{img.name}</p>
                <div className="flex justify-between items-center mt-2">
                   <p className="text-[10px] font-bold text-slate-400">{img.size} • {getFileIcon(img.name).props.children?.type === Video ? '4K' : 'PNG'}</p>
                   <button onClick={(e) => { e.stopPropagation(); handleDeleteMedia(img.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0f0f0f] rounded-[32px] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm animate-in slide-in-from-bottom-5">
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <tr>
                    <th className="px-6 py-4 w-12"><CheckSquare size={14} /></th>
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Type/Size</th>
                    <th className="px-6 py-4">Usage</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                 {filteredMedia.map((img) => (
                   <tr key={img.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <input 
                           type="checkbox" 
                           checked={selectedAssets.includes(img.id)}
                           onChange={() => toggleSelect(img.id)}
                           className="w-4 h-4 accent-black dark:accent-white"
                        />
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3 font-bold">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 overflow-hidden shrink-0">
                            <img src={img.url} className="w-full h-full object-cover" />
                         </div>
                         {img.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500">{getFileIcon(img.name)} {img.size}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded text-[10px] font-bold uppercase">3 Campaigns</span></td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => handleDeleteMedia(img.id)} className="p-2 transition-colors hover:text-red-500"><Trash2 size={16} /></button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {/* Upload Modal Upgrade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-xl rounded-[40px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 fill-mode-both duration-300">
            <div className="p-10 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div>
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase">ASSET INGESTION</h2>
                 <p className="text-[10px] text-slate-400 font-mono mt-1">Multi-Format Gateway v3.0</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 shadow-sm">&times;</button>
            </div>
            <div className="px-10 py-6 border-b border-slate-100 dark:border-white/10 flex gap-4">
               <button 
                onClick={() => setIngestMode('upload')}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${ingestMode === 'upload' ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 Local Upload
               </button>
               <button 
                onClick={() => setIngestMode('url')}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${ingestMode === 'url' ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 Remote Ingestion (URL)
               </button>
            </div>

            <div className="p-10">
               {ingestMode === 'upload' ? (
                 <div className="border-4 border-dashed border-slate-100 dark:border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black dark:hover:border-white transition-all bg-slate-50/50 dark:bg-white/5 group relative">
                   <div className="absolute inset-4 border-2 border-white/5 rounded-[32px] pointer-events-none group-hover:border-black/5 dark:group-hover:border-white/20 transition-all"></div>
                   <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-[32px] flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                     <Upload size={32} />
                   </div>
                   <h3 className="text-xl font-black italic mb-2 uppercase">Ready for Payload</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Drag assets here or tap to explore local filesystem.</p>
                   <div className="mt-8 flex gap-3">
                      <span className="px-3 py-1 bg-white dark:bg-white/10 shadow-sm rounded-lg text-[10px] font-black uppercase text-slate-400">4K Video</span>
                      <span className="px-3 py-1 bg-white dark:bg-white/10 shadow-sm rounded-lg text-[10px] font-black uppercase text-slate-400">RAW PNG</span>
                      <span className="px-3 py-1 bg-white dark:bg-white/10 shadow-sm rounded-lg text-[10px] font-black uppercase text-slate-400">Vector SVG</span>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset URL</label>
                       <input 
                        type="url" 
                        value={assetUrl}
                        onChange={(e) => setAssetUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg" 
                        className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[28px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Alias (Optional Name)</label>
                       <input 
                        type="text" 
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Q4 Marketing Header" 
                        className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[28px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner"
                       />
                    </div>
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex gap-4">
                       <Info size={24} className="text-blue-500 shrink-0" />
                       <p className="text-xs font-bold text-slate-500 leading-relaxed">
                          Enter a direct link to an image (jpg, png, svg), video (mp4, mov), or document (pdf, doc). We will automatically detect format and metadata.
                       </p>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-10 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4 bg-slate-50 dark:bg-white/5">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Abort</button>
              {ingestMode === 'upload' ? (
                <button disabled className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-sm font-black opacity-40 uppercase tracking-widest shadow-xl">
                  Waiting for Selection...
                </button>
              ) : (
                <button 
                  onClick={handleIngestUrl}
                  disabled={!assetUrl || isProcessing}
                  className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  {isProcessing ? 'Processing...' : 'Transfer to Vault'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
           <button onClick={() => setPreviewAsset(null)} className="absolute top-8 right-8 text-white hover:text-red-500 transition-colors bg-white/10 p-3 rounded-full border border-white/20"><X size={32}/></button>
           <div className="max-w-6xl w-full h-[80vh] flex flex-col md:flex-row gap-10">
              <div className="flex-[3] bg-black/40 rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center relative group">
                 {previewAsset.name.endsWith('.mp4') ? (
                   <Video size={100} className="text-white/20 animate-pulse" />
                 ) : (
                   <img src={previewAsset.url} className="w-full h-full object-contain" />
                 )}
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:scale-105 transition-all"><Download size={16}/> Download RAW</button>
                    <button className="bg-white/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/30 transition-all"><ExternalLink size={16}/> Open Origin</button>
                 </div>
              </div>
              <div className="flex-[1] flex flex-col justify-center space-y-8 animate-in slide-in-from-right-10 duration-500">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Asset Identity</p>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase break-all">{previewAsset.name}</h2>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Payload Size</p>
                       <p className="text-xl font-bold text-white">{previewAsset.size}</p>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Resolution</p>
                       <p className="text-xl font-bold text-white">4096 x 2160</p>
                    </div>
                 </div>
                 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
                    <div className="flex items-center gap-3">
                       <Info size={18} className="text-indigo-500" />
                       <p className="text-xs font-bold text-slate-300">Currently deployed in <span className="text-white">3 Campaigns</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckSquare size={18} className="text-emerald-500" />
                       <p className="text-xs font-bold text-slate-300">Optimized for <span className="text-white">Web Stream</span></p>
                    </div>
                 </div>
                 <button onClick={() => handleDeleteMedia(previewAsset.id)} className="w-full py-4 border-2 border-red-500 text-red-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Trash2 size={18} /> Purge from Vault
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

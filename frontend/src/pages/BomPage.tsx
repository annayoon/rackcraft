import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { importBom, getSampleBom, type BomItem } from '../api/bom'
import './BomPage.css'

const CATEGORY_COLORS: Record<string, string> = {
  'IT 장비': '#3b82f6',
  '기반시설': '#10b981',
}

export default function BomPage() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [source, setSource] = useState<string>('')

  const { data, isLoading } = useQuery({
    queryKey: ['bom'],
    queryFn: () => null,
    enabled: false,
  })

  const [items, setItems] = useState<BomItem[]>([])

  const importMut = useMutation({
    mutationFn: importBom,
    onSuccess: (res) => {
      setItems(res.items)
      setWarnings(res.warnings)
      setSource(res.source)
    },
  })

  const sampleMut = useMutation({
    mutationFn: getSampleBom,
    onSuccess: (res) => {
      setItems(res.items)
      setWarnings(res.warnings)
      setSource('sample')
    },
  })

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) importMut.mutate(file)
  }

  const totalPowerKw = items
    .filter(i => i.unit_power_w)
    .reduce((sum, i) => sum + (i.unit_power_w! * i.quantity) / 1000, 0)

  const grouped = items.reduce<Record<string, BomItem[]>>((acc, item) => {
    const key = `${item.category} / ${item.subcategory}`
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {})

  const isPending = importMut.isPending || sampleMut.isPending

  return (
    <div className="bom-page">
      <div className="bom-header">
        <div>
          <h2>BOM Import</h2>
          <p className="bom-subtitle">PPTX · Excel · CSV · PDF 파일을 업로드하거나 샘플을 불러오세요</p>
        </div>
        <div className="bom-actions">
          <button className="btn-secondary" onClick={() => sampleMut.mutate()} disabled={isPending}>
            샘플 불러오기
          </button>
          <button className="btn-primary" onClick={() => fileRef.current?.click()} disabled={isPending}>
            파일 업로드
          </button>
          <input ref={fileRef} type="file" accept=".pptx,.xlsx,.xls,.csv,.pdf" hidden onChange={handleFile} />
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="bom-warnings">
          {warnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="bom-stats">
            <div className="stat-card">
              <span className="stat-value">{items.length}</span>
              <span className="stat-label">항목 수</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{items.reduce((s, i) => s + i.quantity, 0)}</span>
              <span className="stat-label">총 수량</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totalPowerKw.toFixed(0)} kW</span>
              <span className="stat-label">총 전력 (IT)</span>
            </div>
            <div className="stat-card">
              <span className="stat-label source">출처: {source}</span>
            </div>
          </div>

          <div className="bom-table-wrap">
            {Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group} className="bom-group">
                <div className="bom-group-header">
                  <span
                    className="bom-category-dot"
                    style={{ background: CATEGORY_COLORS[groupItems[0].category] || '#6b7280' }}
                  />
                  {group}
                </div>
                <table className="bom-table">
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Qty</th>
                      <th>전력 (W/unit)</th>
                      <th>높이 (U)</th>
                      <th>총 전력 (kW)</th>
                      <th>설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupItems.map(item => (
                      <tr key={item.id}>
                        <td className="eq-name">{item.equipment}</td>
                        <td className="center">{item.quantity}</td>
                        <td className="center">{item.unit_power_w ?? '—'}</td>
                        <td className="center">{item.unit_height_u ?? '—'}</td>
                        <td className="center power-val">
                          {item.unit_power_w
                            ? ((item.unit_power_w * item.quantity) / 1000).toFixed(1)
                            : '—'}
                        </td>
                        <td className="desc">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}

      {items.length === 0 && !isPending && (
        <div className="bom-empty">
          <p>파일을 업로드하거나 샘플을 불러오세요</p>
          <p className="bom-formats">지원 형식: .pptx · .xlsx · .csv · .pdf</p>
        </div>
      )}

      {isPending && <div className="bom-loading">파싱 중...</div>}
    </div>
  )
}

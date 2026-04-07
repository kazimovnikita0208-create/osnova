import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, MapPin, Plus, Trash2, Star, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/addresses')({
  component: AddressesPage,
})

interface Address {
  id: string
  street: string
  apartment: string
  entrance?: string
  floor?: string
  comment?: string
  isDefault: boolean
}

const initialAddresses: Address[] = [
  {
    id: 'addr-1',
    street: 'ул. Большая Ордынка, 25',
    apartment: 'кв. 12',
    entrance: '2',
    floor: '3',
    isDefault: true,
  },
  {
    id: 'addr-2',
    street: 'Пречистенская набережная, 15',
    apartment: 'офис 301',
    comment: 'Вход со двора',
    isDefault: false,
  },
]

function AddressesPage() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    street: '',
    apartment: '',
    entrance: '',
    floor: '',
    comment: '',
  })

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
  }

  const handleAdd = () => {
    if (!formData.street.trim()) return

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      street: formData.street.trim(),
      apartment: formData.apartment.trim(),
      entrance: formData.entrance.trim() || undefined,
      floor: formData.floor.trim() || undefined,
      comment: formData.comment.trim() || undefined,
      isDefault: addresses.length === 0,
    }

    setAddresses((prev) => [...prev, newAddr])
    setFormData({ street: '', apartment: '', entrance: '', floor: '', comment: '' })
    setShowForm(false)
  }

  const inputClass =
    'w-full px-4 py-3.5 bg-[#FCF9F0] rounded-2xl text-sm text-[#1c1c17] placeholder:text-[#6b6960]/50 outline-none transition-shadow focus:ring-2 focus:ring-[#384527]/10'

  return (
    <div className="flex flex-col min-h-[calc(100dvh-56px)] pb-24">
      {/* Header */}
      <div className="px-5 pt-3 pb-1 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/profile' })}
          className="w-10 h-10 shrink-0 rounded-xl bg-[#f0ede4] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-[#384527]" />
        </button>
        <div>
          <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-[0.15em]">
            Доставка
          </p>
          <h1 className="font-heading text-xl font-bold text-[#1c1c17] -mt-0.5">Мои адреса</h1>
        </div>
      </div>

      {/* Address list */}
      <div className="px-4 mt-4 space-y-3">
        {addresses.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="flex items-center justify-center mb-5 rounded-full"
              style={{
                width: 72,
                height: 72,
                background: 'linear-gradient(135deg, #384527, #4f5d3d)',
                boxShadow: '0 8px 24px rgba(56,69,39,0.2)',
              }}
            >
              <MapPin className="w-8 h-8 text-[#FCF9F0]" />
            </div>
            <h2 className="font-heading text-xl font-bold text-[#1c1c17] mb-1.5">
              Адресов пока нет
            </h2>
            <p className="text-sm text-[#6b6960] leading-relaxed max-w-[240px]">
              Добавьте адрес для быстрого оформления доставки
            </p>
          </div>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-2xl p-4 ${
              addr.isDefault ? '' : 'bg-[#f0ede4]'
            }`}
            style={
              addr.isDefault
                ? { background: 'linear-gradient(135deg, #384527, #4f5d3d)' }
                : undefined
            }
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  addr.isDefault ? 'bg-[#FCF9F0]/10' : 'bg-[#FCF9F0]'
                }`}
              >
                <MapPin className={`w-[18px] h-[18px] ${addr.isDefault ? 'text-[#FCF9F0]' : 'text-[#384527]'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold truncate ${addr.isDefault ? 'text-[#FCF9F0]' : 'text-[#1c1c17]'}`}>
                    {addr.street}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#FCF9F0]/15 text-[#FCF9F0] shrink-0">
                      <Star className="w-2.5 h-2.5" fill="currentColor" />
                      Основной
                    </span>
                  )}
                </div>
                <p className={`text-[12px] mt-1 leading-snug ${addr.isDefault ? 'text-[#FCF9F0]/60' : 'text-[#6b6960]'}`}>
                  {addr.apartment}
                  {addr.entrance ? ` · подъезд ${addr.entrance}` : ''}
                  {addr.floor ? ` · ${addr.floor} этаж` : ''}
                </p>
                {addr.comment && (
                  <p className={`text-[12px] mt-1.5 italic leading-snug ${addr.isDefault ? 'text-[#FCF9F0]/40' : 'text-[#6b6960]/60'}`}>
                    {addr.comment}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 ml-[54px]">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FCF9F0] text-[11px] font-semibold text-[#384527] active:scale-95 transition-transform"
                >
                  <Star className="w-3 h-3" />
                  Сделать основным
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold active:scale-95 transition-transform ${
                  addr.isDefault
                    ? 'bg-[#FCF9F0]/10 text-[#FCF9F0]/70'
                    : 'text-[#9D4048]'
                }`}
                style={!addr.isDefault ? { background: 'rgba(157,64,72,0.08)' } : undefined}
              >
                <Trash2 className="w-3 h-3" />
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add address form */}
      {showForm && (
        <div className="px-4 mt-4">
          <div className="bg-[#f0ede4] rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-heading text-base font-bold text-[#1c1c17]">Новый адрес</p>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-xl bg-[#FCF9F0] flex items-center justify-center active:scale-95 transition-transform"
              >
                <X className="w-4 h-4 text-[#6b6960]" />
              </button>
            </div>

            <input
              value={formData.street}
              onChange={(e) => setFormData((f) => ({ ...f, street: e.target.value }))}
              placeholder="Улица, дом"
              className={inputClass}
            />
            <input
              value={formData.apartment}
              onChange={(e) => setFormData((f) => ({ ...f, apartment: e.target.value }))}
              placeholder="Квартира / офис"
              className={inputClass}
            />

            <div className="flex gap-3">
              <input
                value={formData.entrance}
                onChange={(e) => setFormData((f) => ({ ...f, entrance: e.target.value }))}
                placeholder="Подъезд"
                className={`${inputClass} flex-1`}
              />
              <input
                value={formData.floor}
                onChange={(e) => setFormData((f) => ({ ...f, floor: e.target.value }))}
                placeholder="Этаж"
                className={`${inputClass} flex-1`}
              />
            </div>

            <input
              value={formData.comment}
              onChange={(e) => setFormData((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Комментарий для курьера"
              className={inputClass}
            />

            <button
              onClick={handleAdd}
              disabled={!formData.street.trim()}
              className="w-full flex items-center justify-center gap-2 text-[#FCF9F0] font-semibold py-3.5 rounded-2xl mt-1 active:scale-[0.98] transition-transform disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #384527, #4f5d3d)',
                boxShadow: '0 8px 24px rgba(56,69,39,0.2)',
              }}
            >
              Сохранить адрес
            </button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <div className="px-4 mt-5">
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#f0ede4] text-sm font-semibold text-[#384527] active:scale-[0.98] transition-transform"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)' }}
            >
              <Plus className="w-4 h-4 text-[#FCF9F0]" />
            </div>
            Добавить адрес
          </button>
        </div>
      )}
    </div>
  )
}

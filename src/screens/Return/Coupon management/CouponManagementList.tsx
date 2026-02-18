import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AddButton from '../../../component/AddButton'

type Coupon = {
  id: number
  code: string
  description: string
  dateRange: string
  status: 'Active' | 'Inactive'
}

const coupons: Coupon[] = [
  {
    id: 1,
    code: 'SAVE10',
    description: '10% off on all electronic products',
    dateRange: '3 July to 5 July',
    status: 'Active'
  },
  {
    id: 2,
    code: 'SAVE10',
    description: '10% off on all electronic products',
    dateRange: '3 July to 5 July',
    status: 'Active'
  },
  {
    id: 3,
    code: 'SAVE10',
    description: '10% off on all electronic products',
    dateRange: '3 July to 5 July',
    status: 'Active'
  },
  {
    id: 4,
    code: 'SAVE10',
    description: '10% off on all electronic products',
    dateRange: '3 July to 5 July',
    status: 'Active'
  }
]

const CouponManagementList = () => {
    const navigate = useNavigate();
  const { id } = useParams()
  const isEdit = Boolean(id)

  return (
    <div className="bg-white shadow-sm p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Coupon Management</h2>
        <AddButton
           label="Add New Coupon"
            type="button"
            onClick={() => navigate("/CreateCouponManagement")}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{coupon.code}</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
                {coupon.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-2">
              {coupon.description}
            </p>

            {/* Date */}
            <p className="text-xs text-gray-500 mb-4">
              {coupon.dateRange}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg">
                Delete Card
              </button>

              <button className="bg-gradient-to-r from-teal-400 to-green-400 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg">
                Edit Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CouponManagementList

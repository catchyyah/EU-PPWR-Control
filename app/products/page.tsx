'use client';

import { useState } from 'react';

const PRODUCT_GROUPS = ['펌프', '튜브', '용기', '색조'] as const;

interface ProductInfo {
  id: string;
  productGroup: typeof PRODUCT_GROUPS[number];
  productName: string;
  currentState: string;
  currentComplianceStatus: string;
  targetComplianceDate: string;
  notes: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductInfo[]>([
    {
      id: '1',
      productGroup: '펌프',
      productName: '스탠다드 펌프 30ml',
      currentState: '기존 설계 진행 중',
      currentComplianceStatus: '비규정 준수',
      targetComplianceDate: '2026-12',
      notes: '재생 재질 도입 검토 중',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProductInfo>({
    id: '',
    productGroup: '펌프',
    productName: '',
    currentState: '',
    currentComplianceStatus: '',
    targetComplianceDate: '',
    notes: '',
  });

  const addProduct = () => {
    if (formData.productName.trim()) {
      setProducts([
        ...products,
        {
          ...formData,
          id: Date.now().toString(),
        },
      ]);
      setFormData({
        id: '',
        productGroup: '펌프',
        productName: '',
        currentState: '',
        currentComplianceStatus: '',
        targetComplianceDate: '',
        notes: '',
      });
      setIsOpen(false);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">제품 정보</h1>
        <p className="text-gray-600">
          회사의 제품별 PPWR 규정 준수 상황 및 대응 계획
        </p>
      </div>

      {/* 정보 */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>사용 방법:</strong> 각 제품의 현재 상태, 규정 준수 현황, 목표 일정을 입력하세요.
          입력한 정보는 로드맵과 연동되어 관리됩니다.
        </p>
      </div>

      {/* 추가 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        + 제품 추가
      </button>

      {/* 추가 폼 */}
      {isOpen && (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">새 제품 추가</h3>
          <div className="space-y-4">
            {/* 제품군 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품군 *
              </label>
              <select
                value={formData.productGroup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productGroup: e.target.value as typeof PRODUCT_GROUPS[number],
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {PRODUCT_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* 제품명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품명 *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="예: 스탠다드 펌프 30ml"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* 현재 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 상태
              </label>
              <textarea
                value={formData.currentState}
                onChange={(e) =>
                  setFormData({ ...formData, currentState: e.target.value })
                }
                placeholder="현재 포장 설계, 사용 재질 등의 상태"
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>

            {/* 규정 준수 현황 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                규정 준수 현황
              </label>
              <select
                value={formData.currentComplianceStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentComplianceStatus: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">선택</option>
                <option value="규정 준수">✓ 규정 준수</option>
                <option value="부분 준수">△ 부분 준수</option>
                <option value="비규정 준수">✗ 비규정 준수</option>
                <option value="미검토">? 미검토</option>
              </select>
            </div>

            {/* 목표 일정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 완료 일정
              </label>
              <input
                type="month"
                value={formData.targetComplianceDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetComplianceDate: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* 비고 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비고
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="추가 정보 또는 특이사항"
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={addProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                추가
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 제품 목록 */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
            <p className="text-gray-600">등록된 제품이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">
              위의 '제품 추가' 버튼으로 제품을 등록하세요.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={() => deleteProduct(product.id)}
            />
          ))
        )}
      </div>

      {/* 통계 */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-gray-200 p-6 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">총 제품</p>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">규정 준수</p>
            <p className="text-3xl font-bold text-green-600">
              {products.filter((p) => p.currentComplianceStatus === '규정 준수').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">진행 중</p>
            <p className="text-3xl font-bold text-orange-600">
              {products.filter((p) => p.currentComplianceStatus === '부분 준수').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">대응 필요</p>
            <p className="text-3xl font-bold text-red-600">
              {products.filter((p) => p.currentComplianceStatus === '비규정 준수').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onDelete,
}: {
  product: ProductInfo;
  onDelete: () => void;
}) {
  const statusColors = {
    '규정 준수': 'bg-green-50 border-green-200 text-green-900',
    '부분 준수': 'bg-orange-50 border-orange-200 text-orange-900',
    '비규정 준수': 'bg-red-50 border-red-200 text-red-900',
    '미검토': 'bg-gray-50 border-gray-200 text-gray-900',
  };

  const statusEmoji = {
    '규정 준수': '✓',
    '부분 준수': '△',
    '비규정 준수': '✗',
    '미검토': '?',
  };

  const colorClass =
    statusColors[product.currentComplianceStatus as keyof typeof statusColors] ||
    statusColors['미검토'];

  return (
    <div className={`border p-6 rounded-lg ${colorClass}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
              {product.productGroup}
            </span>
            <h3 className="text-lg font-bold text-gray-900">
              {product.productName}
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            {product.currentState && (
              <p>
                <strong>현재 상태:</strong> {product.currentState}
              </p>
            )}
            <p>
              <strong>규정 준수:</strong>{' '}
              <span className="font-medium">
                {statusEmoji[product.currentComplianceStatus as keyof typeof statusEmoji]}{' '}
                {product.currentComplianceStatus}
              </span>
            </p>
            {product.targetComplianceDate && (
              <p>
                <strong>목표 일정:</strong> {product.targetComplianceDate}
              </p>
            )}
            {product.notes && (
              <p>
                <strong>비고:</strong> {product.notes}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-900 text-2xl"
          title="삭제"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

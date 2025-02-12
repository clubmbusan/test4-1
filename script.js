document.addEventListener('DOMContentLoaded', () => {
  // [1] 재산 유형에 따른 필드 표시
  const assetType = document.getElementById('assetType');
  const realEstateField = document.getElementById('realEstateField');
  const vehicleField = document.getElementById('vehicleField');
  const otherField = document.getElementById('otherField');

  assetType.addEventListener('change', () => {
    const selected = assetType.value;
    if (selected === 'realEstate') {
      realEstateField.style.display = 'block';
      vehicleField.style.display = 'none';
      otherField.style.display = 'none';
    } else if (selected === 'vehicle') {
      realEstateField.style.display = 'none';
      vehicleField.style.display = 'block';
      otherField.style.display = 'none';
    } else {
      realEstateField.style.display = 'none';
      vehicleField.style.display = 'none';
      otherField.style.display = 'block';
    }
  });
  assetType.dispatchEvent(new Event('change'));

  // [2] 부동산 종류에 따른 하위 필드 표시/숨김
  const realEstateType = document.getElementById('realEstateType');
  const houseField = document.getElementById('houseField');
  const landField = document.getElementById('landField');
  const buildingField = document.getElementById('buildingField');

  function hideAllSubFields() {
    houseField.style.display = 'none';
    landField.style.display = 'none';
    buildingField.style.display = 'none';
  }

  realEstateType.addEventListener('change', () => {
    hideAllSubFields();
    const selectedType = realEstateType.value;
    if (selectedType === 'house') {
      houseField.style.display = 'block';
    } else if (selectedType === 'land') {
      landField.style.display = 'block';
    } else if (selectedType === 'building') {
      buildingField.style.display = 'block';
    }
  });
  realEstateType.dispatchEvent(new Event('change'));

  // [3] 건축물 영역에서 추가 드롭다운 처리
  const buildingAcquisitionType = document.getElementById('buildingAcquisitionType');
  const crowdedAreaField = document.getElementById('crowdedAreaField');
  const crowdedArea = document.getElementById('crowdedArea');
  const metropolitanAreaField = document.getElementById('metropolitanAreaField');

  buildingAcquisitionType.addEventListener('change', () => {
    if (buildingAcquisitionType.value === 'forProfit') {
      crowdedAreaField.style.display = 'block';
    } else {
      crowdedAreaField.style.display = 'none';
      metropolitanAreaField.style.display = 'none';
    }
  });
  buildingAcquisitionType.dispatchEvent(new Event('change'));

  crowdedArea.addEventListener('change', () => {
    if (crowdedArea.value === 'no') {
      metropolitanAreaField.style.display = 'block';
    } else {
      metropolitanAreaField.style.display = 'none';
    }
  });
  crowdedArea.dispatchEvent(new Event('change'));

  // [4] 부동산 금액 입력 시 콤마 자동
  const realEstateValue = document.getElementById('realEstateValue');
  realEstateValue.addEventListener('input', () => {
    const raw = realEstateValue.value.replace(/,/g, '').replace(/[^0-9]/g, '');
    realEstateValue.value = raw ? parseInt(raw, 10).toLocaleString() : '';
  });

  // [5] 차량 금액 콤마 자동 적용
  const vehiclePrice = document.getElementById('vehiclePrice');
  vehiclePrice.addEventListener('input', () => {
    const raw = vehiclePrice.value.replace(/,/g, '').replace(/[^0-9]/g, '');
    vehiclePrice.value = raw ? parseInt(raw, 10).toLocaleString() : '';
  });

  // [6] 기타 자산 금액 콤마 자동 적용
  const otherAssetValue = document.getElementById('otherAssetValue');
  otherAssetValue.addEventListener('input', () => {
    const raw = otherAssetValue.value.replace(/,/g, '').replace(/[^0-9]/g, '');
    otherAssetValue.value = raw ? parseInt(raw, 10).toLocaleString() : '';
  });

  // ===== 신고하기 버튼 토글 이벤트 추가 =====
  document.getElementById('reportToggleButton').addEventListener('click', () => {
    const reportSection = document.getElementById('reportSection');
    if (reportSection.style.display === 'none' || reportSection.style.display === '') {
      reportSection.style.display = 'block';
    } else {
      reportSection.style.display = 'none';
    }
  });
  // ===== 신고 토글 이벤트 추가 끝 =====

  // [7] 매매모달 관련 이벤트 처리 (중복 제거됨)
const saleButton = document.getElementById('saleButton'); // 한 번만 선언
  const saleModal = document.getElementById('saleModal');
  const confirmSaleType = document.getElementById('confirmSaleType');
  const closeSaleModal = document.getElementById('closeSaleModal');

  saleButton.addEventListener('click', () => {
    saleModal.style.display = 'flex';
  });

  confirmSaleType.addEventListener('click', () => {
    const saleType = document.getElementById('saleType').value;
    const assetValue = parseInt(realEstateValue.value.replace(/,/g, '') || '0', 10);
    if (isNaN(assetValue) || assetValue <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    let taxRate = saleType === 'general' ? 0.02 : 0.025;
    const acquisitionTax = Math.floor(assetValue * taxRate);
    const acquisitionTaxField = document.getElementById('calculatedAcquisitionTax');
    if (acquisitionTaxField) {
      acquisitionTaxField.value = acquisitionTax;
    }
    saleModal.style.display = 'none';
  });

  closeSaleModal.addEventListener('click', () => {
    saleModal.style.display = 'none';
  });

  // [8] 증여 모달 관련 코드
  const giftButton = document.getElementById('giftButton');
  const giftModal = document.getElementById('giftModal');
  const confirmGiftType = document.getElementById('confirmGiftType');
  const closeGiftModal = document.getElementById('closeGiftModal');

  giftButton.addEventListener('click', () => {
    giftModal.style.display = 'flex';
  });

  confirmGiftType.addEventListener('click', () => {
    const giftType = document.getElementById('giftType').value;
    const assetValue = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
    if (isNaN(assetValue) || assetValue <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    let taxRate = giftType === 'general' ? 0.035 : 0.04;
    const acquisitionTax = Math.floor(assetValue * taxRate);
    const acquisitionTaxField = document.getElementById('calculatedAcquisitionTax');
    if (!acquisitionTaxField) {
      console.error('숨겨진 필드 "calculatedAcquisitionTax"가 HTML에서 찾을 수 없습니다.');
      return;
    }
    acquisitionTaxField.value = acquisitionTax;
    giftModal.style.display = 'none';
  });

  closeGiftModal.addEventListener('click', () => {
    giftModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === giftModal) {
      giftModal.style.display = 'none';
    }
  });

  // [9] 상속 모달 관련 코드
  const inheritanceButton = document.getElementById('inheritanceButton');
  const inheritanceModal = document.getElementById('inheritanceModal');
  const confirmInheritanceType = document.getElementById('confirmInheritanceType');
  const closeInheritanceModal = document.getElementById('closeInheritanceModal');

  inheritanceButton.addEventListener('click', () => {
    inheritanceModal.style.display = 'flex';
  });

  confirmInheritanceType.addEventListener('click', () => {
    const inheritanceType = document.getElementById('inheritanceType').value;
    const isAdjustedArea = document.getElementById('isAdjustedAreaInheritance').value === 'yes';
    const assetValue = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
    if (isNaN(assetValue) || assetValue <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    let taxRate = 0;
    if (inheritanceType === 'general') {
      taxRate = isAdjustedArea ? 0.028 : 0.03;
    } else if (inheritanceType === 'corporate') {
      taxRate = 0.04;
    }
    const acquisitionTax = Math.floor(assetValue * taxRate);
    const acquisitionTaxField = document.getElementById('calculatedAcquisitionTax');
    if (!acquisitionTaxField) {
      console.error('숨겨진 필드 "calculatedAcquisitionTax"가 HTML에서 찾을 수 없습니다.');
      return;
    }
    acquisitionTaxField.value = acquisitionTax;
    inheritanceModal.style.display = 'none';
  });

  closeInheritanceModal.addEventListener('click', () => {
    inheritanceModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === inheritanceModal) {
      inheritanceModal.style.display = 'none';
    }
  });

  // [10] 원시취득 모달 관련 코드
  const originalButton = document.getElementById('originalButton');
  const originalModal = document.getElementById('originalModal');
  const originalCategory = document.getElementById('originalCategory');

  originalButton.addEventListener('click', () => {
    const selectedType = realEstateType.value;
    if (selectedType !== 'building') {
      alert('원시취득은 건축물에만 해당됩니다.');
      return;
    }
    originalCategory.innerHTML = `
      <option value="residential">주거용</option>
      <option value="nonResidential">비주거용</option>
    `;
    originalModal.style.display = 'flex';
  });

  document.getElementById('closeOriginalModal').addEventListener('click', () => {
    originalModal.style.display = 'none';
  });

  // [11] 후반부: 모달의 "확인" 버튼 및 계산하기 버튼 처리
 document.getElementById('calculateButton').addEventListener('click', () => {
    const educationTaxRate = 0.1; // 지방교육세율 (10%)
    const ruralTaxRate = 0.2;     // 농어촌특별세율 (20%)

    // 숨겨진 필드에서 취득세 불러오기
    const acquisitionTaxElement = document.getElementById('calculatedAcquisitionTax');
    if (!acquisitionTaxElement || acquisitionTaxElement.value === '') {
        alert('모달에서 취득세를 계산해주세요.');
        return;
    }
    const acquisitionTax = parseInt(acquisitionTaxElement.value || '0', 10);
    if (isNaN(acquisitionTax) || acquisitionTax <= 0) {
        alert('유효한 취득세 값이 없습니다.');
        return;
    }

    // 부가세 계산
    const educationTax = Math.floor(acquisitionTax * educationTaxRate);
    const ruralTax = Math.floor(acquisitionTax * ruralTaxRate);
    const baseTotalTax = acquisitionTax + educationTax + ruralTax; // 기본 세금 합계

    // === 가산세(연체가산세) 계산 ===
    // 신고 기한 선택에 따른 기준 일수 (예시)
    // "60days" = 60일, "6months" = 180일, "9months" = 270일 (대략)
    const reportDeadlineSelect = document.getElementById('reportDeadline');
    let allowedDays = 60; // 기본 60일
    if(reportDeadlineSelect.value === '6months'){
        allowedDays = 180;
    } else if(reportDeadlineSelect.value === '9months'){
        allowedDays = 270;
    }
    // 기준 취득일 (예시로 고정: 실제로는 취득 모달에서 입력받은 날짜로 대체)
    const baseAcquisitionDate = new Date('2024-01-01'); 
    // 기준 신고 기한 계산
    const allowedDeadline = new Date(baseAcquisitionDate.getTime() + allowedDays * 24 * 60 * 60 * 1000);

    // 신고일 입력값 가져오기
    const reportDateInput = document.getElementById('reportDate').value;
    let penaltyTax = 0;
    if(reportDateInput) {
        const reportDate = new Date(reportDateInput);
        // 신고일이 기준 신고 기한을 초과하면 연체 일수 계산
        if(reportDate > allowedDeadline) {
            const lateTime = reportDate.getTime() - allowedDeadline.getTime();
            const lateDays = Math.ceil(lateTime / (24 * 60 * 60 * 1000));
            // 예시: 연체 일수당 취득세의 0.1%를 가산세로 부과
            penaltyTax = Math.floor(acquisitionTax * 0.001 * lateDays);
        }
    }

    // 최종 총 세금: 기본 세금 합계 + 가산세
    const totalTax = baseTotalTax + penaltyTax;

    // 결과 출력 (가산세 포함)
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h3>계산 결과</h3>
      <p>취득세: ${acquisitionTax.toLocaleString()} 원</p>
      <p>지방교육세: ${educationTax.toLocaleString()} 원</p>
      <p>농어촌특별세: ${ruralTax.toLocaleString()} 원</p>
      <p>가산세 (연체): ${penaltyTax.toLocaleString()} 원</p>
      <p><strong>총 세금: ${totalTax.toLocaleString()} 원</strong></p>
    `;
});

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
  const houseField = document.getElementById('houseField');       // 주택 관련 영역
  const landField = document.getElementById('landField');         // 토지 관련 영역
  const buildingField = document.getElementById('buildingField');   // 건축물 관련 영역

  function hideAllSubFields() {
    houseField.style.display = 'none';
    landField.style.display = 'none';
    buildingField.style.display = 'none';
  }

  realEstateType.addEventListener('change', () => {
    hideAllSubFields();
    const selectedType = realEstateType.value;
    if (selectedType === 'house') {
      // 주택이 선택되면 조정지역 여부, 주택 종류, 취득 유형 드롭다운이 동시에 표시됨
      houseField.style.display = 'block';
    } else if (selectedType === 'land') {
      landField.style.display = 'block';
    } else if (selectedType === 'building') {
      buildingField.style.display = 'block';
    }
  });
  // 초기 상태 반영
  realEstateType.dispatchEvent(new Event('change'));

 // ===== 토지 영역 드롭다운 (농지 외 토지) =====
const landType = document.getElementById('landType');
const landAcquisitionType = document.getElementById('landAcquisitionType');
const landCrowdedAreaField = document.getElementById('landCrowdedAreaField');
const landCrowdedArea = document.getElementById('landCrowdedArea');
const landMetropolitanAreaField = document.getElementById('landMetropolitanAreaField');
// 안내문구를 위한 요소 (HTML에도 추가되어 있어야 합니다)
const landMetroNotice = document.getElementById('landMetroNotice');

function updateLandDropdowns() {
  // 만약 취득 유형이 natural이거나 토지 유형이 'nonFarmland'가 아니라면 드롭다운 모두 숨김
  if (landAcquisitionType.value === 'natural' || landType.value !== 'nonFarmland') {
    landCrowdedAreaField.style.display = 'none';
    landMetropolitanAreaField.style.display = 'none';
    landMetroNotice.style.display = 'none';
  } else {
    // 농지 외 토지이고 취득 유형이 자연인이 아닐 경우, 과밀억제권역 드롭다운 표시
    landCrowdedAreaField.style.display = 'block';
    // 과밀억제권역의 값이 'yes'일 때만 대도시권역 드롭다운 표시
    if (landCrowdedArea.value === 'yes') {
      landMetropolitanAreaField.style.display = 'block';
      // 대도시권역 드롭다운의 선택값이 'noGeneral' (아니오(중과세대상 아님))인 경우 안내문구 표시
      const landMetroSelect = document.getElementById('landMetropolitanArea');
      if (landMetroSelect.value === 'noGeneral') {
        landMetroNotice.innerHTML = `
          <p>
            1. 법인이 수도권 과밀억제권역에 본점 설립 지점 또는 분사무소 설치<br>
            2. 수도권과밀억제권역 내에서 설립된지 5년 미만<br>
            3. 수도권과밀억제권역내에서 부동산 취득<br>
            4. 중과세에 제외되는 업종(신축업, 임대업)이 아닌 경우
          </p>
          <p>위의 어느 하나라도 해당되지 않으면 일반과세로 처리됩니다.</p>
        `;
        landMetroNotice.style.display = 'block';
      } else {
        landMetroNotice.style.display = 'none';
      }
    } else {
      landMetropolitanAreaField.style.display = 'none';
      landMetroNotice.style.display = 'none';
    }
  }
}

landType.addEventListener('change', updateLandDropdowns);
landAcquisitionType.addEventListener('change', updateLandDropdowns);
landCrowdedArea.addEventListener('change', updateLandDropdowns);
document.getElementById('landMetropolitanArea').addEventListener('change', updateLandDropdowns);

// 초기 상태 반영 for 토지
updateLandDropdowns();
});  

// 건축물 영역 드롭다운 업데이트 (대도시권역 3가지 옵션 적용)
const buildingType = document.getElementById('buildingType');
const buildingAcquisitionType = document.getElementById('buildingAcquisitionType');
const buildingCrowdedAreaField = document.getElementById('buildingCrowdedAreaField');
const buildingCrowdedArea = document.getElementById('buildingCrowdedArea');
const buildingMetropolitanAreaField = document.getElementById('buildingMetropolitanAreaField');
const buildingMetropolitanArea = document.getElementById('buildingMetropolitanArea');
const buildingMetroNotice = document.getElementById('buildingMetroNotice');

function updateBuildingDropdowns() {
  // 만약 취득 유형이 natural이거나 건축시설물 유형이 'commercialBuilding'이 아니라면 드롭다운 모두 숨김
  if (buildingAcquisitionType.value === 'natural' || buildingType.value !== 'commercialBuilding') {
    buildingCrowdedAreaField.style.display = 'none';
    buildingMetropolitanAreaField.style.display = 'none';
    buildingMetroNotice.style.display = 'none';
  } else {
    // 취득 유형이 자연인이 아닌 경우, 비주거용 건축물이면 과밀억제권역 드롭다운 표시
    buildingCrowdedAreaField.style.display = 'block';
    // 과밀억제권역의 값이 'yes'일 때만 대도시권역 드롭다운 표시
    if (buildingCrowdedArea.value === 'yes') {
      buildingMetropolitanAreaField.style.display = 'block';
      // 옵션이 'noGeneral'인 경우 안내문구 표시
      if (buildingMetropolitanArea.value === 'noGeneral') {
        buildingMetroNotice.innerHTML = `
          <p>
            1. 법인이 수도권 과밀억제권역에 본점 설립 지점 또는 분사무소 설치<br>
            2. 수도권과밀억제권역 내에서 설립된지 5년 미만<br>
            3. 수도권과밀억제권역내에서 부동산 취득<br>
            4. 중과세에 제외되는 업종(신축업, 임대업)이 아닌 경우
          </p>
          <p>위의 어느 하나라도 해당되지 않으면 일반과세로 처리됩니다.</p>
        `;
        buildingMetroNotice.style.display = 'block';
      } else {
        buildingMetroNotice.style.display = 'none';
      }
    } else {
      buildingMetropolitanAreaField.style.display = 'none';
      buildingMetroNotice.style.display = 'none';
    }
  }
}
buildingType.addEventListener('change', updateBuildingDropdowns);
buildingAcquisitionType.addEventListener('change', updateBuildingDropdowns);
buildingCrowdedArea.addEventListener('change', updateBuildingDropdowns);
buildingMetropolitanArea.addEventListener('change', updateBuildingDropdowns);
  
// 초기 상태 반영 for 건축물
updateBuildingDropdowns();
});

  // [5] 부동산 금액 입력 시 콤마 자동 적용
  const realEstateValue = document.getElementById('realEstateValue');
  realEstateValue.addEventListener('input', () => {
    const raw = realEstateValue.value.replace(/,/g, '').replace(/[^0-9]/g, '');
    realEstateValue.value = raw ? parseInt(raw, 10).toLocaleString() : '';
  });

  // [6] 차량 금액 자동 적용
  const vehiclePrice = document.getElementById('vehiclePrice');
  if (vehiclePrice) {
    vehiclePrice.addEventListener('input', () => {
      const raw = vehiclePrice.value.replace(/,/g, '').replace(/[^0-9]/g, '');
      vehiclePrice.value = raw ? parseInt(raw, 10).toLocaleString() : '';
    });
  }
  
  // [7] 기타 자산 금액 자동 적용
  const otherAssetValue = document.getElementById('otherAssetValue');
  if (otherAssetValue) {
    otherAssetValue.addEventListener('input', () => {
      const raw = otherAssetValue.value.replace(/,/g, '').replace(/[^0-9]/g, '');
      otherAssetValue.value = raw ? parseInt(raw, 10).toLocaleString() : '';
    });
  }

  // ===== 신고하기 버튼 토글 이벤트 추가 =====
  document.getElementById('reportToggleButton').addEventListener('click', () => {
    const reportSection = document.getElementById('reportSection');
    if (reportSection.style.display === 'none' || reportSection.style.display === '') {
      reportSection.style.display = 'block';
    } else {
      reportSection.style.display = 'none';
    }
  });

  // ============================================================
  // 매매모달 관련 이벤트 처리 (업데이트된 매매 표준세율 및 세율 정보 저장)
  // ============================================================
  const saleModalEl = document.getElementById('saleModal');
  const confirmSaleTypeBtn = document.getElementById('confirmSaleType');
  const closeSaleModalBtn = document.getElementById('closeSaleModal');

  document.getElementById('saleButton').addEventListener('click', () => {
    saleModalEl.style.display = 'flex';
  });

  confirmSaleTypeBtn.addEventListener('click', () => {
    const assetValueNum = parseInt(realEstateValue.value.replace(/,/g, '') || '0', 10);
    if (isNaN(assetValueNum) || assetValueNum <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    
    let acquisitionTax = 0;
    let appliedTaxRate = "";
    const selectedTypeVal = document.getElementById('realEstateType').value;
    
    // =====================
    // 1. 주택 계산
    // =====================
    if (selectedTypeVal === 'house') {
      const acquisitionType = document.getElementById('acquisitionType').value;
      const houseTypeVal = document.getElementById('houseType').value;
      
      if (acquisitionType === 'oneHouse') {
        if (houseTypeVal === 'premium') {
          // 고급 주택: 12% 중과세
          acquisitionTax = Math.floor(assetValueNum * 0.12);
          appliedTaxRate = "12%";
        } else if (houseTypeVal === 'highValue') {
          // 고가 주택 (9억 초과): 무조건 3%
          acquisitionTax = Math.floor(assetValueNum * 0.03);
          appliedTaxRate = "3%";
        } else if (houseTypeVal === 'general6') {
          // 일반 주택 (6억원 이하): 1%
          acquisitionTax = Math.floor(assetValueNum * 0.01);
          appliedTaxRate = "1%";
        } else if (houseTypeVal === 'general9') {
          if (assetValueNum <= 600000000) {
            acquisitionTax = Math.floor(assetValueNum * 0.01);
            appliedTaxRate = "1%";
          } else if (assetValueNum <= 900000000) {
            const effectiveRate = 0.01 + ((assetValueNum - 600000000) / 300000000) * (0.03 - 0.01);
            acquisitionTax = Math.floor(assetValueNum * effectiveRate);
            appliedTaxRate = `${(effectiveRate * 100).toFixed(2)}%`;
          } else {
            acquisitionTax = Math.floor(assetValueNum * 0.03);
            appliedTaxRate = "3%";
          }
        } else {
          if (assetValueNum <= 600000000) {
            acquisitionTax = Math.floor(assetValueNum * 0.01);
            appliedTaxRate = "1%";
          } else if (assetValueNum <= 900000000) {
            const effectiveRate = 0.01 + ((assetValueNum - 600000000) / 300000000) * (0.03 - 0.01);
            acquisitionTax = Math.floor(assetValueNum * effectiveRate);
            appliedTaxRate = `${(effectiveRate * 100).toFixed(2)}%`;
          } else {
            acquisitionTax = Math.floor(assetValueNum * 0.03);
            appliedTaxRate = "3%";
          }
        }
      }
      // 1-2. 2주택자
      else if (acquisitionType === 'twoHouse') {
        const adjustedArea = document.getElementById('adjustedArea').value;
        if (adjustedArea === 'yes') {
          acquisitionTax = Math.floor(assetValueNum * 0.08);
          appliedTaxRate = "8%";
        } else {
          if (houseTypeVal === 'premium') {
            acquisitionTax = Math.floor(assetValueNum * 0.12);
            appliedTaxRate = "12%";
          } else if (houseTypeVal === 'highValue') {
            acquisitionTax = Math.floor(assetValueNum * 0.03);
            appliedTaxRate = "3%";
          } else if (houseTypeVal === 'general6') {
            acquisitionTax = Math.floor(assetValueNum * 0.01);
            appliedTaxRate = "1%";
          } else if (houseTypeVal === 'general9') {
            if (assetValueNum <= 600000000) {
              acquisitionTax = Math.floor(assetValueNum * 0.01);
              appliedTaxRate = "1%";
            } else if (assetValueNum <= 900000000) {
              const effectiveRate = 0.01 + ((assetValueNum - 600000000) / 300000000) * (0.03 - 0.01);
              acquisitionTax = Math.floor(assetValueNum * effectiveRate);
              appliedTaxRate = `${(effectiveRate * 100).toFixed(2)}%`;
            } else {
              acquisitionTax = Math.floor(assetValueNum * 0.03);
              appliedTaxRate = "3%";
            }
          } else {
            if (assetValueNum <= 600000000) {
              acquisitionTax = Math.floor(assetValueNum * 0.01);
              appliedTaxRate = "1%";
            } else if (assetValueNum <= 900000000) {
              const effectiveRate = 0.01 + ((assetValueNum - 600000000) / 300000000) * (0.03 - 0.01);
              acquisitionTax = Math.floor(assetValueNum * effectiveRate);
              appliedTaxRate = `${(effectiveRate * 100).toFixed(2)}%`;
            } else {
              acquisitionTax = Math.floor(assetValueNum * 0.03);
              appliedTaxRate = "3%";
            }
          }
        }
      }
      // 1-3. 3주택자
      else if (acquisitionType === 'threeHouse') {
        const adjustedArea = document.getElementById('adjustedArea').value;
        if (adjustedArea === 'yes') {
          acquisitionTax = Math.floor(assetValueNum * 0.12);
          appliedTaxRate = "12%";
        } else {
          acquisitionTax = Math.floor(assetValueNum * 0.08);
          appliedTaxRate = "8%";
        }
      }
      // 1-4. 4주택자
      else if (acquisitionType === 'fourHouse') {
        acquisitionTax = Math.floor(assetValueNum * 0.12);
        appliedTaxRate = "12%";
      }
      // 1-5. 법인 (영리, 비영리 모두)
      else if (acquisitionType === 'nonProfitCorporate' || acquisitionType === 'forProfitCorporate') {
        acquisitionTax = Math.floor(assetValueNum * 0.12);
        appliedTaxRate = "12%";
      }
      window.selectedAcquisitionMethod = "매매취득세";
    }
    // =====================
    // 2. 토지 계산
    // =====================
    else if (selectedTypeVal === 'land') {
      const landTypeVal = document.getElementById('landType').value;
      if (landTypeVal === 'farmland') {
        acquisitionTax = Math.floor(assetValueNum * 0.03);
        appliedTaxRate = "3%";
      } else if (landTypeVal === 'nonFarmland') {
        acquisitionTax = Math.floor(assetValueNum * 0.04);
        appliedTaxRate = "4%";
      } else {
        acquisitionTax = Math.floor(assetValueNum * 0.04);
        appliedTaxRate = "4%";
      }
      window.selectedAcquisitionMethod = "매매취득세";
    }
    // =====================
    // 3. 건축물 계산
    // =====================
    else if (selectedTypeVal === 'building') {
      acquisitionTax = Math.floor(assetValueNum * 0.04);
      appliedTaxRate = "4%";
      window.selectedAcquisitionMethod = "매매취득세";
    }
    
    const acquisitionTaxField = document.getElementById('calculatedAcquisitionTax');
    if (acquisitionTaxField) {
      acquisitionTaxField.value = acquisitionTax;
    }
    window.selectedAppliedTaxRate = appliedTaxRate;
    
    saleModalEl.style.display = 'none';
  });
  
  closeSaleModalBtn.addEventListener('click', () => {
    saleModalEl.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === saleModalEl) {
      saleModalEl.style.display = 'none';
    }
  });
  
  // === 증여 모달 관련 코드 (업데이트된 증여 표준세율 및 세율 정보 저장) ===
  const giftButtonEl = document.getElementById('giftButton');
  const giftModalEl = document.getElementById('giftModal');
  const confirmGiftTypeBtn = document.getElementById('confirmGiftType');
  const closeGiftModalBtn = document.getElementById('closeGiftModal');
  
  giftButtonEl.addEventListener('click', () => {
    giftModalEl.style.display = 'flex';
  });
  
  confirmGiftTypeBtn.addEventListener('click', () => {
    const giftTypeVal = document.getElementById('giftType').value;
    const assetValueNumGift = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
  
    if (isNaN(assetValueNumGift) || assetValueNumGift <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
  
    let taxRateGift = 0;
    let appliedTaxRateGift = "";
    if (giftTypeVal === 'general') {
      taxRateGift = 0.035;
      appliedTaxRateGift = "3.5%";
    } else if (giftTypeVal === 'corporate') {
      taxRateGift = 0.028;
      appliedTaxRateGift = "2.8%";
    }
  
    const acquisitionTaxGift = Math.floor(assetValueNumGift * taxRateGift);
    const acquisitionTaxFieldGift = document.getElementById('calculatedAcquisitionTax');
    if (!acquisitionTaxFieldGift) {
      console.error('숨겨진 필드 "calculatedAcquisitionTax"를 찾을 수 없습니다.');
      return;
    }
    acquisitionTaxFieldGift.value = acquisitionTaxGift;
    window.selectedAcquisitionMethod = "증여취득세";
    window.selectedAppliedTaxRate = appliedTaxRateGift;
    giftModalEl.style.display = 'none';
  });
  
  closeGiftModalBtn.addEventListener('click', () => {
    giftModalEl.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === giftModalEl) {
      giftModalEl.style.display = 'none';
    }
  });
  
  // === 상속 모달 관련 코드 (업데이트된 상속 표준세 적용 및 세율 정보 저장) ===
  const inheritanceButtonEl = document.getElementById('inheritanceButton');
  const inheritanceModalEl = document.getElementById('inheritanceModal');
  const confirmInheritanceTypeBtn = document.getElementById('confirmInheritanceType');
  const closeInheritanceModalBtn = document.getElementById('closeInheritanceModal');
  
  inheritanceButtonEl.addEventListener('click', () => {
    inheritanceModalEl.style.display = 'flex';
  });
  
  confirmInheritanceTypeBtn.addEventListener('click', () => {
    const assetValueNumInheritance = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
    if (isNaN(assetValueNumInheritance) || assetValueNumInheritance <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    
    let taxRateInheritance = 0;
    let appliedTaxRateInheritance = "";
    const selectedTypeInheritance = document.getElementById('realEstateType').value;
    
    if (selectedTypeInheritance === 'land') {
      const landTypeVal = document.getElementById('landType').value;
      if (landTypeVal === 'farmland') {
        taxRateInheritance = 0.023;
        appliedTaxRateInheritance = "2.3%";
      } else {
        taxRateInheritance = 0.028;
        appliedTaxRateInheritance = "2.8%";
      }
    } else {
      taxRateInheritance = 0.028;
      appliedTaxRateInheritance = "2.8%";
    }
    
    const acquisitionTaxInheritance = Math.floor(assetValueNumInheritance * taxRateInheritance);
    const acquisitionTaxFieldInheritance = document.getElementById('calculatedAcquisitionTax');
    if (!acquisitionTaxFieldInheritance) {
      console.error('숨겨진 필드 "calculatedAcquisitionTax"를 찾을 수 없습니다.');
      return;
    }
    acquisitionTaxFieldInheritance.value = acquisitionTaxInheritance;
    window.selectedAcquisitionMethod = "상속취득세";
    window.selectedAppliedTaxRate = appliedTaxRateInheritance;
    inheritanceModalEl.style.display = 'none';
  });
  
  closeInheritanceModalBtn.addEventListener('click', () => {
    inheritanceModalEl.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === inheritanceModalEl) {
      inheritanceModalEl.style.display = 'none';
    }
  });
  
  // === 원시취득 모달 관련 코드 (업데이트된 원시취득 표준세율 및 세율 정보 저장) ===
  const originalButtonEl = document.getElementById('originalButton');
  const originalModalEl = document.getElementById('originalModal');
  const originalCategoryEl = document.getElementById('originalCategory');
  const confirmOriginalTypeBtn = document.getElementById('confirmOriginalType');
  
  originalButtonEl.addEventListener('click', () => {
    const selectedTypeOriginal = document.getElementById('realEstateType').value;
    if (selectedTypeOriginal !== 'building') {
      alert('원시취득은 건축물에만 해당됩니다.');
      return;
    }
  
    originalCategoryEl.innerHTML = `
        <option value="residential">주거용</option>
        <option value="nonResidential">비주거용</option>
    `;
  
    originalModalEl.style.display = 'flex';
  });
  
  confirmOriginalTypeBtn.addEventListener('click', () => {
    const assetValueNumOriginal = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
    if (isNaN(assetValueNumOriginal) || assetValueNumOriginal <= 0) {
      alert('유효한 금액을 입력하세요.');
      return;
    }
    
    const acquisitionTaxOriginal = Math.floor(assetValueNumOriginal * 0.028);
    const acquisitionTaxFieldOriginal = document.getElementById('calculatedAcquisitionTax');
    if (acquisitionTaxFieldOriginal) {
      acquisitionTaxFieldOriginal.value = acquisitionTaxOriginal;
    }
    window.selectedAcquisitionMethod = "원시취득세";
    window.selectedAppliedTaxRate = "2.8%";
    originalModalEl.style.display = 'none';
  });
  
  document.getElementById('closeOriginalModal').addEventListener('click', () => {
    originalModalEl.style.display = 'none';
  });
  
  // === 계산하기 버튼: 최종 계산 (업데이트된 결과지 출력) ===
  document.getElementById('calculateButton').addEventListener('click', () => {
    const acquisitionTaxElement = document.getElementById('calculatedAcquisitionTax');
    if (!acquisitionTaxElement || acquisitionTaxElement.value === '') {
      alert('모달에서 취득세를 계산해주세요.');
      return;
    }
    
    const acquisitionTaxFinal = parseInt(acquisitionTaxElement.value, 10);
    if (isNaN(acquisitionTaxFinal) || acquisitionTaxFinal <= 0) {
      alert('유효한 취득세 값이 없습니다.');
      return;
    }
    
    const educationTax = Math.floor(acquisitionTaxFinal * 0.1);
    const ruralTax = Math.floor(acquisitionTaxFinal * 0.2);
    const baseTotalTax = acquisitionTaxFinal + educationTax + ruralTax;
    
    const reportDeadlineSelect = document.getElementById('reportDeadline');
    let allowedDays = 60;
    if (reportDeadlineSelect.value === '3months') {
      allowedDays = 90;
    } else if (reportDeadlineSelect.value === '6months') {
      allowedDays = 180;
    } else if (reportDeadlineSelect.value === '9months') {
      allowedDays = 270;
    }
    
    const baseAcquisitionDate = new Date('2024-01-01');
    const allowedDeadline = new Date(baseAcquisitionDate.getTime() + allowedDays * 24 * 60 * 60 * 1000);
    
    const reportDateInput = document.getElementById('reportDate').value;
    let penaltyTax = 0;
    if (reportDateInput) {
      const reportDate = new Date(reportDateInput);
      if (reportDate > allowedDeadline) {
        const lateTime = reportDate.getTime() - allowedDeadline.getTime();
        const lateDays = Math.ceil(lateTime / (24 * 60 * 60 * 1000));
        penaltyTax = Math.floor(acquisitionTaxFinal * 0.001 * lateDays);
      }
    }
    
    const totalTax = baseTotalTax + penaltyTax;
    
    const acquisitionMethodFinal = window.selectedAcquisitionMethod || "취득세";
    const appliedTaxRateFinal = window.selectedAppliedTaxRate || "0%";
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h3>계산 결과</h3>
      <p>${acquisitionMethodFinal}: ${acquisitionTaxFinal.toLocaleString()} 원 (적용 세율: ${appliedTaxRateFinal})</p>
      <p>지방교육세: ${educationTax.toLocaleString()} 원</p>
      <p>농어촌특별세: ${ruralTax.toLocaleString()} 원</p>
      <p>가산세 (연체): ${penaltyTax.toLocaleString()} 원</p>
      <p><strong>총 세금: ${totalTax.toLocaleString()} 원</strong></p>
    `;
  });
});

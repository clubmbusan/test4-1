document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 가져오기
    const propertyTypeSelect = document.getElementById('propertyType'); // 부동산 유형 선택
    const regulatedAreaSelect = document.getElementById('regulatedArea'); // 조정대상지역 여부 select
    const singleHouseExemptionSelect = document.getElementById('singleHouseExemption'); // 1세대 1주택 여부 select
    const regulatedAreaField = document.getElementById('regulatedAreaField'); // 조정대상지역 여부 필드
    const singleHouseExemptionField = document.getElementById('singleHouseExemptionField'); // 1세대 1주택 여부 필드
    const acquisitionDateInput = document.getElementById('acquisitionDate'); // 취득일 입력
    const transferDateInput = document.getElementById('transferDate'); // 양도일 입력
    const holdingYearsDisplay = document.getElementById('holdingYearsDisplay'); // 보유 기간 표시
    const calculateButton = document.getElementById('calculateButton'); // 계산 버튼
    const toggleAcquisitionButton = document.getElementById('toggleAcquisitionButton'); // 취득가액 버튼
    const acquisitionModal = document.getElementById('acquisitionModal'); // 취득가액 모달
    const closeAcquisitionModal = document.getElementById('closeAcquisitionModal'); // 취득가액 모달 닫기 버튼
    const saveAcquisitionButton = document.getElementById('saveAcquisition'); // 취득가액 저장 버튼
    const totalAcquisitionDisplay = document.getElementById('totalAcquisitionDisplay'); // 취득가액 표시
    const toggleExpensesButton = document.getElementById('toggleExpensesButton'); // 필요경비 버튼
    const expensesModal = document.getElementById('expensesModal'); // 필요경비 모달
    const closeExpensesModal = document.getElementById('closeExpensesModal'); // 필요경비 모달 닫기 버튼
    const saveExpensesButton = document.getElementById('saveExpenses'); // 필요경비 저장 버튼
    const totalExpensesDisplay = document.getElementById('totalExpensesDisplay'); // 필요경비 표시
    const exemptionSection = document.getElementById("exemptionSection"); // 감면율 선택 필드 추가

    // [수정된 부분] 조정대상지역 값에 따라 singleHouseExemption 옵션 업데이트
    const updateSingleHouseExemptionOptions = () => {
        let optionsHtml = '';
        if (regulatedAreaSelect.value === 'yes') {
            // 조정대상지역이 "예"인 경우
            optionsHtml += `<option value="yes">예 (3년 보유, 2년 거주)</option>`;
            optionsHtml += `<option value="no">아니오</option>`;
        } else {
            // 조정대상지역이 "아니오"인 경우: "아니오"가 기본 선택됨
            optionsHtml += `<option value="yes">예 (3년 보유)</option>`;
            optionsHtml += `<option value="no" selected>아니오</option>`;
        }
        singleHouseExemptionSelect.innerHTML = optionsHtml;
    };

    // 초기 옵션 업데이트
    updateSingleHouseExemptionOptions();

    // regulatedArea 선택이 변경될 때마다 옵션 업데이트
    regulatedAreaSelect.addEventListener('change', updateSingleHouseExemptionOptions);

    // 방어 코드 추가: 모든 요소가 null인지 확인
    if (!propertyTypeSelect || !regulatedAreaField || !singleHouseExemptionField || !acquisitionDateInput || !transferDateInput || !calculateButton) {
        console.error('필수 요소가 HTML에 누락되었습니다. HTML 구조를 점검하세요.');
        return;
    }

    // 숫자 입력 필드에 콤마 추가 이벤트
    document.addEventListener('input', (event) => {
        const target = event.target;

        // 콤마를 적용할 모든 필드 ID 정의
        const numericFields = [
            'acquisitionPrice', 
            'acquisitionBrokerageFee', 
            'acquisitionLegalFee', 
            'acquisitionOtherExpenses',
            'transferPrice', 
            'transferBrokerageFee', 
            'transferLegalFee', 
            'transferOtherExpenses',
            'transferLegalServiceFee' // 법무사 수수료 추가
        ];

        // 숫자 입력 필드 확인 후 콤마 추가
        if (numericFields.includes(target.id)) {
            const rawValue = target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
            target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : ''; // 콤마 추가
        }
    });

    // 부동산 유형에 따라 필드 표시/숨김
    const updateFieldsByPropertyType = () => {
        const propertyType = propertyTypeSelect.value;
        
        // 주택 선택 시 조정대상지역 & 1세대 1주택 여부 표시
        if (propertyType === 'house') {
            regulatedAreaField.style.display = 'block';
            singleHouseExemptionField.style.display = 'block';
        } else {
            regulatedAreaField.style.display = 'none';
            singleHouseExemptionField.style.display = 'none';
        }

        // "토지/건물"을 선택하면 감면율 선택 필드(`exemptionSection`) 표시, 아니면 숨김
        if (exemptionSection) { // 감면율 선택 필드가 존재할 경우만 실행
            if (propertyType === 'commercial') { 
                exemptionSection.style.display = 'block'; // 감면율 필드 보이기
            } else {
                exemptionSection.style.display = 'none'; // 감면율 필드 숨기기
            }
        } 
    };

    // 부동산 유형 변경 시 감면율 필드 표시/숨김 반영
    propertyTypeSelect.addEventListener('change', updateFieldsByPropertyType);
    updateFieldsByPropertyType(); // 페이지 로드 시 초기 상태 반영

    // 보유 기간 자동 계산
    const calculateHoldingYears = () => {
        const acquisitionDate = new Date(acquisitionDateInput.value);
        const transferDate = new Date(transferDateInput.value);

        if (isNaN(acquisitionDate) || isNaN(transferDate)) {
            holdingYearsDisplay.value = '날짜를 입력하세요.';
            return;
        }

        const diffInMilliseconds = transferDate - acquisitionDate;
        if (diffInMilliseconds < 0) {
            holdingYearsDisplay.value = '양도일이 취득일보다 빠릅니다.';
            return;
        }

        const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365);
        holdingYearsDisplay.value = diffInYears.toFixed(2) + '년';
    };

    acquisitionDateInput.addEventListener('change', calculateHoldingYears);
    transferDateInput.addEventListener('change', calculateHoldingYears);
   
    // 모달 입력 필드를 초기화하는 공통 함수
    const resetFields = (modalId) => {
        document.querySelectorAll(`#${modalId} input[type="text"]`).forEach((input) => {
            input.value = ''; // 입력 필드 값 초기화
        });
    };

    // 모달 열기/닫기 공통 함수
    const openModal = (modal) => {
        modal.style.display = 'block';
    };

    const closeModal = (modal, modalId) => {
        modal.style.display = 'none';
        if (modalId) resetFields(modalId); // 모달 닫을 때 입력 필드 초기화
    };

    // 취득가액 모달 열기/닫기
    toggleAcquisitionButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (acquisitionModal.style.display === 'block') {
            closeModal(acquisitionModal);
        } else {
            openModal(acquisitionModal);
        }
    });

    closeAcquisitionModal.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal(acquisitionModal);
    });

    // 취득가액 저장
    saveAcquisitionButton.addEventListener('click', () => {
        // 취득가액 입력 필드 가져오기
        const acquisitionPriceElement = document.getElementById('acquisitionPrice');

        // 경비 항목 필드 가져오기
        const acquisitionBrokerageFee = parseInt(document.getElementById('acquisitionBrokerageFee').value.replace(/,/g, '') || '0', 10);
        const acquisitionLegalFee = parseInt(document.getElementById('acquisitionLegalFee').value.replace(/,/g, '') || '0', 10);
        const acquisitionOtherExpenses = parseInt(document.getElementById('acquisitionOtherExpenses').value.replace(/,/g, '') || '0', 10);

        // 경비 합산
        const totalExpenses = acquisitionBrokerageFee + acquisitionLegalFee + acquisitionOtherExpenses;

        // 취득가액 값 읽기, 없으면 0으로 처리
        const acquisitionPrice = acquisitionPriceElement ? parseInt(acquisitionPriceElement.value.replace(/,/g, '') || '0', 10) : 0;

        // 총 취득가액 계산
        const totalAcquisition = acquisitionPrice + totalExpenses;

        // 결과 표시
        totalAcquisitionDisplay.textContent = `총 취득가액: ${totalAcquisition.toLocaleString()} 원`;

        // 모달 닫기
        closeModal(acquisitionModal);
    });

    // 필요경비 모달 열기/닫기
    toggleExpensesButton.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(expensesModal);
    });

    closeExpensesModal.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal(expensesModal);
    });

    // 필요경비 저장
    saveExpensesButton.addEventListener('click', () => {
        // 필요경비 항목 필드 값 읽기
        const transferBrokerageFee = parseInt(document.getElementById('transferBrokerageFee').value.replace(/,/g, '') || '0', 10); // 자본적 지출
        const transferLegalFee = parseInt(document.getElementById('transferLegalFee').value.replace(/,/g, '') || '0', 10); // 중개 수수료
        const transferLegalServiceFee = parseInt(document.getElementById('transferLegalServiceFee').value.replace(/,/g, '') || '0', 10); // 법무사 비용
        const transferOtherExpenses = parseInt(document.getElementById('transferOtherExpenses').value.replace(/,/g, '') || '0', 10); // 기타 비용

        // 필요경비 합산
        const totalExpenses = transferBrokerageFee + transferLegalFee + transferLegalServiceFee + transferOtherExpenses;

        // 결과 표시
        totalExpensesDisplay.textContent = `총 필요경비: ${totalExpenses.toLocaleString()} 원`;

        // 모달 닫기
        closeModal(expensesModal);
    });

    // 필요경비 입력 필드 상태 관리
    document.querySelectorAll('#expensesModal input[type="text"]').forEach((input) => {
        input.addEventListener('input', () => {
            // 사용자가 값을 입력하면 자동으로 체크된 상태로 변경
            const checkbox = document.getElementById(input.id.replace('Amount', ''));
            if (checkbox) checkbox.checked = !!input.value.trim();
        });
    });

    // 감면율 가져오기 함수 (오류 수정)
    const getSelectedExemptionRate = () => {
        const exemptionRateElement = document.getElementById('exemptionRate'); // 감면율 선택 필드 가져오기
        return exemptionRateElement ? parseInt(exemptionRateElement.value, 10) || 0 : 0; // 값이 없으면 기본값 0 반환
    };
    
    // 계산 버튼 클릭 이벤트
    calculateButton.addEventListener('click', () => {
        const acquisitionDate = new Date(acquisitionDateInput.value);
        const transferDate = new Date(transferDateInput.value);

        // 보유 기간 계산
        if (isNaN(acquisitionDate) || isNaN(transferDate)) {
            alert('취득일과 양도일을 입력해주세요.');
            return;
        }

        const diffInMilliseconds = transferDate - acquisitionDate;
        if (diffInMilliseconds < 0) {
            alert('양도일이 취득일보다 빠를 수 없습니다.');
            return;
        }

        const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365);
        const holdingYears = parseFloat(diffInYears.toFixed(2)); // 소수점 2자리까지만 유지
        const holdingYearsInt = Math.floor(holdingYears); // 소수점 버림하여 정수화
        holdingYearsDisplay.value = `${holdingYearsInt} 년`; // UI에 정수화된 보유 기간 표시

        // 양도차익 계산
        const acquisitionPrice = parseInt(totalAcquisitionDisplay.textContent.replace(/[^0-9]/g, '') || '0', 10); // 취득가액
        const expenses = parseInt(totalExpensesDisplay.textContent.replace(/[^0-9]/g, '') || '0', 10); // 필요경비
        const transferPrice = parseInt(document.getElementById('transferPrice')?.value.replace(/,/g, '') || '0', 10); // 양도가액
        const profit = transferPrice - acquisitionPrice - expenses;

        if (profit < 0) {
            alert('양도차익이 0보다 작습니다. 입력값을 확인해주세요.');
            return;
        }
        
        // 기본 세율 및 장기보유특별공제율 계산
        let taxRate = 0;
        let surcharge = 0;
        let longTermDeductionRate = 0;
        let longTermDeductionAmount = 0; // 장기보유특별공제 금액

        if (propertyTypeSelect.value === 'house') {
            const regulatedArea = document.getElementById('regulatedArea').value === 'yes'; // 조정대상지역 여부
            const singleHouseExemption = document.getElementById('singleHouseExemption').value === 'yes'; // 1세대 1주택 여부
            const isMultiHouseOwner = document.getElementById('singleHouseExemption').value === 'no'; // 다주택 여부

            if (regulatedArea && isMultiHouseOwner) {
                // 조정대상지역 다주택자는 공제율 0% (정책에 따라 다를 수 있음)
                longTermDeductionRate = 0;
            } else if (singleHouseExemption) {
                // 1세대 1주택자: 보유기간 3년 이상이면 매년 4% 적용 (최대 80%)
                longTermDeductionRate = holdingYearsInt >= 3 ? Math.min(holdingYearsInt * 0.04, 0.8) : 0;
            } else {
                // 다주택자 (조정대상지역이 아닌 경우): 보유기간 3년 이상이면 매년 2% 적용 (최대 30%)
                longTermDeductionRate = holdingYearsInt >= 3 ? Math.min(holdingYearsInt * 0.02, 0.3) : 0;
            }

            // 주택의 기본 세율 및 중과세율 설정
            taxRate = regulatedArea ? 0.2 : 0.1; // 조정대상지역은 20%, 비조정대상지역은 10%
            surcharge = regulatedArea ? 0.1 : 0; // 조정대상지역은 추가 10%, 비조정대상지역은 0%
        } else if (propertyTypeSelect.value === 'commercial') {
            // 토지/건물 (상업용)의 경우: 보유기간 3년부터 6%에서 시작하여 매년 2%씩 증가, 최대 30%
            if (holdingYearsInt >= 3) {
                longTermDeductionRate = Math.min((holdingYearsInt - 3) * 0.02 + 0.06, 0.3);
            } else {
                longTermDeductionRate = 0;
            }
        } else if (propertyTypeSelect.value === 'landForest') {
            // 토지/임야의 경우
            longTermDeductionRate = holdingYearsInt >= 3 ? Math.min(holdingYearsInt * 0.03, 0.3) : 0;
            taxRate = 0.15; // 기본 세율 15%
        } else if (propertyTypeSelect.value === 'unregistered') {
            // 미등기부동산의 경우
            longTermDeductionRate = 0; // 미등기부동산은 장기보유특별공제 없음
            taxRate = 0.7; // 고정 세율 70%
        } else if (propertyTypeSelect.value === 'others') {
            // 기타 권리
            longTermDeductionRate = 0;
            taxRate = 0.2; // 기타 권리는 고정 세율 20%
        }

        // 장기보유특별공제 금액 계산
        longTermDeductionAmount = profit * longTermDeductionRate;

        // 과세표준 계산 (장기보유특별공제 반영)
        let taxableProfit = profit - longTermDeductionAmount;

        // 1세대 1주택 비과세 조건 적용 (12억 비과세)
        let nonTaxableAmount = 0;
        if (propertyTypeSelect.value === 'house' && document.getElementById('singleHouseExemption').value === 'yes' && holdingYearsInt >= 2) {
            const taxExemptLimit = 1200000000;
            // 12억 한도 내에서 취득가액을 차감한 금액이 비과세 한도
            nonTaxableAmount = Math.max(taxExemptLimit - acquisitionPrice, 0);
            if (transferPrice <= taxExemptLimit) {
               taxableProfit = 0;
            } else {
                taxableProfit = Math.max(profit - nonTaxableAmount, 0);
            }
        }

        // 기본공제 적용 (과세표준에서 차감)
        const basicDeduction = propertyTypeSelect.value !== 'unregistered' ? 2500000 : 0; // 미등기 부동산 기본공제 없음
        let taxableProfitAfterDeduction = Math.max(taxableProfit - basicDeduction, 0);
        
        // 2023년 개정된 누진세율표
        const taxBrackets = [
            { limit: 14000000, rate: 0.06, deduction: 0 },
            { limit: 50000000, rate: 0.15, deduction: 1260000 },
            { limit: 88000000, rate: 0.24, deduction: 5760000 },
            { limit: 150000000, rate: 0.35, deduction: 15440000 },
            { limit: 300000000, rate: 0.38, deduction: 19940000 },
            { limit: 500000000, rate: 0.40, deduction: 25940000 },
            { limit: 1000000000, rate: 0.42, deduction: 35940000 },
            { limit: Infinity, rate: 0.45, deduction: 65940000 }
        ];

        // 양도소득세 계산 (누진세율 적용)
        let rawTax = 0;
        let remainingProfit = taxableProfitAfterDeduction; // 남은 과세표준

        for (let i = 0; i < taxBrackets.length; i++) {
            const bracket = taxBrackets[i];
            const previousLimit = i === 0 ? 0 : taxBrackets[i - 1].limit; // 이전 구간 상한

            // 현재 구간에서 남은 금액 계산
            if (remainingProfit <= 0) break; // 남은 금액이 없으면 종료
            const taxableAmount = Math.min(bracket.limit - previousLimit, remainingProfit);
            const taxForBracket = taxableAmount * bracket.rate; // 현재 구간의 세금 계산
            rawTax += taxForBracket; // 세금 누적
            remainingProfit -= taxableAmount; // 남은 금액 갱신
        }

        // 누진공제 적용
        const applicableDeduction = taxBrackets.find(bracket => taxableProfitAfterDeduction <= bracket.limit)?.deduction || 0;
        rawTax -= applicableDeduction; // 누진 공제 반영

        // 감면율 적용
        const selectedExemptionRate = getSelectedExemptionRate();
        let ruralTax = 0;

        if (propertyTypeSelect.value === 'commercial' && selectedExemptionRate > 0) {
            const taxReduction = rawTax * (selectedExemptionRate / 100);
            ruralTax = Math.floor(taxReduction * 0.2);
            rawTax -= taxReduction;
        }

        // 부가세 계산
        const educationTax = Math.floor(rawTax * 0.1);

        // 총 세금 계산
        const totalTax = rawTax + educationTax + ruralTax;

        // 결과 출력 (12억 비과세 금액 포함)
        document.getElementById('result').innerHTML = `
            <h3>계산 결과</h3>
            <p>보유 기간: ${holdingYearsInt} 년</p>
            <p>장기보유특별공제율: ${(longTermDeductionRate * 100).toFixed(1)}%</p>
            <p>양도차익: ${profit.toLocaleString()} 원</p>
            <p>장기보유특별공제 금액: ${longTermDeductionAmount.toLocaleString()} 원</p>
            <p>12억 비과세 금액: ${nonTaxableAmount.toLocaleString()} 원</p>
            <p>과세표준 (기본공제 후): ${taxableProfitAfterDeduction.toLocaleString()} 원</p>
            <p>감면율: ${selectedExemptionRate}%</p>
            <p>양도소득세: ${rawTax.toLocaleString()} 원</p>
            <p>지방교육세: ${educationTax.toLocaleString()} 원</p>
            <p>농어촌특별세: ${ruralTax.toLocaleString()} 원</p>
            <p><strong>총 세금: ${totalTax.toLocaleString()} 원</strong></p>
        `;
    });
});

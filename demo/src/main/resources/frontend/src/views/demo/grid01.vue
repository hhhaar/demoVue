<template>
	<div class="w3-main" style="margin-left:200px;">
	    <!-- Header -->
	    <header class="w3-container">
	        <h3><b><i class="fa fa-dashboard"></i> AUI Grid Default</b></h3>
	    </header>
	    <div class="w3-container">
			<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	    </div>
	</div>
</template>

<script>
// AUIGrid 컴포넌트
import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
import '@/static/AUIGrid-Vue.js/samples.css';
 
const PUBLIC_URL = process.env.BASE_URL;

export default {
	components: {
		AUIGrid
	},
	data: () => ({
		// 그리드 속성 정의
		gridProps: {
			width: '100%',
			height: 840,
			noDataMessage: '출력할 데이터가 없습니다.',
		},

		// 그리드 칼럼 레이아웃
		columnLayout: [
			{ 	dataField: 'USR_ID', headerText: '유저아이디' },
			{ 	dataField: 'USR_NM', headerText: '이름' },
			{ 	dataField: 'CNTRY', headerText: '국가' },
			{ 	dataField: 'PHONE', headerText: '폰모델' },
			{ 	dataField: 'COLOR', headerText: '색상' },
			{
				dataField: 'PRICE', headerText: '가격', dataType: 'numeric', style: 'my-right-column', width: 120,
				editRenderer: {
					type: 'InputEditRenderer',
					onlyNumeric: true, // 0~9만 입력가능
					textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					autoThousandSeparator: true // 천단위 구분자 삽입 여부
				}
			},
			{
				dataField: 'QUAN', headerText: '수량', dataType: 'numeric', style: 'my-right-column', width: 100,
				editRenderer: {
					type: 'InputEditRenderer',
					onlyNumeric: true, // 0~9만 입력가능
					textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					autoThousandSeparator: true // 천단위 구분자 삽입 여부
				}
			},
			{
				dataField: 'DT', headerText: '출시 날짜', dataType: 'date',
				dateInputFormat: 'yyyy-mm-dd', // 데이터의 날짜 형식
				formatString: 'yyyy년 mm월 dd일' // 그리드에 보여줄 날짜 형식
			}
		]
	}),
	created() {
		console.log('SampleDefault 생성됨');
	},
	mounted() {
		console.log('SampleDefault 마운트됨');
		// 초기 데이터 얻기
		this.requestGridData();
	},
	unmounted() {
		console.log('SampleDefault 언마운트됨');
	},
	methods: {
		// 그리드 데이터 조회하여 삽입
		requestGridData() {
			const grid = this.$refs.myGrid;
			const REQ_URL = '/v1/selectGridList';
			const param = {"k1":"v1"};
			grid.showAjaxLoader();
			this.$axios.get(REQ_URL, {param}).then((result) => {
				console.log(result);
				// 그리드 데이터 삽입
				grid.setGridData(result.data);
				grid.removeAjaxLoader();
			});
		}
	}
};
</script>
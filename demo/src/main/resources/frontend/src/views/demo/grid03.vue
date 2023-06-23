<template>
	<div class="w3-main" style="margin-left:200px;">
	    <!-- Header -->
	    <header class="w3-container">
	        <h3><b><i class="fa fa-dashboard"></i> AUI Grid Export</b></h3>
	    </header>
	    <div class="w3-container">
			<div style="display: inline-block;">
			</div>
			<div class="w3-right">
				<button @click="expExcel" class="w3-button w3-green">Excel Export</button>
				<button @click="expPdf" class="w3-button w3-orange">PDF Export</button>
			</div>
			<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	    </div>
	</div>
</template>

<script>
// AUIGrid 컴포넌트
import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
import '@/static/AUIGrid-Vue.js/samples.css';
import '@/static/AUIGrid.pdfkit/AUIGrid.pdfkit.js';
import 'file-saver';

const PUBLIC_URL = process.env.BASE_URL;

export default {
	components: {
		AUIGrid
	},
	data: () => ({
		// field
		conUserId:'',
		// 그리드 속성 정의
		gridProps: {
			width: '100%',
			height: 800,
			displayTreeOpen: true,
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
	mounted() {
		// 초기 데이터 얻기
		this.retrieve();
	},
	methods: {
		// 그리드 데이터 조회하여 삽입
		retrieve() {
			console.log("Retrieve Action");
			const grid = this.$refs.myGrid;
			const REQ_URL = '/v1/selectGridList';
			grid.showAjaxLoader();
			
			this.$axios.get(REQ_URL).then((result) => {
				console.log(result.data);
				// 그리드 데이터 삽입
				grid.setGridData(result.data);
				grid.removeAjaxLoader();
			});
		},
		// 엑셀로 내보내기
		expExcel() {
			
			const grid = this.$refs.myGrid;
			// 내보내기 실행
			grid.exportToXlsx({
				progressBar: true,
				fileName: this.getToDay()+'_EXPORT_EXCEL'
			});
		},
		// PDF 로 내보내기
		expPdf() {
			const grid = this.$refs.myGrid;

			// 완전한 HTML5 를 지원하는 브라우저에서만 PDF 저장 가능( IE=10부터 가능 )
			if (!grid.isAvailabePdf()) {
				alert('PDF 저장은 HTML5를 지원하는 최신 브라우저에서 가능합니다.(IE는 10부터 가능)');
				return;
			}

			// 내보내기 실행
			grid.exportToPdf({
				// 폰트 경로 지정 
				fontPath: 'https://mdn.github.io/css-examples/web-fonts/VeraSeBd.ttf',
				fileName: this.getToDay()+'EXPORT_PDF'
			});
		},
		getToDay(){
			const today = new Date();   
			const year = today.getFullYear(); // 년도
			const month = today.getMonth() + 1;  // 월
			const date = today.getDate();  // 날짜
			return year+''+month+""+date;
		}
	}
};
</script>
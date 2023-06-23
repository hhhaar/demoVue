<template>
	<div class="w3-main" style="margin-left:200px;">
	    <!-- Header -->
	    <header class="w3-container">
	        <h3><b><i class="fa fa-dashboard"></i> AUI Grid CRUD</b></h3>
	    </header>
	    <div class="w3-container">
			<div style="display: inline-block;">
				<table>
					<tr>
						<td><label>User ID</label></td>
						<td><input v-model="conUserId" class="w3-input" type="text"></td>
					</tr>
				</table>
			</div>
			<div class="w3-right">
				<button @click="retrieve" class="w3-button w3-gray">Retrieve</button>
				<button @click="add" class="w3-button w3-orange">Add</button>
				<button @click="del" class="w3-button w3-red">Delete</button>
				<button @click="save" class="w3-button w3-blue">Save</button>
			</div>
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
		// field
		conUserId:'',
		// 그리드 속성 정의
		gridProps: {
			width: '100%',
			height: 800,
			// 편집 가능 여부 (기본값 : false)
			editable: true,
			// 셀 병합 실행
			enableCellMerge: true,
			// 엔터키가 다음 행이 아닌 다음 칼럼으로 이동할지 여부 (기본값 : false)
			enterKeyColumnBase: true,
			// 셀 선택모드 (기본값: singleCell)
			selectionMode: 'multipleCells',
			// 컨텍스트 메뉴 사용 여부 (기본값 : false)
			useContextMenu: true,
			// 필터 사용 여부 (기본값 : false)
			enableFilter: true,
			// 그룹핑 패널 사용
			useGroupingPanel: true,
			// 상태 칼럼 사용
			showStateColumn: true,
			// 그룹핑 또는 트리로 만들었을 때 펼쳐지게 할지 여부 (기본값 : false)
			displayTreeOpen: true,
			// 삭제시 바로 그리드에서 제거 하지 않음
			//softRemoveRowMode : true,
			noDataMessage: '출력할 데이터가 없습니다.',
			groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.'
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
	methods: {
		// 그리드 데이터 조회하여 삽입
		retrieve() {
			console.log("Retrieve Action");
			const grid = this.$refs.myGrid;
			const REQ_URL = '/v1/selectGridList';
			grid.showAjaxLoader();
			
			const params = {userId:this.conUserId};
			this.$axios.get(REQ_URL, {params}).then((result) => {
				// 그리드 데이터 삽입
				grid.setGridData(result.data);
				grid.removeAjaxLoader();
			}).catch(function (e) {
				console.log(e);
				alert(e);
			});
		},
		add(){
			const obj = {
				USR_ID:"", USR_NM:"", CNTRY:""
				,PHONE:"",COLOR:"",PRICE:0,QUAN:0,
				DT:this.getToDay()
			}
			const grid = this.$refs.myGrid;
			grid.addRow(obj, 'first');
		},
		del(){
			console.log("Delete Action");
			const grid = this.$refs.myGrid;
			grid.removeRow('selectedIndex');
		},
		save(){
			
			const saveParams = this.getSaveData();
			console.log(saveParams);

			let count = saveParams.insert.length;
			count += saveParams.update.length;
			count += saveParams.delete.length;

			if( count== 0 ){
				alert("저장 데이터가 존재 하지 않습니다.");
				return false;
			}
			if(!confirm("저장 하시겠습니까?")){
				return false;
			}
			const jsonParams = JSON.stringify(saveParams);
			console.log(jsonParams);
			const REQ_URL = '/v1/save';
			this.$axios.post(REQ_URL, jsonParams
				, { headers: { "Content-Type": `application/json`} }
			).then((result) => {
				// 그리드 데이터 삽입
				alert(result.data+"건 처리 되었습니다.");
				this.retrieve();
			}).catch(function (e) {
				console.log(e);
				alert(e);
			});
		},
		getSaveData(){
			const grid = this.$refs.myGrid;
			const insert = grid.getAddedRowItems();
			console.log("Insert",insert);
			const update = grid.getEditedRowItems();
			console.log("Update", update);
			const del = grid.getRemovedItems();
			console.log("Delete", del);

			const saveData = {
				insert:insert ,
				update:update ,
				delete:del 
			};
			return saveData;
		},
		getToDay(){
			const today = new Date();   
			const year = today.getFullYear(); // 년도
			const month = today.getMonth() + 1;  // 월
			const date = today.getDate();  // 날짜
			return year+'-'+month+"-"+date;
		}
	}
};
</script>
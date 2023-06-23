<template>
	<div class="w3-main" style="margin-left:200px;">
	    <!-- Header -->
	    <header class="w3-container">
	        <h3><b><i class="fa fa-dashboard"></i> AUI Grid</b></h3>
	    </header>
	    <div class="w3-container">
			<div style="display: inline-block;">
				<table>
					<tr>
						<td><label>User ID</label></td>
						<td><input id="conUserId" class="w3-input" type="text"></td>
					</tr>
				</table>
			</div>
			<div class="w3-right">
				<button id="retrieve" class="w3-button w3-gray">Retrieve</button>
				<button id="regist" class="w3-button w3-orange">Regist</button>
				<button id="delete" class="w3-button w3-red">Delete</button>
			</div>
			<div id="grid" class="grid"></div>
	    </div>
	</div>
</template>

<script>
export default {
	setup(){ },
	mounted(){ },
  	methods: {
    	testClick(msg){
    		alert(msg);
    	},
    	test(msg){
    		alert(msg);
    	}
 	}
}

</script>

<style>
</style>

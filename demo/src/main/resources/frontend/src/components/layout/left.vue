<!--Menu-->
<template>
    <nav id="leftMenu" class="w3-sidebar w3-collapse w3-light-grey w3-animate-left" style="z-index:3;width:200px;" >
        <div class="w3-bar-block">
            <a @click="goPage('/')" class="w3-bar-item w3-button w3-padding w3-blue" data-path="/"><i class="fa fa-diamond fa-fw"></i>&nbsp; Home</a>
        	<a @click="goPage('/grid01')" class="w3-bar-item w3-button w3-padding w3-blue" data-path="/grid01"><i class="fa fa-diamond fa-fw"></i>&nbsp; AUI Grid Default</a>
            <a @click="goPage('/grid02')" class="w3-bar-item w3-button w3-padding w3-blue" data-path="/grid02"><i class="fa fa-diamond fa-fw"></i>&nbsp; AUI Grid CRUD</a>
            <a @click="goPage('/grid03')" class="w3-bar-item w3-button w3-padding w3-blue" data-path="/grid03"><i class="fa fa-diamond fa-fw"></i>&nbsp; AUI Grid Export</a>
        </div>
    </nav>
</template>


<script scope>
import { defineComponent } from 'vue';
export default defineComponent({
    methods:{
        goPage(_path){
            this.$emit("click-event", _path);
        }
    }
});
</script>
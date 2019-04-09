<template>
  <v-container grid-list-xs fluid :class="[background]">
    <v-layout column>
      <v-flex xs6 d-flex>
        <div :style="styleObj">
          <v-layout align-center justify-center fill-height>
            <div>
              <slot name='loading_info'></slot>
              <v-progress-circular indeterminate :color="color" v-if="spinnerType == 'circle'"></v-progress-circular>
              <div class="spinner" v-if="spinnerType == 'bars'">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
              </div>
              <div class="spinner2" v-if="spinnerType == 'bounce'">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
              </div>
            </div>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>
<script>
export default {
  props:{
    height:{
      type:String,
      default:'70vh'
    },
    spinnerType:{
      type:String,
      default:'circle'
    },
    color: {
      type: String,
      default: 'accent'
    },
    background:{
      type:String,
      default:'inherit'
    }
  },
  computed:{
    styleObj(){
      return {
        height:this.height ? this.height : '70vh',
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin MainColor(){
  //background:#fdba1e;
  background:#042943;
  color:#fff;
}
.spinner {
  margin: -10px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #4CAF50;
  margin-right:1px;
  height: 100%;
  width: 6px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
  background:#042943;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
  background:rgb(73, 112, 170);
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
  background:rgb(238, 34, 170);
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
  background:#042943;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}



.spinner2 {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  background-color: #8BC34A;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>



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
              
              <div class="spinners mt-3" v-if="spinnerType == 'double_circles'">
                <div class="spinner-block">
                  <div class="spinner spinner-1"></div>
                </div>
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
      default:'97vh'
    },
    spinnerType:{
      type:String,
      default:'double_circles'
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
        height: this.height ? this.height : '97vh',
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


//variables
  $bg-color: #fff; //container background-color;
  $basic-dark-color: #212121; //color of the spinner
  $outer-color: #4caf50; //color of the spinner
  $inner-color: #008080;
  $border-width: 4px; //width of spinners border
  $basic-spinner-dimensions: 70px; //width and height of spinner
  $main-spinner-dimensions: $basic-spinner-dimensions - $border-width * 2; //width and height of bigger circle
  $small-spinner-dimensions: $main-spinner-dimensions * 0.7; //width and height of smaller circle

.spinners {


  .spinner {
      position: relative;
      width: $basic-spinner-dimensions;
      height: $basic-spinner-dimensions;

      &:before,
      &:after {
        content: "";
        display: block;
        position: absolute;
        border-width: 4px;
        border-style: solid;
        border-radius: 50%;
      }
    }

  /* spinner-1 styles */
  .spinner.spinner-1 {
    
      @keyframes rotate-animation {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes anti-rotate-animation {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(-360deg);
      }
    }
    
    &:before {
      width: $main-spinner-dimensions;
      height: $main-spinner-dimensions;
      border-bottom-color: $outer-color;
      border-right-color: $outer-color;
      border-top-color: rgba($basic-dark-color, 0);
      border-left-color: rgba($basic-dark-color, 0);
      top: 0px;
      left: 0px;
      animation: rotate-animation 1s linear 0s infinite;
    }
    
    &:after {
      width: $small-spinner-dimensions;
      height: $small-spinner-dimensions;
      border-bottom-color: $inner-color;
      border-right-color: $inner-color;
      border-top-color: rgba($basic-dark-color, 0);
      border-left-color: rgba($basic-dark-color, 0);
      top: ($main-spinner-dimensions - $small-spinner-dimensions) / 2;
      left: ($main-spinner-dimensions - $small-spinner-dimensions) / 2;
      animation: anti-rotate-animation 0.85s linear 0s infinite;
    }
  }
}
</style>



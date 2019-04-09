import Vue from 'vue'
// import '@mdi/font/css/materialdesignicons.css'
import directives from 'vuetify/es5/directives';
import {
  Vuetify,
  VApp,
  transitions,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VCard,
  VAvatar,
  VSubheader,
  VDivider,
  VSlider,
  VTabs,
  VTooltip,
  VMenu,
  VSnackbar,
  VDialog,
  VBadge,
  VDataIterator,
  VImg,
  VTimeline,
  VTextarea,
  VProgressLinear,
  VProgressCircular,
  VForm,
  VChip,
  VStepper,
  VDatePicker,
  VTimePicker,
  VTextField,
  VSwitch,
  VSelect,
  VSpeedDial,
  VCheckbox,
  VHover,
  VAlert,
  VWindow,
  VRadioGroup,
  VAutocomplete,
  VDataTable,
  VExpansionPanel,
  VSparkline,
  VSheet
} from 'vuetify'
//import api from '@/services/api'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/lib/util/colors';


Vue.use(Vuetify, {
  // iconfont: 'mdi',
  components: {
    VApp,
    transitions,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VCard,
    VAvatar,
    VSubheader,
    VDivider,
    VTabs,
    VTooltip,
    VMenu,
    VSnackbar,
    VDialog,
    VBadge,
    VImg,
    VTimeline,
    VTextarea,
    VProgressLinear,
    VProgressCircular,
    VForm,
    VChip,
    VStepper,
    VDatePicker,
    VTimePicker,
    VTextField,
    VSwitch,
    VSelect,
    VSpeedDial,
    VCheckbox,
    VHover,
    VSlider,
    VAlert,
    VWindow,
    VRadioGroup,
    VAutocomplete,
    VDataTable,
    VExpansionPanel,
    VDataIterator,
    VSparkline,
    VSheet,
  },
  directives,
  theme: {
    primary: '#ee44aa',
    secondary: '#1867c0',
    //accent: '#82B1FF',
    accent: colors.blue.darken2,
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    dark:'#424242',
    main: '#1c1f35'
  },
})

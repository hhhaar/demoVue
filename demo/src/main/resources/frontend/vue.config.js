//const { defineConfig } = require('@vue/cli-service')
//module.exports = defineConfig({
//  transpileDependencies: true
//})

module.exports = {  
  outputDir: "../static/dist",             // outputDir은 npm run build로 빌드 시 파일이 생성되는 위치
  indexPath: "../index.html",                     // indexPath는 index.html 파일이 생성될 위치를 지정
  devServer: {                                           // devServer는 Back-End , 즉 Spring Boot의 내장 was의 주소를 작성하게 되면 된다.
    port: 8080,
    proxy: "http://localhost:8081"  
  },  
  chainWebpack: config => {  
    const svgRule = config.module.rule("svg");    
    svgRule.uses.clear();    
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");  
  }  
};

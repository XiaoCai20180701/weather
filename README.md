项目结构：
├── README.md
├── client                    // 小程序 client 部分，主要编写内容
│   ├── app.js
│   ├── app.json
│   ├── app.scss
│   ├── project.config.json  // 小程序项目配置，如云函数文件夹
│   ├── components           // 组件
│   ├── images               // 图片资源
│   ├── lib
│   │   ├── api-mock.js      // api-mock 功能，详见文档「云函数 mock」部分
│   │   ├── api.js           // 实际 api
│   │   ├── bluebird.js
│   │   └── util.js
│   └── pages
│       └── index
├── config.server.json
├── dist
├── gulpfile.js
├── package.json
├── server                   // 小程序 server 部分，主要是静态资源和云函数
│   ├── cloud-functions
│   │   ├── test
│   │   └── test2
│   ├── index.js
│   ├── inline               // 云函数公共模块，打包的时候会 inline 进引入的云函数
│   │   └── utils.js
│   └── static
│       └── gulp.png
└── test                     // 测试文件夹
    └── functions            // 存储小程序云函数测试用的参数模板
        └── test.json
# 交易行

## 项目目录结构

```
├── public\                  # 静态资源目录
│   └── vite.svg            # Vite 默认logo
├── src\                     # 源代码目录
│   ├── assets\             # 静态资源(图片、字体等)
│   ├── components\         # 公共组件
│   ├── layout\            # 布局组件
│   │   ├── components\    # 布局相关子组件
│   │   └── index.vue      # 主布局文件
│   ├── router\            # 路由配置
│   │   ├── index.ts       # 路由入口文件
│   │   ├── module\       # 模块路由
│   │   └── permissionGuard.ts  # 路由权限守卫
│   ├── store\             # 状态管理
│   │   ├── index.ts       # store入口文件
│   │   └── module\       # 模块store
│   ├── styles\            # 全局样式
│   │   └── index.scss    # 主样式文件
│   ├── utils\             # 工具函数
│   │   ├── auth.ts       # 权限相关工具
│   │   └── index.ts      # 工具函数入口
│   ├── views\            # 页面视图
│   │   └── system\      # 系统相关页面
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口文件
│   └── vite-env.d.ts     # Vite环境类型声明
├── .env.development       # 开发环境变量
├── .env.pre               # 预发布环境变量
├── .env.production        # 生产环境变量
├── .eslintrc.json         # ESLint配置
├── .gitignore             # Git忽略规则
├── .prettierrc.json       # Prettier配置
├── auto-imports.d.ts      # 自动导入类型声明
├── components.d.ts       # 组件类型声明
├── index.html            # 主HTML文件
├── package-lock.json     # npm依赖锁定文件
├── package.json          # 项目配置
├── pnpm-lock.yaml        # pnpm依赖锁定文件
├── README.md            # 项目说明文档
├── tag.bat              # 版本标签脚本
├── tsconfig.json        # TypeScript配置
└── vite.config.ts       # Vite配置
```
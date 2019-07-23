# boms_web
行李平台-vue+原生js



目录结构
┣ dist				部署包
┣ src
┃ ┣ api			axios请求封装方法（js）
┃ ┣ assets			资源文件（font/img）
┃ ┣ components	
┃ ┃ ┣ view 公共封装组件
┃ ┃ ┃ ┣ CsProgress    	进度条
┃ ┃ ┃ ┣ DateRangePicker	时间区间
┃ ┃ ┃ ┣ Dialog		弹出框
┃ ┃ ┃ ┣ DropMenu     	一级菜单
┃ ┃ ┃ ┣ Filters     	公共过滤方法
┃ ┃ ┃ ┣ InputList    	下拉框（elementui替换）
┃ ┃ ┃ ┣ InputListMore	下拉多选框（elementui替换）
┃ ┃ ┃ ┗ Inputs              输入框
┃ ┃ ┃ ┣ InputTag    	封装的带label的输入框
┃ ┃ ┃ ┣ MenuList    	二级菜单
┃ ┃ ┃ ┣ MenuRight           右键菜单
┃ ┃ ┃ ┣ ...
┃ ┃ ┃
┃ ┃ ┗ mixin		        公共封装混入文件
┃ ┃    ┣ baseMixin		当前日期、时间——首次同步服务器后定时刷新
┃ ┃    ┣ flightTableMixin    航班动态列设置
┃ ┃    ┣ lugTableMixin       行李动态设置
┃ ┃    ┣ formMixin           增删改查
┃ ┃    ┣ tableMixin          分页列表数据、操作（基础数据）
┃ ┃    ┣ utilMixin           工具
┃ ┃    ┗ webSocketMixin	连接websocket
┃ ┣ views
┃ ┃ ┣ comprhsQuery           信息共享平台
┃ ┃ ┃ ┗ detail           	详情
┃ ┃ ┃    ┣ FltDetail        航班详情
┃ ┃ ┃    ┣ lugDetail 	行李详情
┃ ┃ ┃ ┣ history      	查询列表
┃ ┃ ┃    ┣ FltHis           航班历史
┃ ┃ ┃    ┣ FltNow   	航班动态查询
┃ ┃ ┃    ┣ LugHis           行李历史
┃ ┃ ┃    ┣ LugNow   	行李动态
┃ ┃ ┃ ┗ index.js		无用
┃ ┃ ┣ config                 配置管理
┃ ┃ ┃ ┗ detail           	详情
┃ ┃ ┃    ┣ DepartmentDetail 部门详情
┃ ┃ ┃    ┣ ...
┃ ┃ ┃ ┣ Departemnt     	部门查询
┃ ┃ ┃ ┗ index.js		无用
┃ ┃ ┣ protection             保障协同管理
┃ ┃ ┃ ┣ AircraftType	机型
┃ ┃ ┃ ┣ Counter         	值机柜台
┃ ┃ ┃ ┣ Stand           	机位
┃ ┃ ┃ ┗ index.js		无用
┃ ┃ ┣ home                   页面header
┃ ┃ ┃ ┗ common        	公共组件
┃ ┃ ┃    ┣ ConfirmTip       提示框
┃ ┃ ┃    ┣ Detail           公共的编辑新增详情页面
┃ ┃ ┃ ┣ module         	公共组件（页面各一级菜单）
┃ ┃ ┃    ┣ ComprhsQuery     信息共享平台入口
┃ ┃ ┃    ┣ Config           配置管理入口
┃ ┃ ┃    ┣ Protection       保障协同管理入口
┃ ┃ ┃ ┣ home               页面一级菜单入口
┃ ┃ ┃ ┣ login              登录
┃ ┃ ┃ ┣ ResrcMenu          配置管理二级菜单
┃ ┃ ┃ ┗ SecondMenu         二级菜单
┃ ┃ ┃
┃ ┃ ┗ mixin		        公共封装混入文件
┃ ┃   
┃ ┣ axios.conf.js	        配置转发路径 axios配置文件（request/response基础配置及拦截器）
┃ ┃
┃ ┣ router			配置路由
┃ ┣ store			
┃ ┃ ┣ modules
┃ ┃ ┃┣ baseStore.js	首次登录记录及最后登录时间
┃ ┃ ┃┣ config.js	长链接及dfs等相关配置
┃ ┃ ┃┗ enum.js	业务通用配置信息
┃ ┃ ┃
┃ ┃ ┗ index.js
┃ ┃
┃ ┣ App.vue		配置转发路径
┃ ┗ main.js		配置转发路径
┣ static		静态资源文件
┣ test			测试
┣ package.json		依赖配置
┗ …

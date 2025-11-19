const dotenv = require('dotenv')
module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: process.env.API_BASE_URL,
				changeOrigin: true
			}
		}
	},
	chainWebpack: config => {
		config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
			const compile = options.compiler.compile
			options.compiler.compile = (template, info) => {
				if (info.resourcePath.match(/^pages/)) {
					template = template.trim()
					template = template.replace(/^<[\d\D]+?>/g, _ => `${_}
	                        <AuthModel ref='authModel' style="z-index: 9999;"></AuthModel>
	                    `)
					// console.log(template);
				}
				return compile(template, info)
			}
			return options
		})
		config
			.plugin('define')
			.tap(args => {
				const config = getEnvsByDot()
				Object.keys(config).forEach(key => {
					if (typeof config[key] == "string") {
						config[key] = '"' + config[key] + '"'
					}
					args[0]['process.env'][key] = config[key]
				})
				console.log(args);
				return args
			})
	}
}

/**  
 * 从.env中获取  
 * 使用了dotenv依赖  
 * 模仿vue-cli-service，不是APP_VUE*这个开头的全局变量就会被过滤掉  
 */
function getEnvsByDot() {
	let dotEnvs = {}
	//2.再加载专属环境变量  
	let env = 'local'
	if (process.env.NODE_ENV === 'development') {
		env = 'dev'
	} else if (process.env.NODE_ENV === 'production') {
		env = 'prod'
	} else {
		env = process.env.NODE_ENV
	}
	const envPath = __dirname + '/.env.' + env
	const dotEnvsConfig = dotenv.config({
		path: envPath
	})
	console.log(dotEnvsConfig)
	if (!dotEnvsConfig.error) {
		Object.keys(dotEnvsConfig.parsed).forEach(key => {
			dotEnvs[key] = dotEnvsConfig.parsed[key]
		})
	}
	return dotEnvs
}
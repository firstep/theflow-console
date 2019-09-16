/**  
 * REST Client for Stateless-API.
 * auther: Alvin4u
 * contact: firstep@qq.com
 */
import axios from 'axios'

const instance = axios.create({
	baseURL: process.env.VUE_APP_BASEURL,
	timeout: 60000
})

const REST = {
	BASE_URL: process.env.VUE_APP_BASEURL
}

let execute = async function(uri, method, param={}, config={}){
	let response = null

	try{
		if(method === 'get' || method === 'delete') {
			config.params = param
			response = await instance[method](uri, config)
		} else {
			response = await instance[method](uri, param, config)
		}
	}catch(err){
		response = err
	}
	return response
}

const methods = ['get', 'post', 'put', 'patch', 'delete']
methods.forEach(method => {
	REST[method] = function(uri, param, config) {
		return execute(uri, method, param || {}, config || {})
	}
})

//request拦截
instance.interceptors.request.use(
	config => {
		config.headers['Authorization'] = "Bearer " + localStorage.getItem('token')
		return config
	},
	error => {
		return null//Promise.reject(error)
	}
)

instance.interceptors.response.use(
	response => {
		let token = response.headers.authorization
		if(token)
			localStorage.setItem('token', token)
		return response.data === "" ? true : response.data
	},
	error => {
		if(error.response && error.response.status == 401) {
			window.vm.$router.push("/login")
		} else {
			window.vm.$dialog.message.error(error.response && error.response.data.message || error.message, {
			  position: 'top'
			})
		}
		return null//Promise.reject(error)
	}
)

export default REST
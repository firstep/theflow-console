/* Copyright 2005-2015 Alfresco Software, Ltd.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var FLOWABLE = FLOWABLE || {};

var baseURL;
if(window.parent && window.parent.vm) {
	baseURL = window.parent.vm.$REST.BASE_URL
} else {
	console.error('This page must be nested in TheFlow.')
}

//var pathname = window.location.pathname.replace(/^(\/[^\/]*)(\/.*)?$/, '$1').replace(/\/$/, '');
var pathname = ""
FLOWABLE.CONFIG = {
	'onPremise' : true,
	'contextRoot' : baseURL,
	'webContextRoot' : pathname,
	'datesLocalization' : false
};

jQuery.ajaxSetup({
	global: false,
	beforeSend: function (jqXHR, settings) {
		jqXHR.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'))
	},
	complete: function(xhr, ts) {
		var token = xhr.getResponseHeader("authorization");
		if(token) {
			localStorage.setItem('token', token)
		}
		if(xhr.status === 401) {
			if(window.parent) {
				window.parent.vm.$router.push("/login")
			}
		}
	}
});
var huewaco_lib = function(settings)
	{
		const _this = this;
		let districts;
		let wards;
		this.settings = {
                "base_url": "http://localhost:15537",
				"cache": false,
                "method": "POST",
                "timeout": -1,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": "",
            };
		for (i in settings) {
			this.settings[i] = settings[i];
		};
		huewaco_lib.prototype.init = async function()
		{
			this.validation();
			console.log(this.getParam("state"));
			this.districts = await this.getTheDistricts();
			console.log(this.districts);
			this.wards = await this.getTheWards();
		};
		// Validation
		this.validation = function()
		{
			// Fetch all the forms we want to apply custom Bootstrap validation styles to
			var forms = document.getElementsByClassName('needs-validation');
			// Loop over them and prevent submission
			var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
			});
		};		
		huewaco_lib.prototype.getParam = function(pName, url)
		{
			let value = "";
			if (!url) url = window.location.href;
			var queryString = url.split('?');
            if (queryString.length > 1)
            {
                var ObjParam = queryString[1].split('&');
                // Duyệt parameters để lấy giá tri Auth Code trước khi gửi request để lấy Access_token OA
                // So sánh tên param để lấy đúng giá trị
				console.log(ObjParam);
                ObjParam.forEach(strParam =>{
					var param = strParam.split('=');
                    if (param[0] == pName)
                    {
                        value = param[1];
						return;
                    }
				});
            }
			return value;
		};
		huewaco_lib.prototype.getTheWardsByDistrictID = function(id)
		{
			const districts = [];
			if(this.wards.code == 0 && this.wards.data !== undefined)
			{
				let index = 0;
				this.wards.data.forEach(element => {
					if(element.DistrictID == id)
					{
						districts[index++] = element;
					}
				});
			}
			console.log(districts);
			return districts;
		};
		huewaco_lib.prototype.getTheDistricts = async function()
		{
			const endPoint = "/api/get-the-district-list";
			var settings = {
                "url": this.settings.base_url + endPoint,
                "method": "GET",
				"headers": {
					"access_token": "1299ef8cfe980df2eed6c578aaa360a7"
				},
				"cache": this.settings.cache,
                "timeout": this.settings.timeout
            };			
			return await $.ajax(settings).done(function (response) {
                return response;
                
            }).fail(function(data) {
				console.log("Error: ", data);
				return null;
			});
		};
		huewaco_lib.prototype.getTheWards = async function()
		{
			const endPoint = "/api/get-the-ward-list";
			var settings = {
                "url": this.settings.base_url + endPoint,
                "method": "GET",
				"headers": {
					"access_token": "1299ef8cfe980df2eed6c578aaa360a7"
				},
				"cache": this.settings.cache,
                "timeout": this.settings.timeout
            };			
			return await $.ajax(settings).done(function (response) {
                return response;
                
            }).fail(function(data) {
				console.log("Error: ", data);
				return null;
			});
		};
		huewaco_lib.prototype.readAccessTokenHueS = async function(state)
		{
			const endPoint = "/api/hues/get-access-token";
			var settings = {
                "url": this.settings.base_url + endPoint + "?state=" + state,
                "method": "GET",
				"cache": this.settings.cache,
                "timeout": this.settings.timeout,
            };
			console.log(settings);
			return await $.ajax(settings).done(function (response) {
                return response;
                
            }).fail(function(data) {
				console.log("Error: ", data);
				return null;
			});
		};
		huewaco_lib.prototype.getAccessTokenHueS = async function()
		{
			const endPoint = "/api/hues/get-access-token";
			var settings = {
                "url": this.settings.base_url + endPoint + "?state=",
                "method": "GET",
				"cache": this.settings.cache,
                "timeout": this.settings.timeout,
            };
			console.log(settings);
			return await $.ajax(settings).done(function (response) {
                return response;
                
            }).fail(function(data) {
				console.log("Error: ", data);
				return null;
			});
		};
		huewaco_lib.prototype.getUserInfo = async function(access_token)
		{
			const endPoint = "/api/hues/get-user-info";
			var settings = {
                "url": this.settings.base_url + endPoint,
                "method": "POST",
                "timeout": -1,
                "headers": {
                    "Content-Type": "application/json",
					"access_token": access_token,
                },
                "data": JSON.stringify({
                    "access_token": access_token
                }),
            };
			return await $.ajax(settings).done(function (response) {                
                console.log(response);
                return response;
                
            }).fail(function(data) {
				console.log("Error: ", data);
				return null;
			});
		};
		huewaco_lib.prototype.waterInstallationRequest = async function(res)
		{
			const endPoint = "/api/water-installation";			
			var settings = {
                "url": this.settings.base_url + endPoint,
                "method": "POST",
                "cache": this.settings.cache,
                "timeout": this.settings.timeout,
                "headers": {
                    "Content-Type": "application/json",
					"access_token": "1299ef8cfe980df2eed6c578aaa360a7",
                },
                "data": JSON.stringify(res),
            };
			return await $.ajax(settings).done(function (response) {                
                console.log(response);
                return response;
                
            }).fail(function(data) {
				console.log("Error: ", data);
				return null;
			});
		}
		huewaco_lib.prototype.setCookie = function (cname, cvalue, exdays = 0) {
			const d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			let expires = "expires="+ d.toUTCString();
			document.cookie = cname + "=" + cvalue  + (exdays <= 0 ? "" : + ";" + expires) + ";path=/";
		};
		huewaco_lib.prototype.getCookie = function(cname)
		{
			let name = cname + "=";
			let decodedCookie = decodeURIComponent(document.cookie);
			let ca = decodedCookie.split(';');
			for(let i = 0; i <ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) == ' ') {
				c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
				}
			}
			return "";
		};
		huewaco_lib.prototype.getDateToString = function()
		{
			var today = new Date();
			var day = today.getDate() + "";
			var month = (today.getMonth() + 1) + "";
			var year = today.getFullYear() + "";
			var hour = today.getHours() + "";
			var minutes = today.getMinutes() + "";
			var seconds = today.getSeconds() + "";

			day = this.checkZero(day);
			month = this.checkZero(month);
			year = this.checkZero(year);
			hour = this.checkZero(hour);
			minutes = this.checkZero(minutes);
			seconds = this.checkZero(seconds);
			const strDate = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
			console.log(strDate);
			return strDate;
		};
		this.checkZero = function(data){
			if(data.length == 1){
				data = "0" + data;
			}
			return data;
		}
	};
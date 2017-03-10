var preditctionParams = []
function getWealthIndex(){
	return preditctionParams['wealth_index'];
}
function getEducationIndex(){
	return preditctionParams['education_index'];
}
function getAverageSalary(){
	return preditctionParams['average_salary'];
}
function getMarketIndex(){
	return preditctionParams['market_index'];
}
function getMarketVolume(){
	return preditctionParams['market_volume'];
}
function getLocalPercent(){
	return preditctionParams['local_percent'];
}
function getLocalPrice(){
	return preditctionParams['local_price'];
}
function getLocalQuality(){
	return preditctionParams['local_quality'];
}
function getPrice(){
	return preditctionParams['price'];
}
function getShopSize(){
	return preditctionParams['shop_size'];
}
function getTownDistrict(){
	return preditctionParams['town_district'];
}
function getDepartmentCount(){
	return preditctionParams['department_count'];
}
function getBrand(){
	return preditctionParams['brand'];
}
function getQuality(){
	return preditctionParams['quality'];
}
function getNotoriety(){
	return preditctionParams['notoriety'];
}
function getVisitorsCount(){
	return preditctionParams['visitors_count'];
}
function getServiceLevel(){
	return preditctionParams['service_level'];
}
function getSellerCount(){
	return preditctionParams['seller_count'];
}
function getRealm(){
	return $('#realm').val();
}
function getProductId(){
	return $('#id_product').val();
}
function getProductCategory(){
	return $('#id_category ').val();
}
function nvl(val1, val2){
	if (val1 == null || val1 == ''){
		return val2;
	} else {
		return val1;
	}
}
function getVal(spName){
	return JSON.parse(window.localStorage.getItem(spName));
}
function setVal(spName, pValue){
	window.localStorage.setItem(spName,JSON.stringify(pValue));
}
function loadSavedFlt(){
	//var params = getSearchParameters();
	var realm = getVal('realm');
	var id_country = getVal('id_country');
	var id_region = getVal('id_region');
	var id_category = getVal('id_category');
	var id_product = getVal('id_product');
	
	$('#shopSize').val(getVal('shopSize'));
	$('#townDistrict').val(getVal('townDistrict'));
	$('#departmentCount').val(getVal('departmentCount'));
	$('#brandFrom').val(getVal('brandFrom'));
	$('#priceFrom').val(getVal('priceFrom'));
	$('#qualityFrom').val(getVal('qualityFrom'));
	$('#notoriety').val(getVal('notoriety'));
	$('#visitorsСount').val(getVal('visitorsСount'));
	$('#serviceLevel').val(getVal('serviceLevel'));
	
	if (realm != null || realm != '') {
		$('#realm').val(realm);
		var loadProductsCallback = function() {
			//console.log("$('#products').childNodes.length = " + document.getElementById('products').childNodes.length);
			if (id_product == null || id_product == '') return;
			changeProduct(id_product);
		};
		var productCategoriesCallback = function() {
			//console.log("$('#id_category').childNodes.length = " + document.getElementById('id_category').childNodes.length);
			if (id_category == null || id_category == '') return;
			$('#id_category').val(id_category);
			loadProducts(loadProductsCallback);
  		};
		var changeCountryCallback = function() {
			if (id_region != null || id_region != '') {
				$('#id_region').val(id_region);
				//console.log("$('#id_region').childNodes.length = " + document.getElementById('id_region').childNodes.length);
				changeRegion();
			}
  		};
		var countryCallback = function() {
			if (id_country != null || id_country != '') {
				$('#id_country').val(id_country);
				//console.log("$('#id_country').childNodes.length = " + document.getElementById('id_country').childNodes.length);
				changeCountry(changeCountryCallback);
			}
  		};
		changeRealm(productCategoriesCallback, countryCallback);
		
	} else {
		loadProductCategories();
		loadCountries();
		fillUpdateDate();
	}
}
function tableSortFunc(spColId, a,b){
		//console.log('spColId = '+spColId);
		var cellValA = a.elm.querySelector('#td_'+spColId).innerHTML;
		var cellValB = b.elm.querySelector('#td_'+spColId).innerHTML;
		
		if (spColId == "volume_set" || spColId == "volume_cv"){
			//console.log('a.elm = '+a.elm);
			var partsOfStrA = cellValA.split(' ');
			var partsOfStrB = cellValB.split(' ');
			
			var numA = parseFloat(partsOfStrA[1]);
			var numB = parseFloat(partsOfStrB[1]);
			console.log('numA = '+numA);
			console.log('numB = '+numB);
			
			if (numA > numB){
				console.log('numA > numB');
				return 1;
			} else if (numA < numB) {
				console.log('numA < numB');
				return -1;
			} else {
				var kvalA = partsOfStrA[0];
				var kvalB = partsOfStrB[0];
				console.log('kvalA = '+kvalA);
				console.log('kvalB = '+kvalB);
				
				if (kvalA == "более" && kvalB != "более"){
					console.log('kvalA == "более" && kvalB != "более"');
					return 1;
				} else if (kvalA == "около" && kvalB != "около"){
					console.log('kvalA == "около" && kvalB != "около"');
					return 1;
				} else {
					console.log('else');
					return -1;
				}
			}
		} else {
			return cellValA === cellValB ? 0 : (cellValA > cellValB ? 1 : -1);
		}
}
var coefficients = {"name": "PRICE","attrs": [{"name": "AVERAGE_SALARY","coef": 0.0122,"values": []},{"name": "LOCAL_PRICE","coef": 0.6621,"values": []},{"name": "LOCAL_QUALITY","coef": -0.4266,"values": []},{"name": "SHOP_SIZE","coef": 7.8021,"values": ["2","1","5","4","100000","1000","10000"]},{"name": "SHOP_SIZE","coef": -4.7147,"values": ["1000","10000"]},{"name": "TOWN_DISTRICT","coef": 7.6715,"values": ["Фешенебельный район"]},{"name": "DEPARTMENT_COUNT","coef": 5.4658,"values": ["3","9","7","5","6","1","8"]},{"name": "DEPARTMENT_COUNT","coef": -4.4476,"values": ["9","7","5","6","1","8"]},{"name": "DEPARTMENT_COUNT","coef": -32.4229,"values": ["7","5","6","1","8"]},{"name": "DEPARTMENT_COUNT","coef": 25.8548,"values": ["5","6","1","8"]},{"name": "DEPARTMENT_COUNT","coef": 8.7145,"values": ["6","1","8"]},{"name": "DEPARTMENT_COUNT","coef": 5.1224,"values": ["1","8"]},{"name": "DEPARTMENT_COUNT","coef": -17.9878,"values": ["8"]},{"name": "BRAND","coef": 2.7188,"values": []},{"name": "QUALITY","coef": 0.2904,"values": []},{"name": "NOTORIETY","coef": 0.0195,"values": []},{"name": "VISITORS_COUNT","coef": 3.8787,"values": ["около 500","более 1 000","более 20 000","менее 50","около 10 000","около 100","около 50 000","более 1 000 000","более 200 000","около 5 000","более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 9.6383,"values": ["около 100","около 50 000","более 1 000 000","более 200 000","около 5 000","более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": -20.1504,"values": ["около 50 000","более 1 000 000","более 200 000","около 5 000","более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 10.6222,"values": ["более 1 000 000","более 200 000","около 5 000","более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": -7.5533,"values": ["более 200 000","около 5 000","более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 4.0339,"values": ["около 5 000","более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": -8.0725,"values": ["более 100 000","более 30 000","около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 12.4751,"values": ["около 1 000 000","более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 6.9921,"values": ["более 2 000","более 300 000","около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 9.8393,"values": ["около 1 000","около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": -12.725,"values": ["около 500 000","более 300","более 2 000 000"]},{"name": "VISITORS_COUNT","coef": 30.7286,"values": ["более 300","более 2 000 000"]},{"name": "SERVICE_LEVEL","coef": -12.9559,"values": ["Низкий","Высокий","Элитный","Нормальный","Очень высокий"]},{"name": "SERVICE_LEVEL","coef": 12.7172,"values": ["Высокий","Элитный","Нормальный","Очень высокий"]},{"name": "SELLER_COUNT","coef": 6.9073,"values": ["27","17","10","31","28","25","13","21","8","14","5","6","7","4","50","51","41","47","43","45","46","44","40","26","37","52","39","30","29","33","32","0","34","36","3","2","1"]},{"name": "SELLER_COUNT","coef": -6.2837,"values": ["17","10","31","28","25","13","21","8","14","5","6","7","4","50","51","41","47","43","45","46","44","40","26","37","52","39","30","29","33","32","0","34","36","3","2","1"]},{"name": "SELLER_COUNT","coef": -3.6653,"values": ["31","28","25","13","21","8","14","5","6","7","4","50","51","41","47","43","45","46","44","40","26","37","52","39","30","29","33","32","0","34","36","3","2","1"]},{"name": "SELLER_COUNT","coef": 10.0576,"values": ["28","25","13","21","8","14","5","6","7","4","50","51","41","47","43","45","46","44","40","26","37","52","39","30","29","33","32","0","34","36","3","2","1"]},{"name": "SELLER_COUNT","coef": -6.499,"values": ["25","13","21","8","14","5","6","7","4","50","51","41","47","43","45","46","44","40","26","37","52","39","30","29","33","32","0","34","36","3","2","1"]},{"name": "SELLER_COUNT","coef": 22.3559,"values": ["1"]},{"name": "SELL_VOLUME_NUMBER","coef": 0,"values": []}],"coef": -11.215};
//////////////////////////////////////////////////////
function loadData() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var productID = getProductId();
	if (productID == null || productID == '') return;
	
	setVal('shopSize', $('#shopSize').val());
	setVal('townDistrict', $('#townDistrict').val());
	setVal('departmentCount', $('#departmentCount').val());
	setVal('brandFrom', $('#brandFrom').val());
	setVal('priceFrom', $('#priceFrom').val());
	setVal('qualityFrom', $('#qualityFrom').val());
	setVal('notoriety', $('#notoriety').val());
	setVal('visitorsСount', $('#visitorsСount').val());
	setVal('serviceLevel', $('#serviceLevel').val());
		
	
	$.getJSON('/by_trade_at_cities/'+realm+'/tradeAtCity_'+productID+'.json', function (data) {
		  var output = '';
		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.pi == $('#id_product').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.ci == nvl($('#id_country').val(),val.ci)) {suitable = true;} else {suitable = false;}
			if (suitable && val.ri == nvl($('#id_region').val(),val.ri)) {suitable = true;} else {suitable = false;}
			
			if(suitable){
				preditctionParams['wealth_index'] = val.wi;
				preditctionParams['education_index'] = val.ei;
				preditctionParams['market_index'] = val.mi;
				preditctionParams['market_volume'] = val.v;
				preditctionParams['local_percent'] = val.lpe;
				preditctionParams['price'] = parseFloat($('#priceFrom').val());
				
				var price = coefficients.coef;
				for(var a = 0; a < coefficients.attrs.length; ++a){
				  if(coefficients.attrs[a].values.length === 0){
				    price += coefficients.attrs[a].coef;
				  } else {
				    var value = 0;
				    switch(coefficients.attrs[a].name){
					    case 'AVERAGE_SALARY': value = val.as;
					    break;
					    case 'LOCAL_PRICE': value = val.lpr;
					    break;
					    case 'LOCAL_QUALITY': value = val.lq;
					    break;
					    case 'SHOP_SIZE': value = $('#shopSize').val();
					    break;
					    case 'TOWN_DISTRICT': value = $('#townDistrict').val();
					    break;
					    case 'DEPARTMENT_COUNT': value = parseFloat($('#departmentCount').val());
					    break;
					    case 'BRAND': value = parseFloat($('#brandFrom').val());
					    break;
					    case 'QUALITY': value = parseFloat($('#qualityFrom').val());
					    break;
					    case 'NOTORIETY': value = parseFloat($('#notoriety').val());
					    break;
					    case 'VISITORS_COUNT': value = $('#visitorsСount').val();
					    break;
					    case 'SERVICE_LEVEL': value = $('#serviceLevel').val();
					    break;
					    case 'SELLER_COUNT': value = val.sc;
					    break;
					    case 'SELL_VOLUME_NUMBER': value = parseFloat(val.v) * 0.1; //10%
					    break;
				    }
				    for(var v = 0; v < coefficients.attrs[a].values.length; ++v){
				      if(value == coefficients.attrs[a].values[v]){
					price += coefficients.attrs[a].coef;
				      }
				    }
				  }
				}
				output += '<tr class="trec">';
				output += '<td id="td_city"><a target="_blank" href="http://virtonomica.ru/'+realm+'/main/globalreport/marketing/by_trade_at_cities/'+val.pi+'/'+val.ci+'/'+val.ri+'/'+val.ti+'">'+val.tc+'</a></td>';
				output += '<td align="right" id="td_volume_set">'+price+'</td>';
				output += '<td align="right" id="td_volume_cv">'+val.spr+'</td>';
				output += '<td align="right" id="td_volume_perc_set">'+val.lpr+'</td>';
				output += '<td align="right" id="td_volume_perc_cv">'+''+'</td>';
				output += '</tr>';
			}
		});
		$('#xtabletbody').html(output); 	// replace all existing content
		
		var svOrder = $('#sort_dir').val();
		var svColId = $('#sort_col_id').val();
		var isAscending = svOrder=='asc';
		var orderArrow = isAscending?'&#9650;':'&#9660;';
		$('#sort_by_'+svColId).html(orderArrow);
		 
		var table = document.getElementById('xtable');
		var tableBody = table.querySelector('tbody');
		tinysort(
				tableBody.querySelectorAll('tr')
				,{
						selector:'td#td_'+svColId
						,order: svOrder
						/*,sortFunction:function(a,b){
							return tableSortFunc(svColId, a, b);
						}*/
				}
		);
	});
		
	return false;
}

function loadProductCategories(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	$.getJSON('/by_trade_at_cities/'+realm+'/product_categories.json', function (data) {
		var output = '<option value="" selected=""></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.c+'">'+val.c+'</option>';
		});
		
		$('#id_category').html(output); 	// replace all existing content
		$('#products').html(''); 
		if(callback != null) callback();
	});
	return false;
}
function loadProducts(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCategoryId = $('#id_category').val();
	if (svCategoryId == null || svCategoryId == '') return;
	
	$.getJSON('/by_trade_at_cities/'+realm+'/products.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		$.each(data, function (key, val) {
			if(svCategoryId == val.pc){
				output += '&nbsp;<img src="http://virtonomica.ru'+val.s+'"';
				if(selected != null && selected == val.i){
					output += ' border="1"';
				}
				output += ' width="24" height="24" id="img'+val.i+'" title="'+val.c+'" style="cursor:pointer" onclick="changeProduct('+val.i+')">';
			}
		});
		
		$('#products').html(output); 	// replace all existing content
		if(callback != null) callback();
	});
	return false;
}
function loadCountries(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	$.getJSON('/by_trade_at_cities/'+realm+'/countries.json', function (data) {
		var output = '<option value="" selected=""></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.i+'">'+val.c+'</option>';
		});
		
		$('#id_country').html(output); 	// replace all existing content
		$('#id_region').html(''); 	// replace all existing content
		if(callback != null) callback();
	});
	return false;
}
function loadRegions(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCountryId = $('#id_country').val();
	if (svCountryId == null || svCountryId == '') return;
	
	$.getJSON('/by_trade_at_cities/'+realm+'/regions.json', function (data) {
		var output = '<option value="" selected=""></option>';
		
		$.each(data, function (key, val) {
			if(val.ci == svCountryId){
				output += '<option value="'+val.i+'">'+val.c+'</option>';
			}
		});
		
		$('#id_region').html(output); 	// replace all existing content
		if(callback != null) callback();
	});
	return false;
}
function changeRealm(productCategoriesCallback, countryCallback) {
	loadProductCategories(productCategoriesCallback);
	loadCountries(countryCallback);
	setVal('realm', getRealm());
	fillUpdateDate();
}
function changeCategory(callback) {
	loadProducts(callback);
	setVal('id_category', $('#id_category').val());
}
function changeCountry(callback) {
	$('#id_region').html(''); 	// replace all existing content
	loadRegions(callback);
	loadData();
	setVal('id_country', $('#id_country').val());
}
function changeRegion() {
	loadData();
	setVal('id_region', $('#id_region').val());
}
function changeProduct(productId) {
	var selected = $('#id_product').val();
	if(selected != null && selected != ''){
		$('#img'+selected).attr('border','');
	}
	$('#img'+productId).attr('border','1');
	$('#id_product').val(productId);
	loadData();
	setVal('id_product', $('#id_product').val());
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}
function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
function fillUpdateDate() {
	$('#update_date').val(''); 	// replace all existing content
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	$.getJSON('./updateDate.json', function (data) {
		$('#update_date').val('обновлено: ' + data.d); 	// replace all existing content
	});
}

//////////////////////////////////////////////////////
$(document).ready(function () { 
	var table = document.getElementById('xtable');
	var tableHead = table.querySelector('thead');
		
	tableHead.addEventListener('click',function(e){
		var tableBody = table.querySelector('tbody');
		var tableHeader = e.target;
		var isAscending;
		var order;
		
		while (tableHeader.nodeName!=='TH') {
				tableHeader = tableHeader.parentNode;
		}
		
		var tableHeaderId = tableHeader.getAttribute('id').substr(3);
		if (tableHeaderId != null && tableHeaderId != '') {
			//console.log(tableHeaderId);
			isAscending = tableHeader.getAttribute('data-order')=='asc';
			order = isAscending?'desc':'asc';
			tableHeader.setAttribute('data-order',order);
			$('#sort_by_'+$('#sort_col_id').val()).html('');
			$('#sort_col_id').val(tableHeaderId);
			$('#sort_dir').val(order);
			setVal('sort_col_id', $('#sort_col_id').val());
			setVal('sort_dir', $('#sort_dir').val());
			var orderArrow = isAscending?'&#9660;':'&#9650;';
			$('#sort_by_'+tableHeaderId).html(orderArrow);
			tinysort(
					tableBody.querySelectorAll('tr')
					,{
							selector:'td#td_'+tableHeaderId
							,order: order
							/*,sortFunction:function(a,b){
								return tableSortFunc(tableHeaderId, a, b);
							}*/
					}
			);
		}
	});
	loadSavedFlt();
});

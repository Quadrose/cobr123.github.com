
function getRealm(){
	return $('#realm').val();
}
function getProductID(){
	return $('#id_product').val();
}
function updateProdRemainLinks(){
	var productID = getProductID();
	if (productID == null || productID == '') return;
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var domain = (getLocale() == 'en') ? 'virtonomica.com' : 'virtonomica.ru';
	$('#show_remain_link').attr('href','http://'+domain+'/'+realm+'/main/globalreport/marketing/by_products/'+productID+'/');
	$('#calc_prod_link').attr('href','/industry/#id_product=' + productID);
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

function getLocale() {
	return getVal('locale') || $('#locale').val() || 'ru';
}
function applyLocale() {
	var locale = getLocale();
	
	if (locale === 'en') {
		document.title = "Retail sales";
		$('#btnSubmit').val('Generate');
	} else {
		document.title = "Розничная торговля в городах";
		$('#btnSubmit').val('Сформировать');
	}
	$("[lang]").each(function () {
		if ($(this).attr("lang") == locale) {
		    $(this).show();
		} else {
		    $(this).hide();
		}
	});
}
function changeLocale() {
	setVal('locale', $('#locale').val() || 'ru');
	window.location.reload();
}
function getCityDistrict(name, locale) {
  if (locale === 'en') {
		if (name === 'Центр города') {
			return 'City centre';
		} else if (name === 'Фешенебельный район') {
			return 'Trendy neighborhood';
		} else if (name === 'Пригород') {
			return 'Suburb';
		} else if (name === 'Окраина') {
			return 'Outskirts';
		} else if (name === 'Спальный район') {
			return 'Residential area';
		} else {
			return name;
		}
	} else {
	  return name;
	}
}
function getVolume(volume, locale) {
  if (locale === 'en') {
		return volume.replace('менее', 'below').replace('около', 'about').replace('более', 'over');
	} else {
		return volume;
	}
}

function getServiceLevel(serviceLevel, locale) {
  if (locale === 'en') {
		if (serviceLevel === 'Элитный') {
			return 'Elite';
		} else if (serviceLevel === 'Очень высокий') {
			return 'Very high';
		} else if (serviceLevel === 'Высокий') {
			return 'High';
		} else if (serviceLevel === 'Нормальный') {
			return 'Normal';
		} else if (serviceLevel === 'Низкий') {
			return 'Low';
		} else if (serviceLevel === 'Очень низкий') {
			return 'Very low';
		} else {
			return serviceLevel;
		}
	} else {
	  return serviceLevel;
	}
}
function loadPrediction(predRow) {
	var productID = getProductID();
	if (productID == null || productID == '') return;
	var locale = getLocale();
	
	$.getJSON('/predict_retail_sales/retail_analytics_hist/'+productID+'.json', function (data) {
		var output = '';
		var svMarketIdx = predRow.prev().find('>td#td_idx').text();
		console.log("svMarketIdx = '"+ svMarketIdx+"'" );
		var nvMarketVolume = parseFloat(predRow.prev().find('>td#td_volume').text());
		console.log("nvMarketVolume = '"+ nvMarketVolume+"'" );
		var nvWealthIndex = parseFloat(predRow.prev().find('>td#td_w_idx').text());
		console.log("nvWealthIndex = '"+ nvWealthIndex+"'" );
		var tableId = 'table_' + predRow.attr('id');
		var notEnoughDataMsg = (locale === 'en') ? 'Not enough data. Try another day.' : 'Недостаточно данных. Попробуйте в другой день.';
		
		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && (val.mi === svMarketIdx || svMarketIdx === '')) {suitable = true;} else {suitable = false;}
			if (suitable && val.wi >= (nvWealthIndex - 2) && val.wi <= (nvWealthIndex + 2)) {suitable = true;} else {suitable = false;}
			if (suitable && val.mv >= (nvMarketVolume - 5000) && val.mv <= (nvMarketVolume + 5000)) {suitable = true;} else {suitable = false;}
			if (suitable && val.n >= 300) {suitable = true;} else {suitable = false;}
			
			if(suitable){
				output += '<tr class="trec">';
				output += '<td align="center" id="td_sellVolume">'+getVolume(val.sv, locale)+'</td>';
				output += '<td align="center" id="td_price">'+val.p+'</td>';
				output += '<td align="center" id="td_quality">'+val.q+'</td>';
				output += '<td align="center" id="td_brand">'+val.b+'</td>';
				output += '<td align="center" id="td_marketVolume">'+val.mv+'</td>';
				output += '<td align="center" id="td_sellerCnt">'+val.sc+'</td>';
				output += '<td align="center" id="td_serviceLevel">'+getServiceLevel(val.sl, locale) +'</td>';
				output += '<td align="center" id="td_visitorsCount">'+getVolume(val.vc, locale)+'</td>';
				output += '<td align="center" id="td_notoriety">'+val.n+'</td>';
				output += '<td align="center" id="td_townDistrict">'+getCityDistrict(val.td, locale) +'</td>';
				output += '<td align="center" id="td_shopSize">'+val.ss+'</td>';
				output += '<td align="center" id="td_departmentCount">'+val.dc+'</td>';
				output += '<td align="center" id="td_wealthIndex">'+val.wi+'</td>';
				output += '<td align="center" id="td_marketIdx">'+val.mi+'</td>';
				output += '</tr>';
			}
		});
		if (output === '') {
			predRow.html(notEnoughDataMsg); 	// replace all existing content
		} else {
			var salesVolumeLabel = (locale === 'en') ? 'Sales volume' : 'Объем продаж';
			var brandLabel = (locale === 'en') ? 'Brand' : 'Бренд';
			var priceLabel = (locale === 'en') ? 'Price' : 'Цена';
			var marketVolumeLabel = (locale === 'en') ? 'Market volume' : 'Объем рынка';
			var qualityLabel = (locale === 'en') ? 'Quality' : 'Качество';
			var serviceLevelLabel = (locale === 'en') ? 'Service level' : 'Уровень сервиса';
			var sellerCntLabel = (locale === 'en') ? 'NoM' : 'К.п.';
			var sellerCntHint = (locale === 'en') ? 'Number of merchants' : 'Количество продавцов';
			var notorietyLabel = (locale === 'en') ? 'Popularity' : 'Известность';
			var visitorsCountLabel = (locale === 'en') ? 'Number of visitors' : 'Кол-во пос.';
			var visitorsCountHint = (locale === 'en') ? 'Number of visitors' : 'Количество посетителей';
			var townDistrictLabel = (locale === 'en') ? 'City district' : 'Район города';
			var shopSizeLabel = (locale === 'en') ? 'Trade area' : 'Торг. пл.';
			var departmentCountLabel = (locale === 'en') ? 'NoD' : 'К.о.';
			var departmentCountHint = (locale === 'en') ? 'Number of departments' : 'Количество отделов';
			var wealthIndexLabel = (locale === 'en') ? 'WL' : 'И.б.';
			var wealthIndexHint = (locale === 'en') ? 'Wealth level' : 'Индекс богатства';
			var indexLabel = (locale === 'en') ? 'Index' : 'И.';
			
			var headers = '<thead><tr class="theader">';
			headers += '<th id="th_sellVolume">'+salesVolumeLabel+'&nbsp;<b id="sort_by_sellVolume"></b></th>';
			headers += '<th id="th_price">'+priceLabel+'&nbsp;<b id="sort_by_price"></b></th>';
			headers += '<th id="th_quality">'+qualityLabel+'&nbsp;<b id="sort_by_quality"></b></th>';
			headers += '<th id="th_brand">'+brandLabel+'&nbsp;<b id="sort_by_brand"></b></th>';
			headers += '<th id="th_marketVolume">'+marketVolumeLabel+'&nbsp;<b id="sort_by_marketVolume"></b></th>';
			headers += '<th id="th_sellerCnt" title="'+sellerCntHint+'">'+sellerCntLabel+'&nbsp;<b id="sort_by_sellerCnt"></b></th>';
			headers += '<th id="th_serviceLevel">'+serviceLevelLabel+'&nbsp;<b id="sort_by_serviceLevel"></b></th>';
			headers += '<th id="th_visitorsCount" title="'+visitorsCountHint+'">'+visitorsCountLabel+'&nbsp;<b id="sort_by_visitorsCount"></b></th>';
			headers += '<th id="th_notoriety">'+notorietyLabel+'&nbsp;<b id="sort_by_notoriety"></b></th>';
			headers += '<th id="th_townDistrict">'+townDistrictLabel+'&nbsp;<b id="sort_by_townDistrict"></b></th>';
			headers += '<th id="th_shopSize" title="Торговая площадь">'+shopSizeLabel+'&nbsp;<b id="sort_by_shopSize"></b></th>';
			headers += '<th id="th_departmentCount" title="'+departmentCountHint+'">'+departmentCountLabel+'&nbsp;<b id="sort_by_departmentCount"></b></th>';
			headers += '<th id="th_wealthIndex" title="'+wealthIndexHint+'а">'+wealthIndexLabel+'&nbsp;<b id="sort_by_wealthIndex"></b></th>';
			headers += '<th id="th_marketIdx" title="Индекс">'+indexLabel+'&nbsp;<b id="sort_by_marketIdx"></b></th>';
			headers += '</tr></thead>';
			predRow.html('<td colspan=11><table id="'+tableId+'" border="0" width="100%" cellspacing="0" cellpadding="0">' + headers + '<tbody>' + output + '</tbody></table></td>'); 	// replace all existing content
			
			var table = document.getElementById(tableId);
			var tableBody = table.querySelector('tbody');
			tinysort(
					tableBody.querySelectorAll('tr')
					,{
							selector:'td#td_price'
							,order: 'desc'
					}
			);
		}
	});
	return false;
}
function togglePrediction(npPredNum){
	var link = $('#toggle_prediction_' + npPredNum + ' > a');
	var locale = getLocale();
	var showLabel = (locale === 'en') ? 'Show' : 'Показать';
	var hideLabel = (locale === 'en') ? 'Hide' : 'Скрыть';
	var loadingLabel = (locale === 'en') ? 'Loading...' : 'Загружаю...';
	
	if(link.text() === hideLabel) {
		var predRow = $('#prediction_' + npPredNum);
		predRow.remove();
		link.text(showLabel);
	} else {
		link.closest('tr').after('<tr class="trec" id="prediction_'+npPredNum+'"><td colspan=11>'+loadingLabel+'</td></tr>');
		var predRow = $('#prediction_' + npPredNum);
		loadPrediction(predRow);
		link.text(hideLabel);
	}
}
function loadSavedFlt(){
	//var params = getSearchParameters();
	var realm = getVal('realm') || 'olga';
	var id_country = getVal('id_country');
	var id_region = getVal('id_region');
	var id_category = getVal('id_category');
	var id_product = getVal('id_product');
	
	if (realm != null || realm != '') {
		$('#realm').val(realm);
		var loadProductsCallback = function() {
			//console.log("$('#products').childNodes.length = " + document.getElementById('products').childNodes.length);
			id_product = id_product || $('#products > img').eq(0).attr('id').replace("img", "");
			if (id_product == null || id_product == '') return;
			changeProduct(id_product);
		};
		var productCategoriesCallback = function() {
			//console.log("$('#id_category').childNodes.length = " + document.getElementById('id_category').childNodes.length);
			id_category = id_category || $('#id_category > option').eq(0).val();
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
var sagTownCaption = null;
function fillTownCaptions(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var locale = getLocale();
	var suffix = (locale === 'en') ? '_en' : '';
	if(sagTownCaption === null) {
		sagTownCaption = [];
	}
	
	$.getJSON('./'+realm+'/cities'+suffix+'.json', function (data) {
		$.each(data, function (key, val) {
			sagTownCaption[val.i] = val.c;
		});
		if(callback != null) callback();
	});
}
//////////////////////////////////////////////////////
function loadData() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var productID = getProductID();
	if (productID == null || productID == '') return;
	var locale = getLocale();
	var showLabel = (locale === 'en') ? 'Show' : 'Показать';
	var domain = (locale === 'en') ? 'virtonomica.com' : 'virtonomica.ru';
	if (sagTownCaption === null) {
	  fillTownCaptions(loadData);
	  return false;
	}
	
	$.getJSON('./'+realm+'/tradeAtCity_'+productID+'.json', function (data) {
		var output = '';
		var nvPredIdx = 1;
		
		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.pi == $('#id_product').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.ci == nvl($('#id_country').val(),val.ci)) {suitable = true;} else {suitable = false;}
			if (suitable && val.ri == nvl($('#id_region').val(),val.ri)) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.wi >= $('#wealthIndexFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.wi <= $('#wealthIndexTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.v >= $('#volumeFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.v <= $('#volumeTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.lpe >= $('#localPercentFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.lpe <= $('#localPercentTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.lpr >= $('#localPriceFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.lpr <= $('#localPriceTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.lq >= $('#localQualityFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.lq <= $('#localQualityTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.spr >= $('#shopPriceFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.spr <= $('#shopPriceTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.sq >= $('#shopQualityFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.sq <= $('#shopQualityTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.sb >= $('#shopBrandFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.sb <= $('#shopBrandTo').val()) {suitable = true;} else {suitable = false;}
			
			if(suitable){
				output += '<tr class="trec">';
				output += '<td id="td_city"><a target="_blank" href="http://'+domain+'/'+realm+'/main/globalreport/marketing/by_trade_at_cities/'+val.pi+'/'+val.ci+'/'+val.ri+'/'+val.ti+'">'+sagTownCaption[val.ti]+'</a></td>';
				output += '<td align="center" id="td_w_idx">'+val.wi+'</td>';
				output += '<td align="center" id="td_idx">'+val.mi+'</td>';
				output += '<td align="right" id="td_volume">'+val.v+'</td>';
				output += '<td align="right" id="td_local_perc" style="color:black">'+val.lpe+'</td>';
				output += '<td align="right" id="td_local_price">'+val.lpr+'</td>';
				output += '<td align="right" id="td_local_quality">'+val.lq+'</td>';
				output += '<td align="right" id="td_shop_price">'+val.spr+'</td>';
				output += '<td align="right" id="td_shop_quality">'+val.sq+'</td>';
				output += '<td align="right" id="td_shop_brand">'+val.sb+'</td>';
				output += '<td align="center" id="toggle_prediction_'+nvPredIdx+'"><a href="#" onclick="togglePrediction(\''+nvPredIdx+'\'); return false;">'+showLabel+'</td>';
				output += '</tr>';
				
				nvPredIdx = nvPredIdx + 1;
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
				}
		);
	});
	return false;
}

function loadProductCategories(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var suffix = (getLocale() == 'en') ? '_en' : '';
	
	$.getJSON('./'+realm+'/product_categories'+suffix+'.json', function (data) {
		var output = '';

		$.each(data, function (key, val) {
			output += '<option value="'+val.c+'">'+val.c+'</option>';
		});
		
		$('#id_category').html(output); 	// replace all existing content
		$('#products').html(''); 
		if(callback != null) {
			callback();
		} else {
			selectCategoryByProoduct($('#id_product').val());
			changeProduct($('#id_product').val());
		}
	});
	return false;
}
function loadProducts(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCategoryId = $('#id_category').val();
	if (svCategoryId == null || svCategoryId == '') return;
	var domain = (getLocale() == 'en') ? 'virtonomica.com' : 'virtonomica.ru';
	var suffix = (getLocale() == 'en') ? '_en' : '';
	
	$.getJSON('./'+realm+'/products'+suffix+'.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		$.each(data, function (key, val) {
			if(svCategoryId == val.pc){
				output += '&nbsp;<img src="http://'+domain+val.s+'"';
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
	var suffix = (getLocale() == 'en') ? '_en' : '';
	
	$.getJSON('./'+realm+'/countries'+suffix+'.json', function (data) {
	  var allCountries = (getLocale() == 'en') ? 'All countries' : 'Все страны';
	  var allRegions = (getLocale() == 'en') ? 'All regions' : 'Все регионы';
		var output = '<option value="" selected="">'+allCountries+'</option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.i+'">'+val.c+'</option>';
		});
		
		$('#id_country').html(output); 	// replace all existing content
		$('#id_region').html('<option value="" selected="">'+allRegions+'</option>'); 	// replace all existing content
		if(callback != null) callback();
	});
	return false;
}
function loadRegions(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCountryId = $('#id_country').val();
	if (svCountryId == null || svCountryId == '') return;
	var suffix = (getLocale() == 'en') ? '_en' : '';
	var allRegions = (getLocale() == 'en') ? 'All regions' : 'Все регионы';
	
	$.getJSON('./'+realm+'/regions'+suffix+'.json', function (data) {
		var output = '<option value="" selected="">'+allRegions+'</option>';
		
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
	fillTownCaptions();
	loadProductCategories(productCategoriesCallback);
	loadCountries(countryCallback);
	setVal('realm', getRealm());
	fillUpdateDate();
	updateProdRemainLinks();
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
	updateProdRemainLinks();
}
function selectCategoryByProoduct(productId) {
	if (productId == null || productId == '') return;
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var suffix = (getLocale() == 'en') ? '_en' : '';
	
	$.getJSON('./'+realm+'/products'+suffix+'.json', function (data) {
		$.each(data, function (key, val) {
			if(productId === val.i){
				$('select#id_category').val(val.pc);
				loadProducts();
			}
		});
	});
	return false;
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
	var prefix = (getLocale() == 'en') ? 'updated' : 'обновлено';
	
	$.getJSON('./'+realm+'/updateDate.json', function (data) {
		$('#update_date').val(prefix+': ' + data.d); 	// replace all existing content
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
					}
			);
		}
	});
	var hashParams = window.location.hash.substr(1).split('&'); // substr(1) to remove the `#`
	//только для локали, чтобы категории правильные загрузились сразу
	if (hashParams != null && hashParams != '') {
		for(var i = 0; i < hashParams.length; i++){
		    var p = hashParams[i].split('=');
		    if (p[0] === 'locale') {
			setVal('locale', decodeURIComponent(p[1]));
		    }
		}
	}
	loadSavedFlt();
	
	if (hashParams != null && hashParams != '') {
		for(var i = 0; i < hashParams.length; i++){
		    var p = hashParams[i].split('=');
		    document.getElementById(p[0]).value = decodeURIComponent(p[1]);
		}
		selectCategoryByProoduct($('#id_product').val());
		changeProduct($('#id_product').val());
		window.location.hash = '';
	} else {
		var id_product = getProductID() || getVal('id_product');
		var id_category = $('#id_category').val();
		if (id_product != null && id_product != '' && (id_category === null || id_category === '')) {
			selectCategoryByProoduct(id_product);
			changeProduct(id_product);
		}
	}
	if (getLocale() != 'ru') {
		 $('#locale').val(getLocale());
		applyLocale();
	}
});

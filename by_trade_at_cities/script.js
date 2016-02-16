
function getRealm(){
	return $('#realm').val();
}
function getProductID(){
	return $('#id_product').val();
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

function loadPrediction(predRow) {
	var productID = getProductID();
	if (productID == null || productID == '') return;
	
	$.getJSON('/predict_retail_sales/retail_analytics_hist/'+productID+'.json', function (data) {
		var output = '';
		var svMarketIdx = predRow.prev().find('>td#td_idx').text();
		console.log("svMarketIdx = '"+ svMarketIdx+"'" );
		var nvMarketVolume = parseFloat(predRow.prev().find('>td#td_volume').text());
		console.log("nvMarketVolume = '"+ nvMarketVolume+"'" );
		
		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.mi === svMarketIdx) {suitable = true;} else {suitable = false;}			
			if (suitable && val.mv >= (nvMarketVolume - 1000) && val.mv <= (nvMarketVolume + 1000)) {suitable = true;} else {suitable = false;}
			
			if(suitable){
				output += '<tr class="trec">';
				output += '<td align="center" id="td_sellVolume">'+val.sv+'</td>';
				output += '<td align="center" id="td_price">'+val.p+'</td>';
				output += '<td align="center" id="td_quality">'+val.q+'</td>';
				output += '<td align="center" id="td_brand">'+val.b+'</td>';
				output += '<td align="center" id="td_marketVolume">'+val.mv+'</td>';
				output += '<td align="center" id="td_sellerCnt">'+val.sc+'</td>';
				output += '<td align="center" id="td_serviceLevel">'+val.sl+'</td>';
				output += '<td align="center" id="td_visitorsCount">'+val.vc+'</td>';
				output += '<td align="center" id="td_notoriety">'+val.n+'</td>';
				output += '<td align="center" id="td_townDistrict">'+val.td+'</td>';
				output += '<td align="center" id="td_shopSize">'+val.ss+'</td>';
				output += '<td align="center" id="td_departmentCount">'+val.dc+'</td>';
				output += '</tr>';
			}
		});
		if (output === '') {
			predRow.html('Недостаточно данных. Попробуйте в другой день.'); 	// replace all existing content
		} else {
			var headers = '<thead><tr class="theader">';
			headers += '<th id="th_sellVolume">&nbsp;<b id="sort_by_sellVolume"></b></th>';
			headers += '<th id="th_price">&nbsp;<b id="sort_by_price"></b></th>';
			headers += '<th id="th_quality">&nbsp;<b id="sort_by_quality"></b></th>';
			headers += '<th id="th_brand">&nbsp;<b id="sort_by_brand"></b></th>';
			headers += '<th id="th_marketVolume">&nbsp;<b id="sort_by_marketVolume"></b></th>';
			headers += '<th id="th_sellerCnt">&nbsp;<b id="sort_by_sellerCnt"></b></th>';
			headers += '<th id="th_serviceLevel">&nbsp;<b id="sort_by_serviceLevel"></b></th>';
			headers += '<th id="th_visitorsCount">&nbsp;<b id="sort_by_visitorsCount"></b></th>';
			headers += '<th id="th_notoriety">&nbsp;<b id="sort_by_notoriety"></b></th>';
			headers += '<th id="th_townDistrict">&nbsp;<b id="sort_by_townDistrict"></b></th>';
			headers += '<th id="th_shopSize">&nbsp;<b id="sort_by_shopSize"></b></th>';
			headers += '<th id="th_departmentCount">&nbsp;<b id="sort_by_departmentCount"></b></th>';
			//headers += '<th id="th_">&nbsp;<b id="sort_by_"></b></th>';
			headers += '</tr></thead>';
			predRow.html('<td colspan=11><table>' + headers + '<tbody>' + output + '</tbody></table></td>'); 	// replace all existing content
		}
	});
	return false;
}
function togglePrediction(npPredNum){
	var link = $('#toggle_prediction_' + npPredNum + ' > a');
	if(link.text() === 'Скрыть') {
		var predRow = $('#prediction_' + npPredNum);
		predRow.remove();
		link.text('Показать');
	} else {
		link.closest('tr').after('<tr class="trec" id="prediction_'+npPredNum+'"><td colspan=11>Загружаю...</td></tr>');
		var predRow = $('#prediction_' + npPredNum);
		loadPrediction(predRow);
		link.text('Скрыть');
	}
}
function loadSavedFlt(){
	//var params = getSearchParameters();
	var realm = getVal('realm');
	var id_country = getVal('id_country');
	var id_region = getVal('id_region');
	var id_category = getVal('id_category');
	var id_product = getVal('id_product');
	
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

//////////////////////////////////////////////////////
function loadData() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var productID = getProductID();
	if (productID == null || productID == '') return;
	
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
				output += '<td id="td_city"><a target="_blank" href="http://virtonomica.ru/'+realm+'/main/globalreport/marketing/by_trade_at_cities/'+val.pi+'/'+val.ci+'/'+val.ri+'/'+val.ti+'">'+val.tc+'</a></td>';
				output += '<td align="center" id="td_w_idx">'+val.wi+'</td>';
				output += '<td align="center" id="td_idx">'+val.mi+'</td>';
				output += '<td align="right" id="td_volume">'+val.v+'</td>';
				output += '<td align="right" id="td_local_perc" style="color:black">'+val.lpe+'</td>';
				output += '<td align="right" id="td_local_price">'+val.lpr+'</td>';
				output += '<td align="right" id="td_local_quality">'+val.lq+'</td>';
				output += '<td align="right" id="td_shop_price">'+val.spr+'</td>';
				output += '<td align="right" id="td_shop_quality">'+val.sq+'</td>';
				output += '<td align="right" id="td_shop_brand">'+val.sb+'</td>';
				output += '<td align="center" id="toggle_prediction_'+nvPredIdx+'"><a href="#" onclick="togglePrediction(\''+nvPredIdx+'\'); return false;">Показать</td>';
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
	
	$.getJSON('./'+realm+'/product_categories.json', function (data) {
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
	
	$.getJSON('./'+realm+'/products.json', function (data) {
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
	
	$.getJSON('./'+realm+'/countries.json', function (data) {
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
	
	$.getJSON('./'+realm+'/regions.json', function (data) {
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
	
	$.getJSON('./'+realm+'/updateDate.json', function (data) {
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
					}
			);
		}
	});
	loadSavedFlt();
	
	var hashParams = window.location.hash.substr(1).split('&'); // substr(1) to remove the `#`
	for(var i = 0; i < hashParams.length; i++){
	    var p = hashParams[i].split('=');
	    document.getElementById(p[0]).value = decodeURIComponent(p[1]);;
	}
});

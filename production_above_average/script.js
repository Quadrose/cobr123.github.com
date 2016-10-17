
function getRealm(){
	return $('#realm').val();
}
function getProductID(){
	return $('#id_product').val();
}
function getVal(spName){
	return JSON.parse(window.localStorage.getItem(spName));
}
function setVal(spName, pValue){
	window.localStorage.setItem(spName,JSON.stringify(pValue));
}
function lockSubmit() {
	$('#btnSubmit').attr('disabled', true);
	var locale = getLocale();
	
	if (locale === 'en') {
		$('#btnSubmit').val('Please wait...');
	} else {
		$('#btnSubmit').val('Пожалуйста, подождите...');
	}
}
function unlockSubmit() {
	var locale = getLocale();
	
	if (locale === 'en') {
		$('#btnSubmit').val('Generate');
	} else {
		$('#btnSubmit').val('Сформировать');
	}
	$('#btnSubmit').attr('disabled', false);
}
function getLocale() {
	return getVal('locale') || $('#locale').val() || 'ru';
}
function applyLocale() {
	var locale = getLocale();
	
	if (locale === 'en') {
		document.title = "Production";
		$('#btnSubmit').val('Generate');
		$('#locale_flag').attr('src','/img/us.gif');
	} else {
		document.title = "Производство";
		$('#btnSubmit').val('Сформировать');
		$('#locale_flag').attr('src','/img/ru.png');
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
function getDomain(locale) {
  if (locale === 'en') {
	  return 'virtonomics.com';
	} else {
	  return 'virtonomica.ru';
	}
}
function updateGeneralReportLink(){
	var productID = getProductID();
	if (productID == null || productID == '') return;
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var locale = getLocale();
	var domain = getDomain(locale);
	$('#general_report_link').attr('href','https://'+domain+'/'+realm+'/main/globalreport/product_history/'+productID+'/');
}
//резделитель разрядов
function commaSeparateNumber(val, sep){
	var separator = sep || ',';
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
	}
	return val;
}
function loadSavedFlt(urlParams){
	var realm       = getVal('realm') || 'olga';
	var id_category = getVal('id_category');
	var id_product  = getVal('id_product');

	if (Object.keys(urlParams).length > 1 && urlParams['realm'] != '' && urlParams['id_product'] != '') {
		realm       = urlParams['realm'];
		id_product  = urlParams['id_product'];
		fillFormFromUrl(urlParams);
	}

	var sort_col_id = urlParams['sort_col_id'] | getVal('sort_col_id_paa') || 'tech';
	if (sort_col_id != null || sort_col_id != '') {
	    $('#sort_col_id').val(sort_col_id);
	}
	var sort_dir = urlParams['sort_dir'] | getVal('sort_dir_paa') || 'asc';
	if (sort_dir != null || sort_dir != '') {
	    $('#sort_dir').val(sort_dir);
	}
	
	$('#tech_from').val(getVal('tech_from') || 10);
	$('#tech_to').val(getVal('tech_to') || 10);
	$('#workQuan').val(getVal('workQuan') || 10000);
	$('#workSalary').val(getVal('workSalary') || 300);
	$('#volumeFrom_'+id_product).val(getVal('volumeFrom_'+id_product) || getVal('volumeFrom') || 1);
	
	if (realm != null || realm != '') {
		$('#realm').val(realm);
		var loadProductsCallback = function() {
			//console.log("$('#products').childNodes.length = " + document.getElementById('products').childNodes.length);
			changeProduct(id_product);
		};
		var productCategoriesCallback = function() {
			if (id_product != null && id_product != '') {
				var selectCategoryByProductCallback = function() {
					changeProduct(id_product);
				};
				selectCategoryByProduct(id_product, selectCategoryByProductCallback);
			} else {
				//console.log("$('#id_category').childNodes.length = " + document.getElementById('id_category').childNodes.length);
				id_category = id_category || $('#id_category > option').eq(0).val();
				if (id_category == null || id_category == '') return;
				$('#id_category').val(id_category);
				id_category = $('#id_category').val();
				if (id_category == null || id_category == '') {
					id_category = $('#id_category > option').eq(0).val();
					$('#id_category').val(id_category);
				}
				loadProducts(loadProductsCallback);
			}
		};
		changeRealm(productCategoriesCallback);
		
	} else {
		loadProductCategories();
		fillUpdateDate();
	}
	$('input[type="text"]').each(function(){
			$(this).val(commaSeparateNumber($(this).val(),' '));
	});
	$('input[type="text"]')
	 .focus(function(){
			$(this).val($(this).val().replace(/\s+/g,''));
	 })
	 .focusout(function() {
			$(this).val(commaSeparateNumber($(this).val(),' '));
      });
}
function strToNum(spStr){
	if (spStr == null) {
		return null;
	} else {
		return parseFloat(spStr.replace(',', '.').replace(/\s+/g, ''), 10);
	}
}
function parseFloatFromFilter(spSelector, npDefVal){
	return strToNum($(spSelector).val()) || npDefVal;
}
//////////////////////////////////////////////////////

function sortTable(){
	var svOrder = $('#sort_dir').val();
	var svColId = $('#sort_col_id').val();
	 
	var table = document.getElementById('xtable');
	var tableBody = table.querySelector('tbody');
	tinysort(
			tableBody.querySelectorAll('tr')
			,{
					selector:'td#td_'+svColId
					,order: svOrder
					,data: 'value'
			}
	);
	var isAscending = svOrder=='asc';
	var orderArrow = isAscending?'&#9650;':'&#9660;';
	$('#sort_by_'+svColId).html(orderArrow);
}
var sagMaterialImg = null;
var productOfSelectedCategory = [];
function updateTable(unZippedData){
	var realm = getRealm();
	if (realm == null || realm == '') {
		unlockSubmit();
		return;
	}
  
	var output = '';
	var locale = getLocale();
	var domain = getDomain(locale);
	var href = '';
	var unitHref = '';
	var imgSrc = '';
	var techHref = '';
	var svMaterialsImg = '';
	var svMaterialsQty = '';
	var svMaterialsQual = '';
	var svMaterialsPrice = '';
	//var svPricePerQty = '';
	var svDate = new Date().toISOString().slice(0, 10);
	var openCalcHref = '';
  var general_report_link = '';
  var general_report_link_title = (locale == 'en') ? 'Production: general report' : 'Производство: обзорный отчёт';
	var specHref = '';
	var suitable = true;
	var nvTechTo = parseFloatFromFilter('#tech_to', 20);
	var productID = getProductID();
	setVal('tech_to', nvTechTo);

	unZippedData.forEach(function(val){
		suitable = true;
		if (suitable && (val.tl <= nvTechTo)) {suitable = true;} else {suitable = false;}
		if (suitable && (val.pi in productOfSelectedCategory)) {suitable = true;} else {suitable = false;}
		if (suitable && (val.pi == productID || productID == null || productID == '')) {suitable = true;} else {suitable = false;}
    
		if(suitable){
			$('#img'+val.pi).css('opacity', 1);
      output += '<tr class="trec hoverable">';
      imgSrc = sagMaterialImg[val.pi].replace('/img/products/','/img/products/16/');
      general_report_link = '<a href="https://'+domain+'/'+realm+'/main/globalreport/product_history/'+val.pi+'" target="_blank"><img src="'+imgSrc+'"></a>';
      openCalcHref = '/industry/#id_product='+val.pi+'&realm='+realm+'&tech_from='+val.tl+'&tech_to='+val.tl+'&quality_from='+val.q;
      specHref = 'https://'+domain+'/'+realm+'/main/industry/unit_type/info/'+val.mi;
      output += '<td align="center">'+general_report_link+'&nbsp;<a target="_blank" href="'+specHref+'">'+val.s+'</a>&nbsp;<a target="_blank" href="'+openCalcHref+'"><img src="../favicon.ico"></a></td>';
      techHref = 'https://'+domain+'/'+realm+'/main/globalreport/technology/'+val.mi+'/'+val.tl+'/target_market_summary/'+svDate+'/bid';
      output += '<td align="center" id="td_tech" id="td_quality" data-value="'+val.tl+'"><a target="_blank" href="'+techHref+'">'+val.tl+'</a></td>';
      svMaterialsImg = '';
      svMaterialsQty = '';
      svMaterialsQual = '';
      svMaterialsPrice = '';
      //vPricePerQty = '';
      val.ir.forEach(function(mat){
        imgSrc = sagMaterialImg[mat.pi].replace('/img/products/','/img/products/16/');
        unitHref = 'https://'+domain+'/'+realm+'/main/unit/view/'+mat.ui+'/';
        href = 'https://'+domain+'/'+realm+'/main/globalreport/marketing/by_products/'+mat.pi+'/';
        svMaterialsImg += '<td align="center"><a target="_blank" href="'+href+'"><img src="'+imgSrc+'"></a></td>';
        //svMaterialsQty += '<td align="center">'+commaSeparateNumber(mat.v)+'&nbsp;</td>';
        svMaterialsQual += '<td align="center">'+commaSeparateNumber(mat.q)+'&nbsp;</td>';
        //svPricePerQty += '<td align="center">$'+commaSeparateNumber((mat.price / mat.quality).toFixed(2))+'&nbsp;</td>';
        svMaterialsPrice += '<td align="center"><a target="_blank" href="'+unitHref+'">$'+commaSeparateNumber(mat.p)+'</a>&nbsp;</td>';
      });
      href = 'https://'+domain+'/'+realm+'/main/globalreport/marketing/by_products/'+val.pi+'/';
      output += '<td align="center"><table cellspacing="0" cellpadding="0"><tr class="trec">'+svMaterialsImg+'</tr><tr class="trec">'+svMaterialsQty+'</tr><tr class="trec">'+svMaterialsQual+'</tr><tr class="trec">'+svMaterialsPrice+'</tr></table></td>';
      output += '<td align="center" id="td_quality" data-value="'+val.q+'"><a target="_blank" href="'+href+'">'+commaSeparateNumber(val.q)+'</a></td>';
      output += '<td align="center" id="td_quantity" data-value="'+val.v+'">'+commaSeparateNumber(val.v)+'</td>';
      output += '<td align="center" id="td_cost" data-value="'+val.c+'">$'+commaSeparateNumber(val.c)+'</td>';
      output += '<td align="center" id="td_costperqua" data-value="'+(val.c / val.q).toFixed(2)+'">$'+commaSeparateNumber((val.c / val.q).toFixed(2))+'</td>';
      output += '</tr>';
    }
	});
	//console.log('output = ' + output);
	$('#xtabletbody').html(output); 	// replace all existing content
	if(output != ''){
		sortTable();
	}
	unlockSubmit();
}
//////////////////////////////////////////////////////

function fillFormFromUrl(urlParams){
	var newVal = '';
	['tech_from', 'tech_to', 'quality_from'].map( function(attrID) {
		newVal = urlParams[attrID];
		if(newVal != null && newVal != '') {
			$('#' + attrID).val(newVal);
		}
	});
}
function updateUrl() {
	var productID = getProductID();
	var realm = getRealm();
	var svColId = $('#sort_col_id').val();
	var svOrder = $('#sort_dir').val();
	var tech_from = $('#tech_from').val();
	var tech_to = $('#tech_to').val();
	var quality_from = $('#quality_from').val();

	window.history.pushState("", ""
		, '#id_product='  + productID
		+ '&realm='       + realm
		+ '&tech_from='    + strToNum(tech_from)
		+ '&tech_to='      + strToNum(tech_to)
		+ '&quality_from=' + strToNum(quality_from)
		+ '&sort_col_id=' + svColId
		+ '&sort_dir='    + svOrder
	);
}
function loadData() {
	if (sagMaterialImg === null) return false;
	if ($('#btnSubmit').attr('disabled') === 'disabled') {
		return false;
	} else {
		lockSubmit();
		$('#messages').html('');
	    $('#xtabletbody').html('');
	}
	updateUrl();
	var realm = getRealm();
  
	zip.workerScriptsPath = '/js/';
	zip.createReader(new zip.HttpReader('/industry/'+realm+'/production_above_average.json.zip'), function(reader) {
		// get all entries from the zip
		reader.getEntries(function(entries) {
			if (entries.length > 0) {
				// get first entry content as text
				entries[0].getData(new zip.TextWriter(), function(text) {
					// text contains the entry data as a String
					// close the zip reader
					reader.close();
					// console.log(text.length);
					// console.log(text.substr(0, 100) );
					// console.log(text.substr(-100) );
					var data = JSON.parse(text);
          updateTable(data);
				});
			} else {
        console.error("Файл с данными пустой");
        unlockSubmit();
			}
		});
	}, function(error) {
		// onerror callback
		console.error(error);
    unlockSubmit();
	});
	
	return false;
}

function loadProductCategories(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var suffix = (getLocale() == 'en') ? '_en' : '';
	
	$.getJSON('/industry/'+realm+'/materials'+suffix+'.json', function (data) {
		var output = '';
		var categories = [];
		$.each(data, function (key, val) {
			if(categories[val.pc] == null && val.pc != 'Полезные ископаемые' && val.pc != 'Natural resources'){
				output += '<option value="'+val.pc+'">'+val.pc+'</option>';
				categories[val.pc] = 1;
			}
		});
		
		$('#id_category').html(output); 	// replace all existing content
		$('#materials').html(''); 
		
		if(callback != null) {
			callback();
		} else {
			selectCategoryByProduct($('#id_product').val());
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
	var locale = getLocale();
	var suffix = (locale === 'en') ? '_en' : '';
	var img_suffix = (locale === 'en') ? '_en' : '_ru';
  productOfSelectedCategory = [];
	var svAllProductsTitle = (locale === 'en') ? 'All' : 'Все';
	
	$.getJSON('/industry/'+realm+'/materials'+suffix+'.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		output += '&nbsp;<img src="/img/all'+img_suffix+'.png"';
    if(selected == null || selected == '') {
			output += ' border="1"';
    }
		output += ' width="24" height="24" id="img" title="'+svAllProductsTitle+'" style="cursor:pointer;" onclick="changeProduct(\'\')">';
		sagMaterialImg = [];
		var cnt = 0;
		$.each(data, function (key, val) {
			sagMaterialImg[val.i] = val.s;
			
			if(svCategoryId == val.pc){
        productOfSelectedCategory[val.i] = 1;
        
				if(cnt > 30){
					cnt = 0;
					output += '<br>';
				}
				cnt++;
				output += '&nbsp;<img src="'+ val.s +'"';
				if(selected != null && selected == val.i){
					output += ' border="1"';
				}
				output += ' width="24" height="24" id="img'+val.i+'" title="'+val.c+'" style="cursor:pointer; opacity: 0.2;" onclick="changeProduct('+val.i+')">';
			}
		});
		
		$('#materials').html(output);
		if(typeof(callback) === 'function'){
      callback();
    } else {
      loadData();
    }
	});
	return false;
}
function changeRealm(productCategoriesCallback) {
	loadProductCategories(productCategoriesCallback);
	setVal('realm', getRealm());
	fillUpdateDate();
	updateGeneralReportLink();
}
function changeCategory(callback) {
  $('#id_product').val('');
	loadProducts(callback);
	setVal('id_category', $('#id_category').val());
}
function changeProduct(productId) {
	var selected = $('#id_product').val();
	if(selected != null && selected != ''){
		$('#img'+selected).attr('border','');
	} else {
		$('#img').attr('border','');
  }
	$('#volumeFromByMaterials').html(''); 
	$('#img'+productId).attr('border','1');
	$('#id_product').val(productId);
	loadData();
	setVal('id_product', $('#id_product').val());
	updateGeneralReportLink();
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
function fillUpdateDate() {
	$('#update_date').text('');
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var prefix = (getLocale() == 'en') ? 'updated' : 'обновлено';
	
	$.getJSON('/industry/'+realm+'/updateDate.json', function (data) {
		$('#update_date').text(prefix+': ' + data.d);
	});
}

function selectCategoryByProduct(productId, callback) {
	if (productId == null || productId == '') return;
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var suffix = (getLocale() == 'en') ? '_en' : '';
	
	$.getJSON('/industry/'+realm+'/materials'+suffix+'.json', function (data) {
		$.each(data, function (key, val) {
			if(productId === val.i){
				$('select#id_category').val(val.pc);
			}
		});
		loadProducts(callback);
	});
	return false;
}
//////////////////////////////////////////////////////
$(document).ready(function () {
	var urlParams = [];
	var hashParams = window.location.hash.substr(1).toLowerCase().split('&'); // substr(1) to remove the `#`
	//только для локали, чтобы категории правильные загрузились сразу
	if (hashParams != null && hashParams != '') {
		for(var i = 0; i < hashParams.length; i++){
			var p = hashParams[i].split('=');
			if (p[0] === 'locale') {
				setVal('locale', decodeURIComponent(p[1]));
			}
			urlParams[p[0]] = decodeURIComponent(p[1]);
		}
	}
	var table = document.getElementById('xtable');
	var tableHead = table.querySelector('thead');
		
	tableHead.addEventListener('click',function(e){
		var tableHeader = e.target;
		var isAscending;
		var order;
		var orderArrow;
		
		while (tableHeader.nodeName!=='TH') {
				tableHeader = tableHeader.parentNode;
		}
		
		var tableHeaderId = tableHeader.getAttribute('id').substr(3);
		if (tableHeaderId != null && tableHeaderId != '') {
			//console.log(tableHeaderId);
			isAscending = tableHeader.getAttribute('data-order')=='asc';
            order = isAscending ? 'desc' : 'asc';
            orderArrow = isAscending ? '&#9660;' : '&#9650;';
			tableHeader.setAttribute('data-order',order);
			$('#sort_by_'+$('#sort_col_id').val()).html('');
			$('#sort_col_id').val(tableHeaderId);
			$('#sort_dir').val(order);
			setVal('sort_col_id_paa', $('#sort_col_id').val());
			setVal('sort_dir_paa', $('#sort_dir').val());
			$('#sort_by_'+tableHeaderId).html(orderArrow);
			loadData();
		}
	});
	loadSavedFlt(urlParams);

	if (getLocale() != 'ru') {
		 $('#locale').val(getLocale());
		applyLocale();
	}
});

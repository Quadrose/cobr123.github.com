
function getRealm(){
	return $('#realm').val();
}
function getServiceID(){
	return $('#id_service').val();
}
function getDomain(locale) {
  if (locale === 'en') {
	  return 'virtonomics.com';
	} else {
	  return 'virtonomica.ru';
	}
}
function updateReferenceLink(){
	var serviceID = getServiceID();
	if (serviceID == null || serviceID == '') return;
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var locale = getLocale();
	var domain = getDomain(locale);
	//http://virtonomica.ru/olga/main/industry/unit_type/info/359926
	$('#reference_link').attr('href','http://'+domain+'/'+realm+'/main/industry/unit_type/info/'+serviceID);
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
		document.title = "Services sector";
		$('#btnSubmit').val('Generate');
		$('#locale_flag').attr('src','/img/us.gif');
	} else {
		document.title = "Сфера услуг";
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
//резделитель разрядов
function commaSeparateNumber(val, sep){
	var separator = sep || ',';
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
	}
	return val;
}
function loadSavedFlt(){
	var realm = getVal('realm') || 'olga';
	var id_country = getVal('id_country');
	var id_region = getVal('id_region');
	var id_town = getVal('id_town');
	var id_service = getVal('id_service');

	var sort_col_id = getVal('sort_col_id_service') || 'perc';
	if (sort_col_id != null || sort_col_id != '') {
	    $('#sort_col_id').val(sort_col_id);
	}
	var sort_dir = getVal('sort_dir_service') || 'asc';
	if (sort_dir != null || sort_dir != '') {
	    $('#sort_dir').val(sort_dir);
	}
	
	if (realm != null || realm != '') {
		$('#realm').val(realm);
		var loadProductsCallback = function() {
			//console.log("$('#products').childNodes.length = " + document.getElementById('products').childNodes.length);
			if (id_service == null || id_service == '') {
                id_service = $('#services > img').eq(0).attr('id').replace("img", "");
                if (id_service == null || id_service == '') return;
			}
            $('#id_service').val(id_service);
            loadServices(loadData);
	        updateReferenceLink();
		};
		var productCategoriesCallback = function() {
			loadServices(loadProductsCallback);
  		};
		var changeRegionCallback = function() {
			if (id_town != null || id_town != '') {
				$('#id_town').val(id_town);
				changeTown();
			}
		};
		var changeCountryCallback = function() {
			if (id_region != null || id_region != '') {
				$('#id_region').val(id_region);
				//console.log("$('#id_region').childNodes.length = " + document.getElementById('id_region').childNodes.length);
				changeRegion(changeRegionCallback);
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
		loadServices();
		loadCountries();
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
function parseFloatFromFilter(spSelector, npDefVal){
	return parseFloat($(spSelector).val().replace(',', '.').replace(/\s+/g,''),10) || npDefVal;
}
var sagTownCaption = null;
var sagCountryCaption = null;
var sagRegionCaption = null;
function fillTownCaptions(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var locale = getLocale();
	var suffix = (locale === 'en') ? '_en' : '';
	if(sagTownCaption === null) {
		sagTownCaption = [];
	}
	
	$.getJSON('/by_trade_at_cities/'+realm+'/cities'+suffix+'.json', function (data) {
		$.each(data, function (key, val) {
			sagTownCaption[val.i] = val.c;
		});
		if(typeof(callback) === 'function') callback();
	});
}

var sagInvisibibleColumns = [];
function getColStyle(spColID){
	if ($.inArray(spColID, sagInvisibibleColumns) >= 0) {
		return 'style="display: none;"';
	} else {
		return '';
	}
}
//////////////////////////////////////////////////////
function loadData() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var serviceID = getServiceID();
	if (serviceID == null || serviceID == '') return;
	var locale = getLocale();
	var showLabel = (locale === 'en') ? 'Show' : 'Показать';
	var suffix = (locale === 'en') ? '_en' : '';
	var domain = getDomain(locale);
	if (sagTownCaption === null) {
	  fillTownCaptions(loadData);
	  return false;
	}
//    console.log('loadData /'+realm+'/tradeAtCity_'+serviceID+'.json, caller is '+ arguments.callee.caller.toString());
	
	$.getJSON('./'+realm+'/serviceAtCity_'+serviceID + suffix+'.json', function (data) {
		var output = '';
		var serviceSpec = $('#id_service_spec > option').eq($('#id_service_spec').val()).text();
        var percent = 0;
		var retailBySpec = null;
		var calcBySpec = null;
		var equipCnt = $('#equip_raw_mat_body > tr > td:eq(1) > a > img').length;
		var ingCnt = $('#equip_raw_mat_body > tr > td:eq(2) > a > img').length;
		var idx = 0;

		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.ci == nvl($('#id_country').val(),val.ci)) {suitable = true;} else {suitable = false;}
			if (suitable && val.ri == nvl($('#id_region').val(),val.ri)) {suitable = true;} else {suitable = false;}
			if (suitable && val.ti == nvl($('#id_town').val(),val.ti)) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.p >= parseFloatFromFilter('#priceFrom',val.p)) {suitable = true;} else {suitable = false;}
			if (suitable && val.p <= parseFloatFromFilter('#priceTo',val.p)) {suitable = true;} else {suitable = false;}

            percent = val.pbs[serviceSpec] || 0;
			if (suitable){
                suitable = false;
                if(percent >= parseFloatFromFilter('#percentFrom',percent) && percent <= parseFloatFromFilter('#percentTo',percent)) {
                    suitable = true;
                }
            }

			if(suitable){
				output += '<tr class="trec hoverable">';
				output += '<td id="td_city" title="'+sagCountryCaption[val.ci]+' - '+sagRegionCaption[val.ri]+'"><a target="_blank" href="http://'+domain+'/'+realm+'/main/globalreport/marketing/by_service/'+serviceID+'/'+val.ci+'/'+val.ri+'/'+val.ti+'">'+sagTownCaption[val.ti]+'</a></td>';
				output += '<td '+getColStyle('w_idx')+' align="right" id="td_w_idx">'+unknownIfNull(locale, parseFloat(val['wi']).toFixed(2))+'</td>';
				output += '<td '+getColStyle('mdi')+' align="right" id="td_mdi">'+parseFloat(val.mdi).toFixed(2)+'</td>';
				output += '<td '+getColStyle('market_volume')+' align="right" id="td_market_volume">'+val.v+'</td>';
				output += '<td '+getColStyle('perc')+' align="right" id="td_perc">'+percent.toFixed(2)+'</td>';
				output += '<td '+getColStyle('price')+' align="right" id="td_price">'+parseFloat(val.p).toFixed(2)+'</td>';
				output += '<td '+getColStyle('sc')+' align="right" id="td_sc">'+val.sc+'</td>';
				output += '<td '+getColStyle('cc')+' align="right" id="td_cc">'+val.cc+'</td>';
				output += '<td '+getColStyle('itr')+' align="right" id="td_itr">'+unknownIfNull(locale, val['itr'])+'</td>';


				if(val['cbs'] != null){
					calcBySpec = val.cbs[serviceSpec];
					if(calcBySpec != null){
						output += '<td align="right" id="td_cbs_lpr">' + parseFloat(calcBySpec.lpr).toFixed(2) + '</td>';
						output += '<td align="right" id="td_cbs_lq">' + parseFloat(calcBySpec.lq).toFixed(2) + '</td>';
					}
				}

				if(val['rbs'] != null){
					retailBySpec = val.rbs[serviceSpec];
					if(retailBySpec != null){
						idx = 0;
						for (rbsKey in retailBySpec) {
							output += '<td '+getColStyle('rbs_lpr')+' align="right" id="td_rbs_lpr_' + rbsKey + '"><a target="_blank" href="http://' + domain + '/' + realm + '/main/globalreport/marketing/by_trade_at_cities/' + rbsKey + '/' + val.ci + '/' + val.ri + '/' + val.ti + '">' + parseFloat(retailBySpec[rbsKey].lpr).toFixed(2) + '</a></td>';
							output += '<td '+getColStyle('rbs_lq')+' align="right" id="td_rbs_lq_' + rbsKey + '"><a target="_blank" href="http://' + domain + '/' + realm + '/main/globalreport/marketing/by_trade_at_cities/' + rbsKey + '/' + val.ci + '/' + val.ri + '/' + val.ti + '">' + parseFloat(retailBySpec[rbsKey].lq).toFixed(2) + '</a></td>';
							output += '<td '+getColStyle('rbs_spr')+' align="right" id="td_rbs_spr_' + rbsKey + '"><a target="_blank" href="http://' + domain + '/' + realm + '/main/globalreport/marketing/by_trade_at_cities/' + rbsKey + '/' + val.ci + '/' + val.ri + '/' + val.ti + '">' + parseFloat(retailBySpec[rbsKey].spr).toFixed(2) + '</a></td>';
							output += '<td '+getColStyle('rbs_sq')+' align="right" id="td_rbs_sq_' + rbsKey + '"><a target="_blank" href="http://' + domain + '/' + realm + '/main/globalreport/marketing/by_trade_at_cities/' + rbsKey + '/' + val.ci + '/' + val.ri + '/' + val.ti + '">' + parseFloat(retailBySpec[rbsKey].sq).toFixed(2) + '</a></td>';
							++idx;
							if(idx >= ingCnt) {break;}
						}
					}
				}
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
				}
		);
	});
	return false;
}

function unknownIfNull(locale, opValue) {
	if (opValue == null || opValue === '' || opValue === 'NaN'){
	  return (locale == 'en') ? 'unknown' : 'не изв.';
	} else {
	  return opValue;
	}
}
function loadServices(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var locale = getLocale();
	var suffix = (locale == 'en') ? '_en' : '';
    var selected = $('#id_service').val();
	
	$.getJSON('./'+realm+'/service_unit_types'+suffix+'.json', function (data) {
		var services = '';
		var serviceSpecs = '';

		$.each(data, function (key, val) {
			services += '&nbsp;<img src="'+ val.iu+'"';
            if(selected != null && selected == val.i){
                services += ' border="1"';
                for (i in val.s) {
                    serviceSpecs += '<option value="'+i+'">'+val.s[i].c+'</option>';
                }
            }
            services += ' width="24" height="24" id="img'+val.i+'" title="'+val.c+'" style="cursor:pointer" onclick="changeService(\''+val.i+'\')">';
		});

		$('#services').html(services);
		$('#id_service_spec').html(serviceSpecs);
        var id_service_spec = getVal('id_service_spec');
		$('#id_service_spec').val(id_service_spec);
        id_service_spec = $('#id_service_spec').val();
        if (id_service_spec == null || id_service_spec == '') {
            id_service_spec = $('#id_service_spec > option').eq(0).val();
            $('#id_service_spec').val(id_service_spec);
        }
        updateEquipRawMat(data);
		if(typeof(callback) === 'function') {
			callback();
		}
	});
	return false;
}
function updateEquipRawMat(data){
    var selected = $('#id_service').val();
    id_service_spec = $('#id_service_spec').val();
	var locale = getLocale();
	var domain = getDomain(locale);
	var realm = getRealm();
	var svRetailRow = (locale == 'en') ? 'Show remains in warehouses' : 'Показать запасы на складах';
	var svSelfProdRow = (locale == 'en') ? 'Calculate production' : 'Посчитать производство';
	var localPrice = (locale == 'en') ? '<span title="Local suppliers price">L.s. price</span>' : 'Местные, цена';
	var localQuality = (locale == 'en') ? '<span title="Local suppliers quality">L.s. quality</span>' : 'Местные, качество';

    if (id_service_spec != null || id_service_spec != '') {
        $.each(data, function (key, val) {
            if(selected != null && selected == val.i){
                var equipCell = '';
                var equipProdCell = '';
                var rawMatCell = '';
                var rawMatProdCell = '';
				var nvDynColCnt = 2;
				var svDynColHeaders = '';

                for (i in val.s) {
                    if(i === id_service_spec){
						nvDynColCnt += 2;
						svDynColHeaders += '<th '+getColStyle('cbs_lpr')+' id="th_cbs_lpr">'+localPrice+'</th>';
						svDynColHeaders += '<th '+getColStyle('cbs_lq')+' id="th_cbs_lq">'+localQuality+'</th>';
                        if(val.s[i].e != null){
						  equipCell += '<a href="http://'+domain+'/'+realm+'/main/globalreport/marketing/by_products/'+val.s[i].e.i+'/" target="_blank">';
						  equipCell += '<img src="'+ val.s[i].e.s+'" width="16" height="16" id="img'+val.s[i].e.i+'" title="'+val.s[i].e.c+'"">';
						  equipCell += '</a>';
						  equipProdCell += '<a href="/industry/#id_product='+val.s[i].e.i+'" target="_blank">';
						  equipProdCell += '<img src="'+ val.s[i].e.s+'" width="16" height="16" id="img'+val.s[i].e.i+'" title="'+val.s[i].e.c+'"">';
						  equipProdCell += '</a>';
                        }
                        if(val.s[i].rm != null){
                            for (k in val.s[i].rm) {
                                rawMatCell += '<a href="http://'+domain+'/'+realm+'/main/globalreport/marketing/by_products/'+val.s[i].rm[k].i+'/" target="_blank">';
                                rawMatCell += '<img src="'+ val.s[i].rm[k].s+'" width="16" height="16" id="img'+val.s[i].rm[k].i+'" title="'+val.s[i].rm[k].c+'"">';
                                rawMatCell += '</a>';
                                rawMatProdCell += '<a href="/industry/#id_product='+val.s[i].rm[k].i+'" target="_blank">';
                                rawMatProdCell += '<img src="'+ val.s[i].rm[k].s+'" width="16" height="16" id="img'+val.s[i].rm[k].i+'" title="'+val.s[i].rm[k].c+'"">';
                                rawMatProdCell += '</a>';
								nvDynColCnt += 2;
								svDynColHeaders += '<th '+getColStyle('rbs_lpr')+' id="th_rbs_lpr_' + val.s[i].rm[k].i + '">' + localPrice + '<img src="' + val.s[i].rm[k].s + '" width="16" height="16" title="' + val.s[i].rm[k].c + '""></th>';
								svDynColHeaders += '<th '+getColStyle('rbs_lq')+' id="th_rbs_lq_'+val.s[i].rm[k].i+'">'+localQuality+'<img src="'+ val.s[i].rm[k].s+'" width="16" height="16" title="'+val.s[i].rm[k].c+'""></th>';
							}
                        }
                        break;
                    }
                }
                var equip_raw_mat_body = '<tr class="trec hoverable"><td>'+svRetailRow+'</td><td>'+ equipCell +'</td><td>'+ rawMatCell +'</td></tr>';
                equip_raw_mat_body += '<tr class="trec hoverable"><td>'+svSelfProdRow+'</td><td>'+ equipProdCell +'</td><td>'+ rawMatProdCell +'</td></tr>';
				$('#equip_raw_mat_body').html(equip_raw_mat_body);

				$('#th_dyn_col').attr('colspan', nvDynColCnt);
				$('#tr_dyn_col').html(svDynColHeaders);
                //break each
                return false;
            }
        });
    }
}
function changeService(newVal) {
    $('#id_service').val(newVal);
    setVal('id_service', newVal);
	loadServices(loadData);
	updateReferenceLink();
}
function changeServiceSpec() {
    setVal('id_service_spec', $('#id_service_spec').val());
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var suffix = (getLocale() == 'en') ? '_en' : '';

	$.getJSON('./'+realm+'/service_unit_types'+suffix+'.json', function (data) {
        updateEquipRawMat(data);
	    loadData();
	});
	return false;
}
function loadCountries(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var locale = getLocale();
	var suffix = (locale == 'en') ? '_en' : '';
	if(sagCountryCaption === null) {
		sagCountryCaption = [];
	}
	if(sagRegionCaption === null) {
		sagRegionCaption = [];
	}

    $.getJSON('/by_trade_at_cities/'+realm+'/regions'+suffix+'.json', function (data) {
        $.each(data, function (key, val) {
            sagRegionCaption[val.i] = val.c;
        });
    });

	$.getJSON('/by_trade_at_cities/'+realm+'/countries'+suffix+'.json', function (data) {
	  var allCountries = (locale == 'en') ? 'All countries' : 'Все страны';
	  var allRegions = (locale == 'en') ? 'All regions' : 'Все регионы';
		var output = '<option value="" selected="">'+allCountries+'</option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.i+'">'+val.c+'</option>';
			sagCountryCaption[val.i] = val.c;
		});
		
		$('#id_country').html(output); 	// replace all existing content
		$('#id_region').html('<option value="" selected="">'+allRegions+'</option>'); 	// replace all existing content
		if(typeof(callback) === 'function') callback();
	});
	return false;
}
function loadTowns(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;

	var svCountryId = $('#id_country').val();
	var svRegionId = $('#id_region').val();
	var locale = getLocale();
	var suffix = (locale == 'en') ? '_en' : '';
	var allTowns = (locale == 'en') ? 'All cities' : 'Все города';

	$.getJSON('/by_trade_at_cities/'+realm+'/cities'+suffix+'.json', function (data) {
		var output = '<option value="" selected="">'+allTowns+'</option>';

		$.each(data, function (key, val) {
			if(svRegionId != null && svRegionId != '' && val.ri == svRegionId){
				output += '<option value="'+val.i+'">'+val.c+'</option>';
			} else if(svCountryId != null && svCountryId != '' && val.ci == svCountryId){
				output += '<option value="'+val.i+'">'+val.c+'</option>';
			} else if((svCountryId == null || svCountryId == '') && (svRegionId == null || svRegionId == '')){
				output += '<option value="'+val.i+'">'+val.c+'</option>';
			}
		});

		$('#id_town').html(output);
		if(typeof(callback) === 'function') callback();
	});
	return false;
}
function loadRegions(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCountryId = $('#id_country').val();
	var locale = getLocale();
	var suffix = (locale == 'en') ? '_en' : '';
	var allRegions = (locale == 'en') ? 'All regions' : 'Все регионы';

    $.getJSON('/by_trade_at_cities/'+realm+'/regions'+suffix+'.json', function (data) {
        var output = '<option value="" selected="">'+allRegions+'</option>';

        if (svCountryId == null || svCountryId == '') {
            $.each(data, function (key, val) {
                output += '<option value="'+val.i+'">'+val.c+'</option>';
            });
        } else {
            $.each(data, function (key, val) {
                if(val.ci == svCountryId){
                    output += '<option value="'+val.i+'">'+val.c+'</option>';
                }
            });
        }

        $('#id_region').html(output);
		loadTowns(callback);
    });
	return false;
}
function changeRealm(productCategoriesCallback, countryCallback) {
	fillTownCaptions();
	loadServices(productCategoriesCallback);
	id_country = getVal('id_country');
    if(typeof(countryCallback) !== 'function') {
        if(id_country != null && id_country != '') {
            var regionCallback = function() {
                $('#id_region').val(getVal('id_region'));
                loadData();
            };
            var countryCallback = function() {
                $('#id_country').val(id_country);
                loadRegions(regionCallback);
            };
  		}
    }
	loadCountries(countryCallback);
	setVal('realm', getRealm());
	fillUpdateDate();
	updateReferenceLink();
}
function changeCountry(callback) {
//    console.log('changeCountry, caller is '+ arguments.callee.caller.toString());
	$('#id_region').html(''); 	// replace all existing content
//	console.log('changeCountry, typeof(callback) =  '+ typeof(callback));
	if (typeof(callback) !== 'function'){
		callback = function() {
			$('#id_region').val(getVal('id_region'));
			loadTowns(loadData);
		};
	}
	loadRegions(callback);
	setVal('id_country', $('#id_country').val());
}
function changeRegion(callback) {
	if (typeof(callback) === 'function'){
		loadTowns(callback);
	} else {
		loadTowns(loadData);
	}
	setVal('id_region', $('#id_region').val());
}
function changeTown() {
	loadData();
	setVal('id_town', $('#id_town').val());
}

function fillUpdateDate() {
	$('#update_date').text(''); 	// replace all existing content
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var prefix = (getLocale() == 'en') ? 'updated' : 'обновлено';
	
	$.getJSON('./'+realm+'/updateDate.json', function (data) {
		$('#update_date').text(prefix+': ' + data.d); 	// replace all existing content
	});
}

function showCol(colID){
	if (colID.lastIndexOf('rbs_', 0) === 0){
		$('th[id^=th_rbs_], td[id^=td_rbs_]', 'tr').show();
	} else if (colID.lastIndexOf('cbs_', 0) === 0){
		$('th[id^=th_cbs_], td[id^=td_cbs_]', 'tr').show();
	} else {
		$('th#th_'+ colID +', td#td_' + colID, 'tr').show();
	}
	sagInvisibibleColumns = jQuery.grep(sagInvisibibleColumns, function(value) {
		return value != colID;
	});
}
function hideCol(colID){
	if (colID.lastIndexOf('rbs_', 0) === 0){
		$('th[id^=th_rbs_], td[id^=td_rbs_]', 'tr').hide();
	} else if (colID.lastIndexOf('cbs_', 0) === 0){
		$('th[id^=th_cbs_], td[id^=td_cbs_]', 'tr').hide();
	} else {
		$('th#th_'+ colID +', td#td_' + colID, 'tr').hide();
	}
	sagInvisibibleColumns.push(colID);
}
function showAllCol(){
	$('select#show_hide_col_ru > option').each(function() {
		var value = $(this).attr('value');
		showCol(value);
	});
	sagInvisibibleColumns = [];
	setVal('invisibible_columns_service', sagInvisibibleColumns);
}
function hideAllCol(){
	$('select#show_hide_col_ru > option').each(function() {
		var value = $(this).attr('value');
		hideCol(value);
	});
	setVal('invisibible_columns_service', sagInvisibibleColumns);
}
function initShowHideColSelect() {
	var show_hide_col_id = (getLocale() === 'en') ? "show_hide_col_en" : "show_hide_col_ru";
	var show_hide_col = $("select#" + show_hide_col_id).multiselect();

	show_hide_col.multiselect({
		click: function(event, ui){
			if (ui.checked) {
				showCol(ui.value);
			} else {
				hideCol(ui.value);
			}
			setVal('invisibible_columns_service', sagInvisibibleColumns);
		},
		checkAll: function(){
			showAllCol();
		},
		uncheckAll: function(){
			hideAllCol();
		}
	});

	sagInvisibibleColumns = getVal('invisibible_columns_service');
	if (sagInvisibibleColumns == null) {
		sagInvisibibleColumns = [];
		hideCol('rbs_spr');
		hideCol('rbs_sq');
	}
	$.each(sagInvisibibleColumns, function (key, val) {
//            console.log('key = '+key +', val = '+val);
		hideCol(val);
		$("select#"+ show_hide_col_id +" > option[value="+val+"]").attr('selected',false);
	});
	show_hide_col.multiselect('refresh');
}
//////////////////////////////////////////////////////
$(document).ready(function () {
	initShowHideColSelect();

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
			ascDesc = tableHeader.getAttribute('data-order');
			isAscending = ascDesc=='asc';
			order = isAscending?'desc':'asc';
			tableHeader.setAttribute('data-order',order);
			$('#sort_by_'+$('#sort_col_id').val()).html('');
			$('#sort_col_id').val(tableHeaderId);
			$('#sort_dir').val(order);
			setVal('sort_col_id_service', $('#sort_col_id').val());
			setVal('sort_dir_service', $('#sort_dir').val());
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
		window.location.hash = '';
	}
	if (getLocale() != 'ru') {
		 $('#locale').val(getLocale());
		applyLocale();
	}
});

$(document).ready(function () { // load json file using jquery ajax
	$.getJSON('./data.json', function (data) {
		var output = '<table border="1" width="100%" cellspacing="0" cellpadding="2" bordercolorlight="#000000" bordercolordark="#FFFFFF">'
+'<tbody><tr class="theader"><td rowspan="2">Город</td><td rowspan="2">Индекс</td><td rowspan="2">Объём</td><td rowspan="2">Местные, %</td><td colspan="3">Местные</td><td colspan="3">Магазины</td><td rowspan="2">Обновлено</td></tr>'
+'<tr class="theader"><td>Цена</td><td>Качество</td><td>Бренд</td><td>Цена</td><td>Качество</td><td>Бренд</td></tr>';

		$.each(data, function (key, val) {
			output += '<tr class="trec">';
			output += '<td><a href="http://virtonomica.ru/olga/main/globalreport/marketing/by_trade_at_cities/'+val.productId+'/'+val.countryId+'/'+val.regionId+'/'+val.cityId+'">'+val.cityCaption+'</a></td>';
			output += '<td align="center">'+val.marketIdx+'</td>';
			output += '<td align="right">'+val.volume+'</td>';
			output += '<td align="right" style="color:black">'+val.localPercent+'</td>';
			output += '<td align="right">'+val.localPrice+'</td>';
			output += '<td align="right">'+val.localQuality+'</td>';
			output += '<td align="right">'+val.localBrand+'</td>';
			output += '<td align="right">'+val.shopPrice+'</td>';
			output += '<td align="right">'+val.shopQuality+'</td>';
			output += '<td align="right">'+val.shopBrand+'</td>';
			output += '<td align="center">11.03.2013</td>';
			output += '</tr>';
		});
		output += '</tbody></table>';
		
		$('#update').html(output); 	// replace all existing content
	});
});

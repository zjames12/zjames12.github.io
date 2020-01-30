// Jquery stuff to control the behavior of webpage
$(document).ready(function() {
  // hide all submenus until called
	$('#warning').text("Select a category");

	$("#type-of-measure").hide();
	$("#type-of-measure_label").hide();
	$("#measure_label").hide();
	$("#measure").hide();
	$("#demographic-type").hide();
	$('#filter_label').hide();
	$('#filter').hide();


	$('#comp2').hide();
	$('#comp3').hide();
	$('#comp4').hide();
	$('#comp2_label').hide();
	$('#comp3_label').hide();
	$('#comp4_label').hide();

	$('#descriptionone').html("<b>Description: </b> Use the sidebar to the left to select the healthcare measure");
	$('#descriptiontwo').html("<b>Description: </b> Use the sidebar to the left to select the health determinant");

	// get menu struture for health determinants
	$.getJSON("data/folder_tree.json", function(json) {
		var comp1 = $('#comp1');
		var list = Object.keys(json).sort();
		$(list).each(function() {
			var text = this;
			if (text == 'Demographics Factors') {
				text = 'Demographic Factors';
			}

			comp1.append($("<option>").attr('value',this).text(text));
		});
	});

  //Jquery for first selection (category of measures)
  $('#category-measures').change(function() {

	  $('#warning').text("Select a sub-category");

		$("#measure_label").hide();
		$("#measure").hide();
		$("#demographic-type").hide();
		$('#filter_label').hide();
		$('#filter').hide();

		$("#type-of-measure").show();
		$("#type-of-measure_label").show();

		$('#type-of-measure').prop('disabled', true);
		if ($(this).val() == "access" || $(this).val() == "prevalence" || $(this).val() == "utilization" || $(this).val() == "insurance" || $(this).val() == "outcome") {
		  $('#type-of-measure').prop('disabled', false);
		}

		if ($(this).val() == 'prevalence') {
			$('#select1').attr('hidden', true);

		} else {
			$('#select1').attr('hidden', false);
		}

		changeDescriptionMap1();

		// edit list of subcategory of measure by category
		if ($(this).data('options') == undefined) {
		  $(this).data('options', $('#type-of-measure option').clone());}
		var id = $(this).val();
		var options = $(this).data('options').filter('[class=' + id + ']');
		$('#type-of-measure').html(options);

  });

  // when type-of-measure clicked
  $('#type-of-measure').change(function() {
	$('#warning').text("Select a quantitative measure");

	$("#measure_label").hide();
	$("#measure").hide();
	$("#demographic-type").hide();
	$('#filter_label').hide();
	$('#filter').hide();

	var measure = $("#category-measures").val();
	var selection = $(this).val();

	var file_loc = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +'/' + selection;
	var filename = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +' ' + selection

	$("input[name=select1_choice][type=radio][value='Census Tract']").prop("disabled",false);

	// visibility and filtering of quantitative measure
	if (measure == 'utilization'|| measure=='access' ) {

		$("#measure_label").show();
		$("#measure").show();

		if ($(this).data('options') == undefined ) {
		  $(this).data('options', $('#measure option').clone());}
		var id = $(this).val();
		var options = $(this).data('options').filter('[class=' + measure + ']');
		$('#measure').html(options);


		file_loc = file_loc + '/' + $('#measure').val()
		filename = filename + ' ' + $('#measure').val()

	}

	if (measure == 'outcome' || measure == 'insurance') {
		$("input[name=select1_choice][type=radio][value='Census Tract']").prop("disabled",true);
		$("input[name=select1_choice][type=radio][value='County']").prop("checked",true);
	}
	// visbibility and filtering of adult/pediatric
	if (selection=='ADHD') {
		// no adult data
		$("#demographic-type").show();
		$("input[type=radio][value=Adult]").prop("disabled",true);
		$("input[type=radio][value=Pediatric]").prop("disabled",false);
		$("input[type=radio][value=Pediatric]").prop("checked",true);

		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();

	} else if (selection=='Cardiovascular') {
		//no child data
		$("#demographic-type").show();
		$("input[type=radio][value=Pediatric]").prop("disabled",true);
		$("input[type=radio][value=Adult]").prop("disabled",false);
		$("input[type=radio][value=Adult]").prop("checked",true);

		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();

	} else if (measure=='prevalence' || measure=='utilization'){
		$("#demographic-type").show();
		$("input[type=radio][value=Pediatric]").prop("disabled",false);
		$("input[type=radio][value=Adult]").prop("disabled",false);
		$("input[type=radio][value=Adult]").prop("checked",true);

		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	};


	// update file location placeholder
	$('#file_placeholder').val(file_loc+'/' + filename);

	changeDescriptionMap1();

  });


  // update when demographic selected
  $('#demographic-type').change(function() {

	var measure = $("#category-measures").val();
	var selection =  $("#type-of-measure").val();

	var file_loc = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +'/' + selection;
	var filename = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +' ' + selection;

	if (measure == 'utilization'|| (measure=='access' && (selection=='Adult Primary Care' ||
			selection=='Pediatric Primary Care' || selection=='Pediatric Asthma Care' || selection=='Pediatric Dental Care'))) {
		file_loc = file_loc + '/' + $('#measure').val()
		filename = filename + ' ' + $('#measure').val()
	} else if (measure=='access'){
		file_loc = file_loc + '/' + $('#measure').val()
		filename = filename + ' ' + $('#measure').val()
	};

	$('#filter_label').hide();
	$('#filter').hide();

	if (selection=='ADHD') {
		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	} else if (selection=='Cardiovascular') {
		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	} else if (measure=='prevalence' || measure=='utilization'){
		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	};

	// update file location placeholder
	$('#file_placeholder').val(file_loc+'/' + filename);

	changeDescriptionMap1();
  });


  // update when measurement changed
  $('#measure').change(function() {

	  $('#warning').text("Select data");

	var measure = $("#category-measures").val();
	var selection =  $("#type-of-measure").val();
	var quant = $('#measure').val();

	$('#filter_label').hide();
	$('#filter').hide();
	$("input[name=select1_choice][type=radio][value='Census Tract']").prop("disabled",false);

	var file_loc = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +'/' + selection;
	var filename = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +' ' + selection;





	if  (quant == 'Percent Not Covered' || (quant == 'Travel Distance' && selection == 'Pediatric Dental Care')) {
			$('#filter_label').show();
			$('#filter').show();

			if ($('#filter').data('options') == undefined) {
			  $('#filter').data('options', $('#filter option').clone());}
			var options = $('#filter').data('options').filter('[class=td]');
			$('#filter').html(options);
	} else	if (measure == 'utilization'|| measure=='access' ){
		file_loc = file_loc + '/' + $('#measure').val()
		filename = filename + ' ' + $('#measure').val()
		if (quant == 'Travel Distance'){
			$('#filter_label').show();
			$('#filter').show();
			if ($('#filter').data('options') == undefined) {
			  var options = $('#filter').data('options', $('#filter option').clone());}
			var options = $('#filter').data('options');
			$('#filter').html(options);
			//$("input[name=select1_choice][type=radio][value='Census Tract']").prop("disabled",true);
			$("input[name=select1_choice][type=radio][value='County']").prop("checked",true);


		};
	} else if (measure=='access'){
		file_loc = file_loc + '/' + $('#measure').val()
		filename = filename + ' ' + $('#measure').val()
	};



	if (selection=='ADHD') {
		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	} else if (selection=='Cardiovascular') {
		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	}else if (measure=='prevalence' || measure=='utilization'){
		file_loc = file_loc + '/' + $("input[name='demographic-type']:checked").val();
		filename = filename + ' ' + $("input[name='demographic-type']:checked").val();
	};

	// update file location placeholder
	$('#file_placeholder').val(file_loc+'/' + filename);


	changeDescriptionMap1();
  });


$('#filter').change(function(){
	var measure = $("#category-measures").val();
	var selection =  $("#type-of-measure").val();
	var quant = $('#measure').val();
	var f = $('#filter').val();


	if (quant=='Travel Distance' && (f == 'Black' || f =='White'|| f =='Hispanic')) {
		$("input[name=select1_choice][type=radio][value='Census Tract']").prop("disabled",true);
		$("input[name=select1_choice][type=radio][value='County']").prop("checked",true);
	} else {
		$("input[name=select1_choice][type=radio][value='Census Tract']").prop("disabled",false);
		$("input[name=select1_choice][type=radio][value='County']").prop("checked",true);
	}
	var file_loc = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +'/' + selection + '/' + quant;
	var filename = measure.toLowerCase().replace(/\b[a-z]/g, function(letter) {return letter.toUpperCase();}) +' ' + selection + ' ' + quant;

	file_loc = file_loc + '/' + $("#filter").val();
	filename = filename + ' ' + $("#filter").val();

	$('#file_placeholder').val(file_loc+'/' + filename);

	changeDescriptionMap1();
});









 // Comparative factor list 1

$('#comp1').change(function(){
	var sel = $(this).val();
	var comp1 = $('#comp1').val();
	$.getJSON("data/folder_tree.json", function(json) {
		if (sel == "Social Vulnerability") {
				$('#comp2').hide();
				$('#comp2_label').hide();
				$('#comp3_label').hide();
				$('#comp4_label').hide();
				$('#comp3').hide();
				$('#comp4').hide();
				$('#select2').hide();
				changeDescriptionMap2("Social Vulnerability/Social Vulnerability Index All County.csv");
		} else {
			$('#comp2').empty();
			$('#comp2').show();
			$('#comp3').hide();
			$('#comp4').hide();
			$('#comp2_label').show();
			$('#comp3_label').hide();
			$('#comp4_label').hide();
			$('#select2').hide();
		};
	});

	var sel = $(this).val();
	var comp1 = $('#comp1').val();

	$.getJSON("data/folder_tree.json", function(json) {
		var comp2 = $('#comp2');
		var list = Object.keys(json[sel]).sort();
		comp2.append($("<option>").attr('value','0').text('Select One').prop('selected', true).prop('disabled', true));
		$(list).each(function() {
			comp2.append($("<option>").attr('value',this).text(this));
		});
	});

});

 // Comparative factor list 2
$('#comp2').change(function(){
	$('#comp4').hide();
	$('#comp4_label').hide();
	$('#select2').show();
	$('#comp3').hide();
	$('#comp3_label').hide();

	var sel = $(this).val();
	var comp1 = $('#comp1').val();

	$.getJSON("data/folder_tree.json", function(json) {
		var comp3 = $('#comp3');

		if (json[comp1][sel].constructor === Array) {
			if (json[comp1][sel].length==2){
				$('#select2').show();
				comp_county();
			} else {
				changeDescriptionMap2(comp1+'/' + sel+'/'+json[comp1][sel][0]);
			};
		// Uncomment below lines of code to have the third label show up
		// for determinants

		} else {
			$('#comp3').show();
			$('#comp3_label').show();
			$('#comp3').empty();

			var list = Object.keys(json[comp1][sel]).sort();
			comp3.append($("<option>").attr('value','0').text('Select One').prop('selected', true).prop('disabled', true));
			$(list).each(function() {
				comp3.append($("<option>").attr('value',this).text(this));
			});
		};
	});

});

 // Comparative factor list 1
$('#comp3').change(function(){
	var sel = $(this).val();
	var comp1 = $('#comp1').val();
	var comp2 = $('#comp2').val();
	$('#comp4').hide();
	$('#comp4_label').hide();
	$('#select2').hide();

	$.getJSON("data/folder_tree.json", function(json) {
		var comp4 = $('#comp4');
		if (json[comp1][comp2][sel].constructor == Array){
			if (json[comp1][comp2][sel].length == 2){
				$('#select2').show();
				comp_county();
			} else {
				changeDescriptionMap2(comp1+'/'+comp2+'/'+sel+'/'+json[comp1][comp2][sel][0]);
			};
		} else {
			$('#comp4').show();
			$('#comp4_label').show();

			$('#comp4').empty();
			var list = Object.keys(json[comp1][comp2][sel]).sort();
			comp4.append($("<option>").attr('value','0').text('Select One').prop('selected', true).prop('disabled', true));
			$(list).each(function() {
				comp4.append($("<option>").attr('value',this).text(this));
			});
		};
	});

});

 // Comparative factor list 1
$('#comp4').change(function(){
	$('#select2').hide();
	var sel = $(this).val();
	var comp1 = $('#comp1').val();
	var comp2 = $('#comp2').val();
	var comp3 = $('#comp3').val();

	$.getJSON("data/folder_tree.json", function(json) {
		if (json[comp1][comp2][comp3][sel].length == 2){
			$('#select2').show();
			comp_county();
		} else {
			changeDescriptionMap2(comp1+'/'+comp2+'/'+sel+'/'+json[comp1][comp2][comp3][sel][0]);
		};
	});


});






// update when county/ct changed for map1
$('#select1').change(function(){
	changeDescriptionMap1()
});

// update when county/ct changed for map2
$("#select2").change(function() {
	comp_county()
});

function comp_county() {
	comp1 = $('#comp1').val();
	var file = comp1;

	$.getJSON("data/folder_tree.json", function(json) {
		json = json[comp1];
		if ($('#comp2').val() != 'Select One') {
			var comp2 = $('#comp2').val();
			file = file +'/'+comp2;
			json = json[comp2]
		};
		if ($('#comp3').val() != 'Select One' && json.constructor != Array) {
			var comp3 = $('#comp3').val();
			file = file +'/'+comp3;
			json = json[comp3]
		};
		if ($('#comp4').val() != 'Select One' && json.constructor != Array) {
			comp4 = $('#comp4').val();
			file = file +'/'+comp4;
			json = json[comp4];
		};

		$(json).each(function() {
			if (this.indexOf($("input[name='select2_choice']:checked").val()+'.csv') !== -1){
				file = file +'/'+this;
				changeDescriptionMap2(file);
			};
		});
	});
};

















  // CHANGE MAP1 description and MAP
  function changeDescriptionMap1() {

    var txt = "Description:";
	// $('#descriptionone').html("");

	var placeholder = $('#file_placeholder').val();
	$('#descriptionone').html("");

	var file = placeholder + ' ' + $("input[name='select1_choice']:checked").val();

	//window.alert(file)


	if (placeholder != "" && placeholder.indexOf('0') == -1 && placeholder.indexOf('Select One') == -1 && placeholder != "Access/Adult Primary Care/Travel Distance/Access Adult Primary Care Travel Distance" &&
		placeholder != "Access/Adult Primary Care/Percent Not Covered/Access Adult Primary Care Percent Not Covered"&&
		placeholder != 'Access/Pediatric Asthma Care/Percent Not Covered/Access Pediatric Asthma Care Percent Not Covered'
		) {
		changeMap1();

		$('#warning').text(" ")

		$.getJSON("data/descriptions.json", function(json) {
			if (json[file] == undefined) {
				$('#descriptionone').html("<b>Description: </b> This data was not found");
				//window.alert(file)
				$('#warning').text("Data not found")
			} else {
			$('#descriptionone').html("<b>Description: </b>"+json[file]);
			}
			delete json;
		});

		$.getJSON("data/source1.json", function(json) {
			if (json[file] == undefined) {
				$('#source1').html("<b>Source: </b> Unknown");
			} else {
				$('#source1').html("<b>Source: </b>"+json[file]);
			}
			delete json;
	});

	} ;



  };


// CHANGES MAP2 description and map
  function changeDescriptionMap2(file) {
	  //console.log(file);
	console.log(file);
	jQuery('#data_map2').unbind('click');
	jQuery('#image_map2').unbind('click');
	jQuery('#data_map2').click(function(){
		window.location.href = 'data/' + file + '.csv';
	});
	jQuery('#image_map2').click(function(){
		window.location.href = 'data/' + file + '.png';
	});

	changeMap2(file);
	// $('#descriptiontwo').html("");
	var file = 'datasets/'+ file.replace('.csv','');
	//console.log(file);

	$.getJSON("data/descriptions.json", function(json) {
		if (json[file] == undefined) {
			console.log("undefined");
			$('#descriptiontwo').html("<b>Description: </b> This data was not found");
		} else {
			$('#descriptiontwo').html("<b>Description: </b>"+json[file]);
		}
		delete json;
	});

	$.getJSON("data/source2.json", function(json) {
		if (json[file] == undefined) {
			$('#source2').html("<b>Source: </b> Unknown");
		} else {
			$('#source2').html("<b>Source: </b>"+json[file]);
		}
		delete json;
	});

  };


});

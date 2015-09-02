$.fn.newsletter_product_autocomplete = function (options) {
  'use strict';

  // Default options
  options = options || {};
  var multiple = typeof(options.multiple) !== 'undefined' ? options.multiple : true;

  this.select2({
    width: '200px',
    minimumInputLength: 3,
    multiple: multiple,
    initSelection: function (element, callback) {
      $.get(Spree.routes.product_search, {
        ids: element.val().split(','),
        token: Spree.api_key
      }, function (data) {
        callback(multiple ? data.products : data.products[0]);
      });
    },
    ajax: {
      url: Spree.routes.product_search,
      datatype: 'json',
      data: function (term, page) {
        return {
          q: {
            name_cont: term,
            sku_cont: term
          },
          m: 'OR',
          token: Spree.api_key
        };
      },
      results: function (data, page) {
        var products = data.products ? data.products : [];
        return {
          results: products
        };
      }
    },
    formatResult: function (product) {
      return product.name;
    },
    formatSelection: function (product) {
      return product.name;
    }
  });
};

var uploadify_script_data = {};

function get_uploadify_script_data() {
	var ad = uploadify_script_data;
	ad['[image][name]'] = $("#image_name").val();
	ad['[image][href]'] = $("#image_href").val();
	return ad;
};

var uploadify_script_data = {};

$(document).ready(function(){

  var csrf_param = $('meta[name=csrf-param]').attr('content');
  var csrf_token = $('meta[name=csrf-token]').attr('content');
  //uploadify_script_data[csrf_token] = encodeURI(csrf_param);
  uploadify_script_data[csrf_param] = encodeURIComponent(csrf_token);
  uploadify_script_data[app_key] = encodeURIComponent(app_cookie);
  
  //$("#add_product_value").newsletter_product_autocomplete();
  $("#add_product_value").newsletter_product_autocomplete({multiple: false});
  
  $("#trash").droppable({
    accept: "#module_list > li",
    activeClass: "ui-state-highlight",
    drop: function( event, ui ) {
      if (!confirm('Are you sure you would like to remove this module?')) return false;
      ui.draggable.remove();
      var moduleData = {
          'newsletter_id': newsletter_id,
          'module': {
            'newsletter_id': newsletter_id,
            'module_id': ui.draggable.attr("id").split("_").pop()
          }
      };

      jQuery.post( '/admin/newsletters/remove_module', moduleData, function(data, status, xhr){
        preview_newsletter();
        $('#module_list').replaceWith(data);
        init_module_list();
      });
    }
  });

  $('#select_image').uploadify({
    'swf'               : '/assets/jquery-uploadify/uploadify.swf',
    'uploader'          : '/admin/newsletters/'+newsletter_id+'/add_image',
    'cancelImg'         : '/assets/jquery-uploadify/uploadify-cancel.png',
    'method'            : 'post',
    'removeCompleted'   : true,
    'multi'             : true,
    'auto'              : false,
    'onUploadError'           : function (file, errorCode, errorMsg, errorString) {
      alert('Error Uploading: ' + errorString);
    },
    'onUploadSuccess': function (file, data, response) {
      preview_newsletter();
      console.log(file, data, response);
      $('#module_list').replaceWith(data);
      init_module_list();
    }
  });

  $("#add_image").on("click", function(e) {
	  uploadify_script_data['[image][name]'] = $("#image_name").val();
	  uploadify_script_data['[image][href]'] = $("#image_href").val();
    $('#select_image').uploadify('settings','formData', uploadify_script_data);
    //$('#select_image').uploadifySettings('scriptData', uploadify_script_data);
    $('#select_image').uploadify('upload');
    e.preventDefault();
  });
  
  $("#add_copy").on("click", function(e) {
    var copyData = {
        'newsletter_id': newsletter_id,
        'newsletter_copy': {
          'newsletter_id': newsletter_id
        }
    };
    $.ajax({
      url: '/admin/newsletters/'+newsletter_id+'/new_copy',
      data: copyData,
      success: function(data, textStatus, jqXHR){
        openFormDialog(data);
      },
      dataType: "text",
      beforeSend: function(xhr, settings)
      {
        xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
      }
    });
    e.preventDefault();
    
  });
  
  $("#add_ruler").on("click", function(e) {
    add_module('hr');
    e.preventDefault();
  });
  
  $("#add_header").on("click", function(e) {
    add_module('h2', $("#add_header_value").val());
    e.preventDefault();
  });
  
  $("#add_product").on("click", function(e){
    add_module('product', $("#add_product_value").val(), $("#add_product_id").val());
    e.preventDefault();
  });

  init_module_list();
  
  $('#remote-dialog').dialog({
      autoOpen: false,
      width: 800,
      modal: true
  });
  
});

function add_module(name, value, id) {
  var moduleData = {
      'newsletter_id': newsletter_id,
      'module': {
        'newsletter_id': newsletter_id,
        'module_name': name
      }
  };
  if(value != undefined) {
    moduleData['module']['module_value'] = value;
  }
  if(id != undefined) {
    moduleData['module']['module_id'] = id;
  }
  jQuery.post( '/admin/newsletters/add_module', moduleData, function(data, status, xhr){
    preview_newsletter();
    $('#module_list').replaceWith(data);
    init_module_list();
  });
}

function preview_newsletter() {
  document.getElementById('newsletter-preview').contentDocument.location.reload(true);
}

function init_module_list() {
  $('#module_list').sortable({
    update: function(){
      var moduleSort = {
          'newsletter_id': newsletter_id,
          'module': {
            'newsletter_id': newsletter_id,
            'sort': $('#module_list').sortable('serialize')
          }
      };      
      jQuery.post( '/admin/newsletters/sort', moduleSort, function(){
        preview_newsletter();
      });
     }
  });
  
  $("#module_list .module_copy").dblclick(function(event){
  	var copy_id = $(this).data('module-id');
  	$.ajax({
      url: '/admin/newsletters/'+newsletter_id+'/edit_copy/'+copy_id,
      success: function(data, textStatus, jqXHR){
        openFormDialog(data);
      },
      dataType: "text",
      beforeSend: function(xhr, settings)
      {
        xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
      }
    });
  });
}

function openFormDialog(data){
  
  $('#remote-dialog').html(data);
  $('#remote-dialog').dialog("option", "title", $('#remote-dialog legend').html());
  $('#remote-dialog legend').remove();

  $('#remote-dialog form[data-remote="true"]').bind('ajax:complete', function(evt, xhr, status){
    $('#remote-dialog').dialog("close");
    preview_newsletter();
    $('#module_list').replaceWith(xhr.responseText);
    init_module_list();
  });
  
  $('#remote-dialog').dialog("open");
}

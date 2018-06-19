$(document).ready(function(){
	var socket = io();
	$('#formulario').submit(function(e){
		console.log("Boton oprimido");
		e.preventDefault();
		var data = {
			_id: $('#_id').val(),
			first_name: $('#first_name').val(),
			last_name: $('#last_name').val(),
			timezona: $('#timezona').val(),
			locale: $('#locale').val(),
			profile_pic: $('#profile_pic').val(),
			boleano: $('#boleano').val()
		};

		if(data._id==''){
			$('#_id').focus();
			return alert('Debe ingresar su ID!');
		}

		if (data.first_name == '') {
			$('#first_name').focus();
			return alert('Debe ingresar un nombre!');
		}

		var accion = 'crear';
		if ($('.warning').length>0) accion = 'actualizar';
		$('.warning').removeClass('warning');
			socket.emit(accion, data);	

		$('#formulario').trigger('reset');
		return true;
	});


		socket.on('listar', function(data){
			data = JSON.parse(data);
			for (var i=0, j=data.length; i<j; i++){
				fill(data[i]);
			}
		});
    
        // listado
		socket.on('nuevo', function(data){
			alert("Un nuevo usuario fue creado recientemente: "+data.first_name+" "+data.last_name);
			var $row = $('<tr id="'+data._id+'" class="info">');
			$row.append('<td>'+data._id+'</td>');
			$row.append('<td>'+data.first_name+'</td>');
			$row.append('<td>'+data.last_name+'</td>');
			$row.append('<td>'+data.timezona+'</td>');
			$row.append('<td>'+data.locale+'</td>');
			$row.append('<td>'+data.profile_pic+'</td>');
			 $row.append('<td>'+data.boleano+'</td>');
			$row.append('<td><button class="btn btn-success btn-sm" name="btnAct">Actualizar</button></td>');
			$row.append('<td><button class="btn btn-success btn-sm" name="btnEli">Eliminar</button></td>');
			$row.data('data', data);
			$('table tbody').append($row);
        });

        socket.on('borrado', function(data){
            $('#'+data).remove();
        });

	 var fill = function(data){
	 	if($('#'+data._id).length==0){

	 		/// listado
	 		var $row = $('<tr id="'+data._id+'">');
			$row.append('<td>'+data._id+'</td>');
			$row.append('<td>'+data.first_name+'</td>');
			$row.append('<td>'+data.last_name+'</td>');
			$row.append('<td>'+data.timezona+'</td>');
			$row.append('<td>'+data.locale+'</td>');
			$row.append('<td>'+data.profile_pic+'</td>');
			 $row.append('<td>'+data.boleano+'</td>');
			$row.append('<td><button class="btn btn-success btn-sm" name="btnAct">Actualizar</button></td>');
			$row.append('<td><button class="btn btn-success btn-sm" name="btnEli">Eliminar</button></td>');
			$row.data('data', data);

            /// update
			$row.find('[name=btnAct]').click(function(){
			var data = $(this).closest('tr').data('data');
			$('#_id').val(data._id);
			$('#first_name').val(data.first_name);
			$('#last_name').val(data.last_name);
			$('#timezona').val(data.timezona);
			$('#locale').val(data.locale);
			$('#profile_pic').val(data.profile_pic);
			 $('#boleano').val(data.boleano);
			$('.warning').removeClass('warning');
			$('.info').removeClass('info');
			$(this).closest('tr').addClass('warning');
		    });

			/// delete
			$row.find('[name=btnEli]').click(function(){
				var _id = $(this).closest('tr').attr('id');
				if (confirm('Continuar con eliminacion de registro?'+ _id)){
					socket.emit('eliminar', _id);
					$('.info').removeClass('info');
				}
			});

			$('.info').removeClass('info');
			$('table tbody').append($row);

	 	  } else {

	 	  	var $row = $('#'+data._id);
	 	  	$row.find('td:eq(1)').html(data.first_name);
	 	  	$row.find('td:eq(2)').html(data.last_name);
	 	  	$row.find('td:eq(3)').html(data.timezona);
	 	  	$row.find('td:eq(4)').html(data.locale);
	 	  	$row.find('td:eq(5)').html(data.profile_pic);
	 	  	 $row.find('td:eq(6)').html(data.boleano);
	 	  	$(this).closest('td').addClass('warning');
	 	  }
		};
});
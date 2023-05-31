$('.pokemonsInfo').show();
$('.combateInfo').hide();
$('.itensInfo').hide();
$('.capturaInfo').hide();

$('#pokemons').click(function(){
	$('.pokemonsInfo').show();
	$('.combateInfo').hide();
	$('.itensInfo').hide();
	$('.capturaInfo').hide();
});

$('#combate').click(function(){
	$('.pokemonsInfo').hide();
	$('.combateInfo').show();
	$('.itensInfo').hide();
	$('.capturaInfo').hide();
});
$('#itens').click(function(){
	$('.pokemonsInfo').hide();
	$('.combateInfo').hide();
	$('.itensInfo').show();
	$('.capturaInfo').hide();
});

$('#captura').click(function(){
	$('.pokemonsInfo').hide();
	$('.combateInfo').hide();
	$('.itensInfo').hide();
	$('.capturaInfo').show();
});
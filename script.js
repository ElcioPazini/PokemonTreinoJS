$(function(){
	$('#mostrarInfo').hide();
	$('#andar').hide();		
	$('#atacar').hide();
	$('#fugir').hide();
	$('#capturar').hide();
	$('#ok').hide();
	$('#vida').hide();
	$('#nome').hide();
	$('#nivel').hide();
	$('p').hide();
	$('.seuPoke').hide();
	$('#imgSeuPoke').hide();
	$('#imgOutroPoke').hide();
	$('#mostrarPokes').hide();
	$('#mostrarItens').hide();
	$('#curaNoPoke').hide();
	$('#bonusItem').hide();
	$('#habilidade').hide()

	class Pokemon{		
		constructor(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, experiencia, lvlUpReq, img, imgDr, raridade, tipo, habilidades){
			this.nome = nome;
			this.nivel = nivel;
			this.ataque = parseFloat((ataque+(escalaAtk*nivel)).toFixed(1));
			this.vida = parseFloat((vida+(escalaVida*nivel)).toFixed(1));
			this.vidaAtual = parseFloat((vida+(escalaVida*nivel)).toFixed(1));
			this.escalaAtk = parseFloat(escalaAtk.toFixed(1));
			this.escalaVida = parseFloat(escalaVida.toFixed(1));;
			this.experiencia = experiencia;
			this.lvlUpReq = calcularXpReq(nivel, 1.25)
			this.img = img;
			this.imgDr = imgDr;
			this.raridade = raridade;
			this.tipo = getTipo(tipo);
			this.habilidades = habilidades;
		}
	}
	class Habilidade{
		constructor(nome, multiplo, funcao, quantidade, atributo, tipo, maxQtd){
			this.nome = nome;
			this.multiplo = parseFloat(multiplo.toFixed(1));
			this.funcao = funcao;
			this.quantidade = quantidade;
			this.atributo = atributo;
			this.tipo = tipo;
			this.maxQtd = maxQtd;
		}
	}
	class Item{
		constructor(nome, funcao, quantidade, img){
			this.nome = nome;
			this.funcao = funcao;
			this.quantidade = quantidade;
			this.img = img;
		}
	}

	class Tipo{
		constructor(nome, vantagens, desvantagens){
			this.nome = nome;
			this.vantagens = vantagens;
			this.desvantagens = desvantagens;
		}
	}

	$('#value').show();
	$('#value').text('Primeiro escolha seu pokemon!')

	var pokemons = [];
	var pokemonAtivo = null;
	var seuPokemon = null;
	var xpPlayer = 0;
	var nivelPlayer = 1
	var lvlUpReqPlayer = 25
	var menu = 'pokemon';
	var itens = [new Item('Poção de cura', 'Cura', 3, 'imgs/LifePot.png'),
				 new Item('Biscoito de nivel', 'UparPokemon', 0, 'imgs/Cookie.png'),
				 new Item('Poção de reviver', 'Reviver', 1, 'imgs/RevivePot.png'),
				 new Item('Pokebola', 'Captura', 5, 'imgs/Pokebola.png')]
	var tipos = [new Tipo('Fogo', 
							['Planta', 'Inseto', 'Gelo', 'Aco'],
							['Agua', 'Terrestre', 'Pedra']),
				 new Tipo('Inseto', 
				 			['Psiquico', 'Planta', 'Sombrio'], 
				 			['Fogo', 'Voador', 'Pedra']),
				 new Tipo('Dragao',
				 			['Dragao'],
				 			['Dragao', 'Gelo', 'Fada']),
				 new Tipo('Fada', 
				 			['Sombrio', 'Dragao', 'Lutador'],
				 			['Venenoso', 'Aco']),
				 new Tipo('Lutador',
				 			['Sombrio', 'Gelo', 'Normal', 'Pedra', 'Aco'],
				 			['Fada', 'Voador', 'Psiquico']),
				 new Tipo('Voador',
				 			['Inseto', 'Lutador', 'Planta'],
				 			['Eletrico', 'Gelo', 'Pedra']),
				 new Tipo('Fantasma',
				 			['Fantasma', 'Psiquico'],
				 			['Fantasma', 'Sombrio']),
				 new Tipo('Planta',
				 			['Terrestre', 'Pedra', 'Agua'],
				 			['Inseto', 'Fogo', 'Voador', 'Gelo', 'Venenoso']),
				 new Tipo('Venenoso',
				 			['Planta', 'Fada'],
				 			['Terrestre', 'Psiquico']),
				 new Tipo('Normal',
				 			[],
				 			['Lutador']),
				 new Tipo('Psiquico',
				 			['Lutador', 'Venenoso'],
				 			['Inseto', 'Sombrio', 'Fantasma']),
				 new Tipo('Agua',
				 			['Fogo', 'Terrestre', 'Pedra'],
				 			['Eletrico', 'Planta']),
				 new Tipo('Gelo',
				 			['Voador', 'Dragao', 'Terrestre', 'Planta'],
				 			['Aco', 'Fogo', 'Lutador', 'Pedra']),
				 new Tipo('Eletrico',
				 			['Agua', 'Voador'],
				 			['Terrestre']),
				 new Tipo('Aco',
				 			['Fada', 'Gelo', 'Pedra'],
				 			['Fogo', 'Terrestre', 'Lutador']),
				 new Tipo('Pedra',
				 			['Fogo', 'Gelo', 'Inseto', 'Voador'],
				 			['Aco', 'Agua', 'Lutador', 'Planta', 'Terrestre']),
				 new Tipo('Sombrio',
				 			['Fantasma', 'Psiquico'],
				 			['Fada', 'Inseto', 'Lutador']),
				 new Tipo('Terrestre',
				 			['Eletrico', 'Fogo', 'Venenoso', 'Pedra', 'Aco'],
				 			['Planta', 'Gelo', 'Agua'])

	]
	var confusaoInimiga=false


	function getTipo(nome){
		for(var i = 0; i < tipos.length; i++){
			if(tipos[i].nome == nome){
				return tipos[i]
			}
		}
	}


	function gerarHabilidade(nome){
		if(nome=='Cura de poeira'){
			return new Habilidade(nome, 2, 'Cura', 2, 'Vida', 'Normal', 2);
		}else if (nome=='Arranhar'){
			return new Habilidade(nome, 5, 'Dano', 4, 'Ataque', 'Normal', 4);
		}else if(nome=='Confusao'){
			return new Habilidade(nome, 3, 'Stun', 1, 'Counter', 'Normal', 3)
		}else if(nome=='Golpe de vinhas'){
			return new Habilidade(nome, 2, 'Dano', 2, 'Ataque', 'Planta', 2);
		}else if(nome=='Chamuscar'){
			return new Habilidade(nome, 6, 'Dano', 3, 'Ataque', 'Fogo', 3);
		}else if(nome=='Jato molhado'){
			return new Habilidade(nome, 4, 'Dano', 3, 'Ataque', 'Agua', 3);
		}else if(nome=='Charme'){
			return new Habilidade(nome, 3, 'Stun', 1, 'Counter', 'Fada', 3);
		}else if(nome=='Cura fria'){
			return new Habilidade(nome, 4, 'Cura', 5, 'Vida', 'Normal', 5);
		}else if(nome=='Veneno'){
			return new Habilidade(nome, 5, 'Dano', 3, 'Ataque', 'Venenoso', 3);
		}else if(nome=='Foco'){
			return new Habilidade(nome, 0, 'Foco', 0, 'Precisao', 'Normal', 0);
		}else if(nome=='Espirito Vital'){
			return new Habilidade(nome, 0, 'Dano', 0, 'Ataque', 'Lutador', 0);
		}else if(nome=='Absorcao'){
			return new Habilidade(nome, 3, 'Cura', 5, 'Vida', 'Agua', 5);
		}else if(nome=='Esfolamento'){
			return new Habilidade(nome, 5, 'Dano', 3, 'Ataque', 'Fantasma', 3);
		}else if(nome=='Baforada'){
			return new Habilidade(nome, 7, 'Dano', 3, 'Ataque', 'Fantasma', 3);
		}else if(nome=='Pendular'){
			return new Habilidade(nome, 6, 'Dano', 5, 'Ataque', 'Fantasma', 5);
		}else if(nome=='Choque'){
			return new Habilidade(nome, 5, 'Dano', 5, 'Ataque', 'Eletrico', 5);
		}else if(nome=='Picada'){
			return new Habilidade(nome, 6, 'Dano', 4, 'Ataque', 'Inseto', 4);
		}else if(nome=='Bicada'){
			return new Habilidade(nome, 5, 'Dano', 5, 'Ataque', 'Voador', 5);
		}else if(nome=='Mordida'){
			return new Habilidade(nome, 3, 'Dano', 6, 'Ataque', 'Todos', 6);
		}else if(nome=='Escudo de pedra'){
			return new Habilidade(nome, 4, 'Cura', 5, 'Vida', 'Pedra', 5);
		}else if(nome=='Cabecada'){
			return new Habilidade(nome, 2, 'Dano', 8, 'Ataque', 'Todos', 8);
		}else if(nome=='Fotossintese'){
			return new Habilidade(nome, 3, 'Cura', 3, 'Vida', 'Planta', 3);
		}else if(nome=='Congelar'){
			return new Habilidade(nome, 4, 'Stun', 1, 'Counter', 'Gelo', 4);
		}else if(nome=='Pedrada'){
			return new Habilidade(nome, 5, 'Dano', 4, 'Ataque', 'Pedra', 4);
		}else if(nome=='Terremoto'){
			return new Habilidade(nome, 3, 'Dano', 5, 'Ataque', 'Terrestre', 5);
		}else if(nome=='Hipnose'){
			return new Habilidade(nome, 6, 'Stun', 1, 'Counter', 'Psiquico', 1);
		}else if(nome=='Vitalidade eletrica'){
			return new Habilidade(nome, 1.75, 'Cura', 1, 'Vida', 'Eletrico', 3);
		}else if(nome=='Eletrocutar'){
			return new Habilidade(nome, 5, 'Dano', 4, 'Ataque', 'Eletrico', 4);
		}else if(nome=='Nuvem de veneno'){
			return new Habilidade(nome, 2, 'Dano', 8, 'Ataque', 'Venenoso', 8);
		}else if(nome=='Cura magica'){
			return new Habilidade(nome, 3, 'Cura', 2, 'Vida', 'Fada', 4);
		}else if(nome=='Chute'){
			return new Habilidade(nome, 6, 'Dano', 1, 'Ataque', 'Lutador', 1);
		}else if(nome=='Auto hipnose'){
			return new Habilidade(nome, 4, 'Cura', 2, 'Vida', 'Fada', 5);
		}else if(nome=='Poça de veneno'){
			return new Habilidade(nome, 4, 'Dano', 2, 'Ataque', 'Venenoso', 3);
		}else if(nome=='Barreira de terra'){
			return new Habilidade(nome, 3, 'Cura', 2, 'Vida', 'Terrestre', 3);
		}else if(nome=='Dilacerar'){
			return new Habilidade(nome, 6, 'Dano', 1, 'Ataque', 'Inseto', 1);
		}else if(nome=='Pancada'){
			return new Habilidade(nome, 3, 'Stun', 1, 'Counter', 'Normal', 3);
		}else if(nome=='Cura Piromaniaca'){
			return new Habilidade(nome, 2, 'Cura', 2, 'Counter', 'Normal', 2);
		}

	}

	function uparPlayer(){
		if(xpPlayer>=lvlUpReqPlayer){
			nivelPlayer+=1;
			lvlUpReqPlayer=parseFloat((lvlUpReqPlayer*1.4).toFixed(1));
			xpPlayer=0;
			$('#lvlUpPlayer').text('Você agora está no nivel '+nivelPlayer).fadeIn(1500).fadeOut(1500);
		}
	}

	function rollItem(pokebola, cura, nada, reviver, biscoito) {
		var values = [pokebola, cura, nada, reviver, biscoito]
		var nomes = ['Pokebola', 'Cura', 'Nada', 'Reviver', 'Biscoito']
		var aux = 0
		var status = true
		for(var j=0; j<values.length-1 ;j++){
			for(var i=0; i<values.length-1 ;i++){
				if(values[i]>values[i+1]){
					aux=values[i]
					values[i]=values[i+1]
					values[i+1]=aux;

					aux=nomes[i]
					nomes[i]=nomes[i+1]
					nomes[i+1]=aux;
				}
			}
		}
		var randomize = random();
		var qtd = 1;

		if(randomize<=10){
			qtd=3
		} else if(randomize<=25){
			qtd=2
		}

		randomize = random();

		if(randomize<=values[0]){
			adcionarItem(nomes[0], qtd);
		}else if(randomize<=values[1]){
			adcionarItem(nomes[1], qtd);
		}else if(randomize<=values[2]){
			adcionarItem(nomes[2], qtd);
		}else if(randomize<=values[3]){
			adcionarItem(nomes[3], qtd);
		}else if(randomize<=values[4]){
			adcionarItem(nomes[4], qtd);
		}
	}
	function getItem(nome){
		var item = null;
		if(nome=='Cura'){
			item = itens[0];
		}else if(nome=='Biscoito'){
			item = itens[1];
		}else if(nome=='Reviver'){
			item = itens[2];
		}else if(nome=='Pokebola'){
			item = itens[3];
		}
		return item;
	}

	function curar(pokemon){
		var qtdPocao = getItem('Cura').quantidade;
		if(pokemon.vidaAtual==pokemon.vida){
			$('#value').text(pokemon.nome + ' está com a saude completa');
			return null;
		}
		if(pokemon.vidaAtual==0){
			$('#value').text('Você não pode curar um pokemon derrotado');
			return null;
		}

		if(qtdPocao>0){
			adcionarItem('Cura', -1)
			var randomize = random();
			var cura = 0;
			if(randomize<=5){
				cura = parseFloat((pokemon.vida-pokemon.vidaAtual).toFixed(1));
			}else if(randomize<=20){
				cura = parseFloat((pokemon.vida/3).toFixed(1));
			}else {
				cura = parseFloat((pokemon.vida/2).toFixed(1));
			}
			var x = cura+pokemon.vidaAtual
			pokemon.vidaAtual+=cura;
			
			if((x)>pokemon.vida){
				cura = parseFloat((cura-(x-pokemon.vida)).toFixed(1));
			}
			if(pokemon.vidaAtual>=pokemon.vida){
				pokemon.vidaAtual=pokemon.vida;
			}
			$('#curaNoPoke').text('+' + cura)
							.fadeIn(500).delay(250)
							.fadeOut(500)
			geral();
		}else{
			$('#value').text('Você não tem poções de cura')
		}
	}

	function reviver(pokemon){
		if(pokemon.vidaAtual>0){
			$('#value').text('Seu pokemon não está morto para revive-lo')
		} else if(getItem('Reviver').quantidade<1){
			$('#value').text('Você não tem poções de reviver')
		} else {
			seuPokemon.vidaAtual=parseFloat((seuPokemon.vida).toFixed(1));
			adicionarPokemon(seuPokemon);
			adcionarItem('Reviver', -1)
		}
		geral();
	}

	function potUpPoke(pokemon){
		if(getItem('Biscoito').quantidade<1){
			$('#value').text('Você não tem biscoitos nivel')
		}else if(pokemon.vidaAtual==0){
			$('#value').text('Você não pode upar um pokemon derrotado')
		}else{
			adcionarItem('Biscoito', -1)
			pokemon.experiencia=pokemon.lvlUpReq
			upar(pokemon);
		}
		geral();
	}

	$(document).on('click', '#Cura', function(){
		curar(seuPokemon);
	});
	$(document).on('click', '#Reviver', function(){
		reviver(seuPokemon);
	});
	$(document).on('click', '#UparPokemon', function(){
		potUpPoke(seuPokemon);
	});

	$(document).on('click', '.excluir', function(){
		excluir($(this).val());
	});

	function excluir(numero){
		if(pokemons.length>1){
			$('#value').text('Você liberou ' + pokemons[numero].nome + ' para a natureza');
			if(numero==0){
				if(pokemons[numero]==seuPokemon){
					seuPokemon=pokemons[1];
				}
			}else{
				seuPokemon=pokemons[0];
			}
			pokemons.splice(numero, 1);		
		}else{
			$('#value').text('Você precisa ter mais de 1 pokemon para libera-los');
		}
		geral();
	}

	function adcionarItem(nome, quantidade){
		if(nome!='Nada'){
			var item = getItem(nome);
			item.quantidade += quantidade;
			if(quantidade>0){
				$('#bonusItem').text('Você encontrou ' + quantidade + ' ' + getItem(nome).nome).fadeIn(300).fadeOut(1200)
			}
		}else{
			$('#value').text('Você não encontrou nada');
		}
		geral();
	}
	
	$('#Charmander').click(function(){
		pokemon = new Pokemon(1, 2, 37, 37, 1.2, 2, 'Charmander', 0, 10, 'Charmander.png', 'CharmanderDr.png', 55, 'Fogo', gerarHabilidade('Chamuscar'));
		adicionarPokemon(pokemon);
		seuPokemon = pokemons[0];
		$('#value').text('Você escolheu o Pokemon '+ pokemon.nome + ' boa escolha!');
		geral();
	});
	$('#Bulbassauro').click(function(){
		pokemon = new Pokemon(1, 1.4, 40, 40, 0.8, 3.2, 'Bulbassauro', 0, 10, 'Bulbassauro.png', 'BulbassauroDr.png', 55, 'Planta', gerarHabilidade('Golpe de vinhas'));
		adicionarPokemon(pokemon);
		seuPokemon = pokemons[0];
		$('#value').text('Você escolheu o Pokemon '+ pokemon.nome + ' boa escolha!');
		geral();
	});
	$('#Squirtle').click(function(){
		pokemon = new Pokemon(1, 1.8, 38, 38, 1, 2.6, 'Squirtle', 0, 10, 'Squirtle.png', 'SquirtleDr.png', 55, 'Agua', gerarHabilidade('Jato molhado'));
		adicionarPokemon(pokemon);
		seuPokemon = pokemons[0];
		$('#value').text('Você escolheu o Pokemon '+ pokemon.nome + ' boa escolha!');
		geral();
	});
	$('#habilidade').click(function(){
		if(seuPokemon.habilidades.quantidade>0){
			seuPokemon.habilidades.quantidade-=1;
			var funcao = $(this).val()
			var multiplo = seuPokemon.habilidades.multiplo

			if(funcao=='Dano'){
				habilidadeDano(seuPokemon, multiplo);
			}else if(funcao=='Cura'){
				habilidadeCura(seuPokemon, multiplo);
			}else if(funcao=='Stun'){
				habilidadeStun(seuPokemon, multiplo)
			}

			geral();
		}else{
			$('#value').text('Seu pokemon está sem a habilidade')
		}
		if(pokemonAtivo!=null){
			$('#vida').text('Vida: ' + pokemonAtivo.vidaAtual.toFixed(1) + '/' + pokemonAtivo.vida.toFixed(1));
		}
		$('#vidaSeuPokemon').show().text('Vida '+seuPokemon.vidaAtual.toFixed(1) +'/'+seuPokemon.vida.toFixed(1));
	});

	function habilidadeStun(pokemon, multiplo){
		confusaoInimiga=true
		var m = pokemon.ataque * parseFloat(String(1)+'.'+String(multiplo))
		atacar(m, pokemonAtivo)
		geral()
	}

	function habilidadeCura(pokemon, multiplo){
		if(pokemon.vidaAtual==pokemon.vida){
			$('#value').text(pokemon.nome + ' está com a saude completa');
			seuPokemon.habilidades.quantidade+=1;
			return null;
		}
		if(pokemon.vidaAtual==0){
			$('#value').text('Você não pode curar um pokemon derrotado');
			seuPokemon.habilidades.quantidade+=1;
			return null;
		}

		var cura = parseFloat((pokemon.vida/multiplo).toFixed(1))

		var x = cura+pokemon.vidaAtual
			pokemon.vidaAtual+=cura;
			
			if((x)>pokemon.vida){
				cura = parseFloat((cura-(x-pokemon.vida)).toFixed(1));
			}
			if(pokemon.vidaAtual>=pokemon.vida){
				pokemon.vidaAtual=pokemon.vida;
			}
			$('#curaNoPoke').text('+' + cura)
							.fadeIn(500).delay(250)
							.fadeOut(500)
			geral();

	}

	function habilidadeDano(pokemon, multiplo){
		var m = pokemon.ataque * parseFloat(String(1)+'.'+String(multiplo))
		atacar(m, pokemonAtivo)

	}
	
	function adicionarPokemon(pokemon){
		pokemons.push(pokemon);
		atualizarListaPoke();
	}

	function atualizarListaPoke(){
		$('#inventario').remove();
		var a = $('<div> </div>');
		a.attr('id', 'inventario')
		$('#inv').append(a)
		$('.selecionar').remove();
		$('.caixinha').remove();

		var btn1 = $('<button> Pokemons </button>')
		var btn2 = $('<button> Itens </button>')
		var btn3 = $('<button> Info </button>')
		var div = $('<div> </div>')

		btn1.attr('id', 'mostrarPokes').attr('class', 'btnInventario')
		btn2.attr('id', 'mostrarItens').attr('class', 'btnInventario')
		btn3.attr('id', 'mostrarInfo').attr('class', 'btnInventario')

		div.attr('class', 'invBtn')

		$('#inventario').append(div);
		$('.invBtn').append(btn1);
		$('.invBtn').append(btn2);
		$('.invBtn').append(btn3);

		for(var i = 0; i < pokemons.length; i++){
			var e = $('<button> Selecionar </button>')
			var excluir = $('<button> X </button>')
			var o = $('<div> </div>')
			var imgdiv = $('<div> </div>')
			var img = $('<img> </img>')
			var nome = $('<p>'+pokemons[i].nome+'</p>')
			var tipo = $('<p> Tipo: '+pokemons[i].tipo.nome+'</p>')
			var nivel = $('<p> Nivel: '+pokemons[i].nivel+'</p>')
			var vida = $('<p> Vida: '+pokemons[i].vidaAtual.toFixed(1)+'/'+pokemons[i].vida.toFixed(1) +'</p>')
			var id = 'pokemonFromList'+i
			var att = '#'+id;
			$(att).remove();
			o.attr('id', id)
			o.attr('class', 'caixinha poke')
			var imgid = 'poop'+i
			imgdiv.attr('id', (imgid)).attr('class', 'pokedexImg')
			var idimg = '#'+imgid
			img.attr('src',('imgs/'+pokemons[i].img))
			if(i==pokemons.indexOf(seuPokemon))	{
				e = $('<button> Ativo </button>')
				e.attr('class', 'selecionar ativo')
			}else{
				e.attr('class', 'selecionar')
			}
			
			e.attr('value', i)
			excluir.attr('value', i).addClass('excluir');
			console.log(imgid)
			console.log(idimg)
			console.log(img)
			$('#inventario').append(o);
			$(att).append(imgdiv)
			$(idimg).append(img)
			$(att).append(nome).append(tipo).append(nivel).append(vida)
			$(att).append(e);
			$(att).append(excluir);
		}
		$('.itens').remove();
		$('.usarBtn').remove();
		$('.nomeItem').remove();
		$('.qtdItem').remove();
		$('.imgItem').remove();
		for(var i = 0; i < itens.length; i++){
			if(itens[i].quantidade>0){
				var k = $('<div> </div>')
				var a = $('<p> ' + itens[i].nome + ' </p>')
				var b = $('<p> Quantidade: ' + itens[i].quantidade + ' </p>')
				var c = $('<img> </img>')

				var id = 'itemFromList'+i
				c.attr('src', itens[i].img)	
				k.attr('class', 'caixinha itens').attr('id', id)
				id = '#'+id;
				a.attr('class', 'nomeItem')
				b.attr('class', 'qtdItem')
				c.attr('class', 'imgItem')
				$('#inventario').append(k);
				if(itens[i].nome != 'Pokebola'){
					var e = $('<button> Usar </button>')
					e.attr('class', 'usarBtn')
					e.attr('id', itens[i].funcao)
					$(id).append(e)
				}
				$(id).append(a).append(b).append(c);
			}
		}
		var infoContainer = $('<div> </div>')
		infoContainer.attr('class', 'info')
		var divInfo1 = $('<div> </div>')
		divInfo1.attr('class', 'divInfo vantagens vntgSeuPoke')
		var divInfo2 = $('<div> </div>')
		divInfo2.attr('class', 'divInfo desvantagens desvSeuPoke')
		var nomepokemon = $('<p> </p>')
		nomepokemon.attr('class', 'nomeSeuPokeInfo')

		$('#inventario').append(infoContainer)
		$('.info').append(nomepokemon).append(divInfo1).append(divInfo2)

		if(pokemonAtivo!=null){
			infoContainer = $('<div> </div>')
			infoContainer.attr('class', 'info')
			divInfo1 = $('<div> </div>')
			divInfo1.attr('class', 'divInfo vantagens vntgOutroPoke')
			divInfo2 = $('<div> </div>')
			divInfo2.attr('class', 'divInfo desvantagens desvOutroPoke')
			nomepokemon = $('<p> </p>')
			nomepokemon.attr('class', 'nomeOutroPokeInfo')
			$('.info').append(nomepokemon).append(divInfo1).append(divInfo2)
		}else{
			$('#nomeOutroPokeInfo').remove()
			$('#desvOutroPoke').remove()
			$('#vntgOutroPoke').remove()
		}

		
	}

	function upar(pokemon){
		if(seuPokemon.experiencia>=seuPokemon.lvlUpReq){
			pokemon.nivel=pokemon.nivel+1;
			pokemon.ataque=parseFloat((pokemon.ataque+pokemon.escalaAtk/2).toFixed(1));
			pokemon.vida=parseFloat((pokemon.vida+pokemon.escalaVida).toFixed(1));
			pokemon.vidaAtual=pokemon.vida;
			pokemon.experiencia=0;
			pokemon.lvlUpReq=calcularXpReq(pokemon.nivel, 1.25);
			$('#lvlUpPoke').text(pokemon.nome + ' agora está no nivel '+pokemon.nivel).fadeIn(1500).fadeOut(1500);
		}
	}

	function calcularXpReq(nivel, incremento){
		var xp=10
		if(nivel > 1){
			for (var i = 1; i<nivel; i++){
				xp=parseFloat((xp*1.25).toFixed(1))
			}
		}
		return xp
	}
	
	function random(){
		let rand = Math.random() * 100;
		return Math.round(rand);
	}

	function gerarPokemon(NivelDoPlayer){
		var randomize = random();
		var pokemon = null;
		var nivel = 0;
		var acrescimoRaridade = 0
		if(randomize<=10){
			nivel=NivelDoPlayer+2
			acrescimoRaridade = -10
		}else if(randomize<=20){
			nivel=NivelDoPlayer+1
			acrescimoRaridade = -5
		} else if(randomize<=80){
			nivel=NivelDoPlayer
		}else if(randomize<=90){
			nivel=NivelDoPlayer-1
			acrescimoRaridade = +3
			if(nivel<=0){
				nivel=1
				acrescimoRaridade = 0
			}
		}else {
			nivel=NivelDoPlayer-2
			acrescimoRaridade = +4
			if(nivel<=0){
				nivel=1
				acrescimoRaridade = 0
			}
		}

		randomize = random() + acrescimoRaridade


		var ataque
		var divisorEscalaDif = 4
		var vida
		var vidaMaxima
		var escalaAtk
		var escalaVida
		var raridade
		var nome 
		var xpAtual 
		var lvlUpReq 
		var img 
		var imgDr
		var raridade
		var tipo
		var habilidades
		var escalaAtkDif = 0.2
		var escalaVidaDif = 0.5
		var raridadeDif = 4
		if(randomize<=50){
			randomize = random()
			if(randomize<=5){
				randomize = random()
				ataque = 1.5
				vida = 16
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 0.9;
				nome = 'Pidgey'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Voador'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Confusao')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=10){
				randomize = random()
				ataque = 1
				vida = 20
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 2;
				nome = 'Caterpie'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Inseto'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Cura de poeira')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=15){
				randomize = random()
				ataque = 0.7
				vida = 15
				vidaAtual = vida
				escalaAtk = 0.3;
				escalaVida = 0.6;
				nome = 'Magikarp'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 8
				tipo = 'Agua'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Jato molhado')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=20){
				randomize = random()
				ataque = 1.4
				vida = 20
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 1.4;
				nome = 'Nidoran'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 15
				tipo = 'Venenoso'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Veneno')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=25){
				randomize = random()
				ataque = 1
				vida = 22
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 0.8;
				nome = 'Zubat'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 10
				tipo = 'Venenoso'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Foco')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=30){
				randomize = random()
				ataque = 1.6
				vida = 18
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 0.8;
				nome = 'Rattata'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 15
				tipo = 'Normal'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Arranhar')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=35){
				randomize = random()
				ataque = 1.4
				vida = 20
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 1.2;
				nome = 'Magnemite'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 15
				tipo = 'Eletrico'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Choque')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=40){
				randomize = random()
				ataque = 1.5
				vida = 18
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 1.3;
				nome = 'Butterfree'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 15
				tipo = 'Inseto'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Picada')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=45){
				randomize = random()
				ataque = 1.2
				vida = 21
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 1.5;
				nome = 'Paras'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 15
				tipo = 'Inseto'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Cura de poeira')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=50){
				randomize = random()
				ataque = 1.3
				vida = 19
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 1.2;
				nome = 'Spearow'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Voador'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Bicada')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=55){
				randomize = random()
				ataque = 1.1
				vida = 17
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 1.3;
				nome = 'Weedle'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Inseto'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Picada')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=60){
				randomize = random()
				ataque = 1.4
				vida = 20
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 1.5;
				nome = 'Venonat'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Inseto'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Mordida')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=65){
				randomize = random()
				ataque = 1.3
				vida = 22
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 1.7;
				nome = 'Omanyte'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Pedra'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Escudo de pedra')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=70){
				randomize = random()
				ataque = 1.2
				vida = 17
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 1;
				nome = 'Kabuto'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 8
				tipo = 'Pedra'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Mordida')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=75){
				randomize = random()
				ataque = 1.2
				vida = 21
				vidaAtual = vida
				escalaAtk = 0.3;
				escalaVida = 1.5;
				nome = 'Oddish'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 8
				tipo = 'Planta'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Mordida')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=80){
				randomize = random()
				ataque = 1.5
				vida = 21
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 1.7;
				nome = 'Meowth'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 14
				tipo = 'Normal'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Arranhar')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=90){
				randomize = random()
				ataque = 1
				vida = 23
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 1.6;
				nome = 'Diglett'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 12
				tipo = 'Terrestre'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Cabecada')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else{
				randomize = random()
				ataque = 1.2
				vida = 19
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 1.5;
				nome = 'Bellsprout'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 10
				tipo = 'Planta'
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				habilidades = gerarHabilidade('Fotossintese')
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}
		}else if(randomize<75){
			randomize = random()
			if(randomize<=6){
				randomize = random()
				ataque = 1.5
				vida = 23
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 1.4;
				nome = 'Clefairy'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 20
				tipo = 'Fada'
				habilidades = gerarHabilidade('Charme')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=12){
				randomize = random()
				ataque = 2
				vida = 20
				vidaAtual = vida
				escalaAtk = 1;
				escalaVida = 0.9;
				nome = 'Ekans'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Venenoso'
				habilidades = gerarHabilidade('Veneno')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=18){
				randomize = random()
				ataque = 1.7
				vida = 24
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 1.2;
				nome = 'Jigglypuff'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 20
				tipo = 'Fada'
				habilidades = gerarHabilidade('Charme')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=24){
				randomize = random()
				ataque = 1.3
				vida = 27
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 1.8;
				nome = 'Poliwag'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 20
				tipo = 'Agua'
				habilidades = gerarHabilidade('Absorcao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=30){
				randomize = random()
				ataque = 1.2
				vida = 26
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 2.2;
				nome = 'Tentacool'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 20
				tipo = 'Agua'
				habilidades = gerarHabilidade('Jato molhado')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=36){
				randomize = random()
				ataque = 1.5
				vida = 23
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 1.8;
				nome = 'Exeggcute'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 20
				tipo = 'Planta'
				habilidades = gerarHabilidade('Cabecada')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=42){
				randomize = random()
				ataque = 1.4
				vida = 26
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 2.2;
				nome = 'Sandshrew'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Gelo'
				habilidades = gerarHabilidade('Congelar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=48){
				randomize = random()
				ataque = 1.5
				vida = 24
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 1.6;
				nome = 'Jynx'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Gelo'
				habilidades = gerarHabilidade('Congelar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=54){
				randomize = random()
				ataque = 1.3
				vida = 21
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 1.6;
				nome = 'Tangela'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 18
				tipo = 'Planta'
				habilidades = gerarHabilidade('Golpe de vinhas')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=60){
				randomize = random()
				ataque = 1.5
				vida = 20
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 1.7;
				nome = 'Doduo'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Normal'
				habilidades = gerarHabilidade('Bicada')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=66){
				randomize = random()
				ataque = 1.3
				vida = 27
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 2.4;
				nome = 'Staryu'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Agua'
				habilidades = gerarHabilidade('Absorcao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=72){
				randomize = random()
				ataque = 1.6
				vida = 25
				vidaAtual = vida
				escalaAtk = 0.2;
				escalaVida = 3;
				nome = 'Shellder'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Agua'
				habilidades = gerarHabilidade('Absorcao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=78){
				randomize = random()
				ataque = 1.6
				vida = 25
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 1.7;
				nome = 'Seel'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 22
				tipo = 'Agua'
				habilidades = gerarHabilidade('Jato molhado')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=84){
				randomize = random()
				ataque = 1.6
				vida = 26
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 2;
				nome = 'Geodude'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 24
				tipo = 'Pedra'
				habilidades = gerarHabilidade('Pedrada')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=90){
				randomize = random()
				ataque = 1.7
				vida = 21
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 1.2;
				nome = 'Machop'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 24
				tipo = 'Lutador'
				habilidades = gerarHabilidade('Espirito Vital')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=96){
				randomize = random()
				ataque = 1.6
				vida = 24
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 2;
				nome = 'Cubone'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 24
				tipo = 'Terrestre'
				habilidades = gerarHabilidade('Terremoto')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else{
				randomize = random()
				ataque = 1.6
				vida = 25
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 1.7;
				nome = 'Abra'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 24
				tipo = 'Psiquico'
				habilidades = gerarHabilidade('Hipnose')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}
		}else if(randomize<=92){
			randomize = random()
			if(randomize<=6){
				randomize = random()
				ataque = 2
				vida = 26
				vidaAtual = vida
				escalaAtk = 1;
				escalaVida = 1.5;
				nome = 'Gastly'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Fantasma'
				habilidades = gerarHabilidade('Esfolamento')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=12){
				randomize = random()
				ataque = 1.5
				vida = 30
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 1.8;
				nome = 'Horsea'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 30
				tipo = 'Agua'
				habilidades = gerarHabilidade('Jato molhado')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=18){
				randomize = random()
				ataque = 1.4
				vida = 32
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 2;
				nome = 'Krabby'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 29
				tipo = 'Agua'
				habilidades = gerarHabilidade('Absorcao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=24){
				randomize = random()
				ataque = 1.7
				vida = 27
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 1.8;
				nome = 'Mankey'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 32
				tipo = 'Lutador'
				habilidades = gerarHabilidade('Espirito Vital')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=30){
				randomize = random()
				ataque = 1.2
				vida = 34
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 2.8;
				nome = 'Psyduck'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Agua'
				habilidades = gerarHabilidade('Absorcao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=37){
				randomize = random()
				ataque = 2
				vida = 32
				vidaAtual = vida
				escalaAtk = 1;
				escalaVida = 1.9;
				nome = 'Goldeen'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Agua'
				habilidades = gerarHabilidade('Jato molhado')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=44){
				randomize = random()
				ataque = 1.7
				vida = 30
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 2.5;
				nome = 'Electrabuzz'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Eletrico'
				habilidades = gerarHabilidade('Vitalidade eletrica')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=51){
				randomize = random()
				ataque = 1.8
				vida = 29
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 2;
				nome = 'Voltorb'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Eletrico'
				habilidades = gerarHabilidade('Eletrocutar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=59){
				randomize = random()
				ataque = 1.6
				vida = 33
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 2.2;
				nome = 'Koffing'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Venenoso'
				habilidades = gerarHabilidade('Nuvem de veneno')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=65){
				randomize = random()
				ataque = 1.5
				vida = 36
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 2.9;
				nome = 'Chansey'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Fada'
				habilidades = gerarHabilidade('Cura magica')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=71){
				randomize = random()
				ataque = 1.4
				vida = 35
				vidaAtual = vida
				escalaAtk = 0.6;
				escalaVida = 3;
				nome = 'Slowpoke'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Agua'
				habilidades = gerarHabilidade('Absorcao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=78){
				randomize = random()
				ataque = 1.9
				vida = 28
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 2.3;
				nome = 'Hitmonlee'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Lutador'
				habilidades = gerarHabilidade('Chute')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=85){
				randomize = random()
				ataque = 1.6
				vida = 30
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 2.4;
				nome = 'Drowzee'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Psiquico'
				habilidades = gerarHabilidade('Auto hipnose')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=93){
				randomize = random()
				ataque = 1.5
				vida = 29
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 2;
				nome = 'Grimer'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Venenoso'
				habilidades = gerarHabilidade('Poça de veneno')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else{
				randomize = random()
				ataque = 1.8
				vida = 27
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 1.9;
				nome = 'Aerodactyl'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 33
				tipo = 'Voador'
				habilidades = gerarHabilidade('Confusao')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}
		}else if(randomize<=98){
			randomize = random();
			if(randomize<=9){
				randomize = random()
				ataque = 1.4
				vida = 40
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 3.2;
				nome = 'Bulbassauro'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 55
				tipo = 'Planta'
				habilidades = gerarHabilidade('Golpe de vinhas')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=18){
				randomize = random()
				ataque = 2
				vida = 37
				vidaAtual = vida
				escalaAtk = 1.2;
				escalaVida = 2;
				nome = 'Charmander'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 55
				tipo = 'Fogo'
				habilidades = gerarHabilidade('Chamuscar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=26){
				randomize = random()
				ataque = 1.7
				vida = 34
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 1.8;
				nome = 'Eevee'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Normal'
				habilidades = gerarHabilidade('Arranhar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=33){
				randomize = random()
				ataque = 1
				vida = 45
				vidaAtual = vida
				escalaAtk = 0.5;
				escalaVida = 4.2;
				nome = 'Pinsir'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 55
				tipo = 'Inseto'
				habilidades = gerarHabilidade('Cura de poeira')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=41){
				randomize = random()
				ataque = 1.8
				vida = 38
				vidaAtual = vida
				escalaAtk = 1.1;
				escalaVida = 2.4;
				nome = 'Ponyta'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 52
				tipo = 'Fogo'
				habilidades = gerarHabilidade('Chamuscar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=48){
				randomize = random()
				ataque = 1.8
				vida = 38
				vidaAtual = vida
				escalaAtk = 1;
				escalaVida = 2.6;
				nome = 'Squirtle'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Agua'
				habilidades = gerarHabilidade('Jato molhado')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=56){
				randomize = random()
				ataque = 1
				vida = 50
				vidaAtual = vida
				escalaAtk = 0.4;
				escalaVida = 4.5;
				nome = 'Rhyhorn'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Terrestre'
				habilidades = gerarHabilidade('Barreira de terra')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=63){
				randomize = random()
				ataque = 2.3
				vida = 36
				vidaAtual = vida
				escalaAtk = 1.3;
				escalaVida = 1.8;
				nome = 'Scyther'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Inseto'
				habilidades = gerarHabilidade('Dilacerar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=73){
				randomize = random()
				ataque = 1.9
				vida = 40
				vidaAtual = vida
				escalaAtk = 0.9;
				escalaVida = 3;
				nome = 'Vulpix'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Fogo'
				habilidades = gerarHabilidade('Chamuscar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=83){
				randomize = random()
				ataque = 1.4
				vida = 46
				vidaAtual = vida
				escalaAtk = 0.7;
				escalaVida = 3.6;
				nome = 'Snorlax'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Normal'
				habilidades = gerarHabilidade('Pancada')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else if(randomize<=92){
				randomize = random()
				ataque = 2
				vida = 38
				vidaAtual = vida
				escalaAtk = 1.3;
				escalaVida = 1.8;
				nome = 'Pikachu'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Eletrico'
				habilidades = gerarHabilidade('Eletrocutar')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else {
				randomize = random()
				ataque = 1.9
				vida = 40
				vidaAtual = vida
				escalaAtk = 0.8;
				escalaVida = 3.3;
				nome = 'Growlithe'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 50
				tipo = 'Fogo'
				habilidades = gerarHabilidade('Cura Piromaniaca')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}
		}else {
			randomize = random()
			if(randomize<=50){
				randomize = random()
				ataque = 2.8
				vida = 45
				vidaAtual = vida
				escalaAtk = 1.4;
				escalaVida = 2.4;
				nome = 'Mew'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 85
				tipo = 'Psiquico'
				habilidades = gerarHabilidade('Pendular')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}else{
				randomize = random()
				ataque = 2.3
				vida = 53
				vidaAtual = vida
				escalaAtk = 1;
				escalaVida = 3.6;
				nome = 'Dratini'
				xpAtual = 0
				lvlUpReq = 10
				img = nome+'.png'
				imgDr = nome+'Dr.png'
				raridade = 80
				tipo = 'Dragao'
				habilidades = gerarHabilidade('Baforada')
				escalaAtkDif = escalaAtk/divisorEscalaDif
				escalaVidaDif = escalaVida/2
				if(randomize<13){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*2), escalaVida-(escalaVidaDif*2), nome+'--', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*2), tipo, habilidades);
				}else if(randomize<25){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk-(escalaAtkDif*1), escalaVida-(escalaVidaDif*1), nome+'-', xpAtual, lvlUpReq, img, imgDr, raridade-(raridadeDif*1), tipo, habilidades);			
				}else if(randomize<80){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk, escalaVida, nome, xpAtual, lvlUpReq, img, imgDr, raridade, tipo, habilidades);
				}else if(randomize<95){
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*1), escalaVida+(escalaVidaDif*1), nome+'+', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*1), tipo, habilidades);
				}else {
					pokemon = new Pokemon(nivel, ataque, vida, vidaAtual, escalaAtk+(escalaAtkDif*2), escalaVida+(escalaVidaDif*2), nome+'++', xpAtual, lvlUpReq, img, imgDr, raridade+(raridadeDif*2), tipo, habilidades);
				}
			}
		}			

		return pokemon;
	}
	
	function geral(){
		if( $('#value2').text() == "Luta"){
			$('button').hide();
			$('#habilidade').show()
			$('#atacar').show();
			$('#fugir').show();
			$('#capturar').show();	
			$('#vida').show();
			$('#nome').show();
			$('#nivel').show();
			$('#vidaSeuPokemon').show().text('Vida '+seuPokemon.vidaAtual.toFixed(1)+'/'+seuPokemon.vida.toFixed(1));
			$('#nivelSeuPokemon').show().text('Nivel '+seuPokemon.nivel);
			$('#expSeuPokemon').show().text('Experiencia '+seuPokemon.experiencia+'/'+seuPokemon.lvlUpReq);
			$('#nomeSeuPokemon').show().text(seuPokemon.nome);	
			$('#seuPoke').show();
			$('.seuPoke').show();
			$('.outroPoke').show();
			$('#imgOutroPoke').show().attr('src', ('imgs/'+pokemonAtivo.img));

			var porcentagemVidaOutroPoke = (pokemonAtivo.vidaAtual/pokemonAtivo.vida)*100
			$('#habilidade').text(seuPokemon.habilidades.nome + '('+seuPokemon.habilidades.quantidade+'/'+seuPokemon.habilidades.maxQtd+')');
			$('#habilidade').attr('value', seuPokemon.habilidades.funcao)
			if(porcentagemVidaOutroPoke<33){
				$('#vida').addClass('vermelho')
				$('#vida').removeClass('amarelo')
				$('#vida').removeClass('verde')
			}else if(porcentagemVidaOutroPoke<66){
				$('#vida').removeClass('vermelho')
				$('#vida').addClass('amarelo')
				$('#vida').removeClass('verde')
			}else{
				$('#vida').removeClass('vermelho')
				$('#vida').removeClass('amarelo')
				$('#vida').addClass('verde')
			}

			/*	$('#ok').hide();
			$('#andar').hide();*/
		}else{	
			$('#habilidade').hide();
			$('.outroPoke').hide();
			$('button').hide();
			$('#andar').show();	
			$('#vida').hide();
			$('#nome').hide();
			$('#nivel').hide();
			$('#vidaSeuPokemon').show().text('Vida '+seuPokemon.vidaAtual.toFixed(1)+'/'+seuPokemon.vida.toFixed(1));
			$('#nivelSeuPokemon').show().text('Nivel '+seuPokemon.nivel);
			$('#expSeuPokemon').show().text('Experiencia '+seuPokemon.experiencia+'/'+seuPokemon.lvlUpReq);	
			$('#nomeSeuPokemon').show().text(seuPokemon.nome);
			$('#seuPoke').show();
			$('.seuPoke').show();
			$('#logInimigo').hide();
			$('#imgOutroPoke').hide();

			/*$('#atacar').hide();
			$('#fugir').hide();
			$('#capturar').hide();
			$('#ok').hide();*/
		}	
		$('#mostrarInfo').show()
		$('.excluir').show();
		var porcentagemVidaPoke = (seuPokemon.vidaAtual/seuPokemon.vida)*100
		if(porcentagemVidaPoke<33){
			$('#vidaSeuPokemon').addClass('vermelho')
			$('#vidaSeuPokemon').removeClass('amarelo')
			$('#vidaSeuPokemon').removeClass('verde')
		}else if(porcentagemVidaPoke<66){
			$('#vidaSeuPokemon').removeClass('vermelho')
			$('#vidaSeuPokemon').addClass('amarelo')
			$('#vidaSeuPokemon').removeClass('verde')
		}else{
			$('#vidaSeuPokemon').removeClass('vermelho')
			$('#vidaSeuPokemon').removeClass('amarelo')
			$('#vidaSeuPokemon').addClass('verde')
		}
		atualizarListaPoke();
		$('.vantagens').text('Vantagens: ').css('color', 'green')
		$('.desvantagens').text('Desvantagens').css('color', 'red')
		$('.poke').hide();
		$('.itens').hide();
		if(seuPokemon.vidaAtual==0){
			$('#imgSeuPoke').show().attr('src', ('imgs/'+seuPokemon.imgDr))
		}else{
			$('#imgSeuPoke').show().attr('src', ('imgs/'+seuPokemon.img))
		}
		$('.invBtn').show();
		$('.btnInventario').show();
		$('.selecionar').show();
		$('#nivelPlayer').show().text('Seu nivel: ' + nivelPlayer)
		$('#xpPlayer').show().text('Exp: '+xpPlayer + '/' + lvlUpReqPlayer)
		if(menu=='itens'){
			$('.poke').hide();
			$('.itens').show();
			$('.info').hide();
			$('#mostrarPokes').removeClass('ativo')
			$('#mostrarItens').attr('class', 'ativo')
			$('#mostrarInfo').removeClass('ativo')
		} else if(menu=='pokemon'){
			$('.info').hide();
			$('.itens').hide();
			$('.poke').show();
			$('#mostrarItens').removeClass('ativo')
			$('#mostrarPokes').attr('class', 'ativo')
			$('#mostrarInfo').removeClass('ativo')
		}else{
			$('.itens').hide();
			$('.poke').hide();
			$('.info').show();
			$('#mostrarItens').removeClass('ativo')
			$('#mostrarPokes').removeClass('ativo')
			$('#mostrarInfo').attr('class', 'ativo')
			$('.nomeSeuPokeInfo').text(seuPokemon.nome + ' : '+seuPokemon.tipo.nome)
			for (var i = 0; i<seuPokemon.tipo.vantagens.length; i++){
				var van = $('<p> </p')
				var id = 'van'+i
				van.attr('id', id)
				id='#'+id
				$('.vntgSeuPoke').append(van)
				$(id).text(seuPokemon.tipo.vantagens[i])
			}
			for (var i = 0; i<seuPokemon.tipo.desvantagens.length; i++){
				var van = $('<p> </p')
				var id = 'des'+i
				van.attr('id', id)
				id='#'+id
				$('.desvSeuPoke').append(van)
				$(id).text(seuPokemon.tipo.desvantagens[i])
			}

			if(pokemonAtivo!=null){
				$('.nomeOutroPokeInfo').text(pokemonAtivo.nome + ' : '+pokemonAtivo.tipo.nome)
				for (var i = 0; i<pokemonAtivo.tipo.vantagens.length; i++){
					var van = $('<p> </p')
					var id = 'vanOutro'+i
					van.attr('id', id)
					id='#'+id
					$('.vntgOutroPoke').append(van)
					$(id).text(pokemonAtivo.tipo.vantagens[i])
				}
				for (var i = 0; i<pokemonAtivo.tipo.desvantagens.length; i++){
					var van = $('<p> </p')
					var id = 'desOutro'+i
					van.attr('id', id)
					id='#'+id
					$('.desvOutroPoke').append(van)
					$(id).text(pokemonAtivo.tipo.desvantagens[i])
				}
			}

			$('.vants').show()
		}	
	}

	$(document).on('click', '.selecionar', function(){
		trocarPokemon($(this).val());
	});

	function trocarPokemon(numero){
		seuPokemon=pokemons[numero];
		geral();
	}

	$('#capturar').click(function(){
		var randomize = random();
		var porcentagemVida = (pokemonAtivo.vidaAtual/pokemonAtivo.vida)*100
		var qtdPokebolas = getItem('Pokebola').quantidade;
		if(qtdPokebolas<=0){
			$('#value').text('Você não possui pokebolas')
		}else{
			adcionarItem('Pokebola', -1)
			if(randomize>=porcentagemVida && randomize>= pokemonAtivo.raridade){
				pokemonAtivo.vidaAtual=pokemonAtivo.vida;
				adicionarPokemon(pokemonAtivo)
				var acrescimoXp = pokemonAtivo.nivel/2;
				xpPlayer+= acrescimoXp;
				$('#value2').text('Livre');
				$('#bonusPlayer').text('Você ganhou '+acrescimoXp+' XP').fadeIn(1000)
				$('#bonusPlayer').fadeOut(1500)
				uparPlayer();
				$('#value').text('Você capturou o Pokemon ' + pokemonAtivo.nome)
				pokemonAtivo=null
				geral();
			}else {
				$('#value').text('Você falhou ao tentar capturar o Pokemon ' + pokemonAtivo.nome)
				geral();
			}
		}
	});

	$('#andar').click(function(){
		var randomize = random();
		if(randomize <=20){
			$('#value').text('Você encontrou um Pokemon');
			$('#value2').text('Luta');
			pokemonAtivo=null;
			pokemonAtivo = gerarPokemon(nivelPlayer);
			$('#nome').text(pokemonAtivo.nome);
			$('#nivel').text('Nivel '+ pokemonAtivo.nivel);
			$('#vida').text('Vida '+(pokemonAtivo.vidaAtual).toFixed(1) + '/' + (pokemonAtivo.vida).toFixed(1))
		} else if(randomize>=65){
			rollItem(53, 32, 15, 0, 0);
		}else{
			var randomize = random();
			if(randomize<33){
				$('#value').text('Você anda mas não encontra nada');
			}else if(randomize<66){
				$('#value').text('Nada encontrado');
			}else {
				$('#value').text('Você não encontrou nada');
			}
			$('#value2').text('Livre');
		}
		geral();
	});

	$('#fugir').click(function(){
		$('#value2').text('Livre');
		$('#value').text('Você fugiu');
		pokemonAtivo=null
		geral();
	});

	$('#atacar').click(function(){
		atacar(seuPokemon.ataque, pokemonAtivo);
		geral();
		if(pokemonAtivo!=null){
			$('#vida').text('Vida: ' + pokemonAtivo.vidaAtual.toFixed(1) + '/' + pokemonAtivo.vida.toFixed(1));
		}
		$('#vidaSeuPokemon').show().text('Vida '+seuPokemon.vidaAtual.toFixed(1) +'/'+seuPokemon.vida.toFixed(1));
	});

	function ataqueInimigo(ataque, pokemon){
		dano = random();
		var critico = false
				$('logInimigo').delay(1500);
				if(pokemon.nivel==seuPokemon.nivel-3){
					dano-=30
				}else if(pokemon.nivel==seuPokemon.nivel-2){
					dano-=20;
				}else if(pokemon.nivel==seuPokemon.nivel-1){
					dano-=10;
				}else if(pokemon.nivel==seuPokemon.nivel+1){
					dano+=10;
				}else if(pokemon.nivel==seuPokemon.nivel+2){
					dano+=20;
				}else if(pokemon.nivel==seuPokemon.nivel+3){
					dano+=30;
				}
				if(dano>40 || pokemon.habilidades.nome=='Foco'){
					dano=random();

					if(dano<95){
						dano=pokemon.ataque*1.5;
					} else {
						dano=pokemon.ataque*2
					}

					var vantagem = 0
					for(var i = 0; i < pokemonAtivo.tipo.vantagens.length; i++){
							if(pokemonAtivo.tipo.vantagens[i]==seuPokemon.tipo.nome){
								vantagem = 1
							}
					}

					for(var i = 0; i < pokemonAtivo.tipo.desvantagens.length; i++){
							if(pokemonAtivo.tipo.desvantagens[i]==seuPokemon.tipo.nome && pokemonAtivo.tipo.desvantagens[i]!=pokemonAtivo.tipo.nome){
								vantagem = 2
							}
						
					}

					if(pokemon.habilidades.nome=='Espirito Vital' && (pokemon.vidaAtual>pokemon.vida*0.7)){
						console.log(dano)
						dano*=1.5
						console.log(dano)
					}

					if(vantagem==1){
						dano*=2
					}else if(vantagem==2){
						dano*=0.5
					}

					dano=parseFloat((dano).toFixed(1));
					
					if(critico){
						$('#logInimigo').show().text(pokemon.nome+' CRITOU ' + dano.toFixed(1) + ' de dano');
						$('#danoNoPoke').text('-'+dano.toFixed(1)+' CRIT').fadeIn(500).delay(250).fadeOut(500)
					}else{
						$('#logInimigo').show().text(pokemon.nome+' deu ' + dano.toFixed(1) + ' de dano');
						$('#danoNoPoke').text('-'+dano.toFixed(1)).fadeIn(500).delay(250).fadeOut(500)
					}
					seuPokemon.vidaAtual=seuPokemon.vidaAtual-dano;
					if(seuPokemon.vidaAtual<=0){
						seuPokemon.vidaAtual=0
						$('#value').text('OH NÃO SEU POKEMON FOI DERROTADO D:');
						geral();
						pokemons.splice(pokemons.indexOf(seuPokemon), 1);
						atualizarListaPoke();
					}
				}else{
					$('#logInimigo').show().text(pokemon.nome+' falhou, 0 de dano');
					$('#danoNoPoke').text('-'+0).fadeIn(500).delay(250).fadeOut(500)
				}
	}

	function atacarInimigo(ataque, pokemonInimigo){
		var dano = random();
		var critico = false
		if(seuPokemon.vidaAtual>0){
			if(dano<=95){
				dano=ataque*1.5
			}else {
				dano=ataque*2
				critico=true;
			}
			dano=parseFloat((dano).toFixed(1));

			var vantagem = 0
			for(var i = 0; i < seuPokemon.tipo.vantagens.length; i++){
					if(seuPokemon.tipo.vantagens[i]==pokemonAtivo.tipo.nome){
						vantagem = 1	
					}
			}

			for(var i = 0; i < seuPokemon.tipo.desvantagens.length; i++){
					if(seuPokemon.tipo.desvantagens[i]==pokemonAtivo.tipo.nome && seuPokemon.tipo.desvantagens[i]!=seuPokemon.tipo.nome){
						vantagem = 2
					}				
			}

			if(seuPokemon.habilidades.nome=='Espirito Vital' && (seuPokemon.vidaAtual>seuPokemon.vida*0.7)){
				dano*=1.5
			}

			if(vantagem==1){
				dano*=2
			}else if(vantagem==2){
				dano*=0.5
			}
			

			pokemonInimigo.vidaAtual=pokemonInimigo.vidaAtual-dano;
			if(critico){
				$('#value').text(seuPokemon.nome + ' CRITOU ' + dano.toFixed(1) + ' de dano' )
				$('#danoNoOutroPoke').text( 'CRIT '+'-'+dano.toFixed(1)).fadeIn(500).delay(250).fadeOut(500)
			}else{
				$('#value').text(seuPokemon.nome + ' deu ' + dano.toFixed(1) + ' de dano')
				$('#danoNoOutroPoke').text('-'+dano.toFixed(1)).fadeIn(500).delay(250).fadeOut(500)
			}
		} 
	}
	
	function atacar(ataque, pokemon){
		if(seuPokemon.vidaAtual>0){
			atacarInimigo(ataque, pokemon);
			if(pokemon.vidaAtual<=0){
				var randomize = random();
				if(randomize>=50){
					
					if(seuPokemon.habilidades.quantidade<seuPokemon.habilidades.maxQtd){
						seuPokemon.habilidades.quantidade+=1
					}
				}
				pokemon.vidaAtual=0;
				seuPokemon.experiencia+=pokemon.nivel;
				pokemon.img=pokemon.imgDr
				xpPlayer+=pokemon.nivel;
				var acrescimoXp = pokemonAtivo.nivel;
				$('#bonusPlayer').text('Você ganhou '+acrescimoXp+' XP').fadeIn(1500)
				$('#bonusPlayer').fadeOut(2500)
				$('#bonusPoke').text(seuPokemon.nome +' ganhou '+acrescimoXp+' XP').fadeIn(1500)
				$('#bonusPoke').fadeOut(2500)
				rollItem(40, 32, 13, 10, 5)
				$('#value').text('Seu pokemon ' + seuPokemon.nome + ' derrotou o Pokemon '+pokemon.nome)
				$('logInimigo').text(pokemon.nome + ' foi derrotado')
				upar(seuPokemon);
				uparPlayer();
				$('#value2').text('Livre');
				pokemonAtivo=null
			}else if(!confusaoInimiga){
				ataqueInimigo(pokemonAtivo.ataque, pokemonAtivo);
			}
			confusaoInimiga=false
		}else{
			$('#value').text('Seu pokemon foi derrotado, você não pode atacar com ele')
		}
		geral();
	}
	
	$('#ok').click(function(){
		$('#value2').text('Livre');
		geral();
	});
	
	$(document).on('click', '#mostrarItens', function(){
		menu='itens';
		geral();
	});

	$(document).on('click', '#mostrarPokes', function(){
		menu='pokemon';
		geral();
	});

	$(document).on('click', '#mostrarInfo', function(){
		menu='info';
		geral();
	});

});
/* Cadastro - Contato */
function validar () {
	var nome = contato.nome.value;
	var tel = contato.tel.value;
	var email = contato.email.value;
	var avaliar = contato.avaliar.value;
	
	if (nome == "") {
		alert('Por favor, preencha o campo com seu nome!');
		contato.nome.focus();
		return false;
		}
		if (nome.length < 10) {
			alert('Digite seu nome completo!');
			contato.nome.focus();
			return false;
			}
			
	if (email == "") {
		alert('Por favor, preencha o campo com seu email!');
		contato.email.focus();
		return false;
		}
		if (email.length < 15) {
			alert('Digite o email, completo!');
			contato.email.focus();
			return false;
			}
			
	if (tel == "") {
		alert('Por favor, preencha o campo com seu telefone!');
		contato.tel.focus();
		return false;
		}
		if (tel.length < 10) {
			alert('Digite seu telefone completo!');
			contato.tel.focus();
			return false;
			}

	if (avaliar === "") {
		alert('Por favor, avalie nosso site!');
		contato.avaliar.focus();
		return false;
		}
	
	return true;
				}
				function processarform() {
				if (validar()) {
					alert("Dados enviados com sucesso!");
					contato.reset();
					}
					return false;
				}

/* Fim do Cadastro */

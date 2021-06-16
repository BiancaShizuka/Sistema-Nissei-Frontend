<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cadastroDespesas.css">
    <title>Cadastro de Despesas</title>
</head>
<body class="background">
    <div class="div-cadDespesas">
        <form class='form-despesas' onSubmit={adicionarFunc}>
            <label>Tipo de despesas:</label>
            <input type="text" id="tpDespesa" name="tpDespesas"><br><br>
            <label>Data de Lançamento:</label>
            <input type="date" id="dtLancamento" name="dtLancamento">
            <label>Data de Vencimento:</label>
            <input type="date" id="dtVencimento" name="dtVencimento"><br><br>
            <label>Modo de Pagamento:</label>
            <input type="radio" id="avista" name="avista" value="A" checked={nivel==='A'}>
            <label for="avista">À vista</label>
            <input type="radio" id="parcelado" name="parcelado" value="P" >
            <label for="parcelado">Parcelado</label>
            <label>Número de Parcelas:</label>
            <input type="number" id="NParcelas" name="NParcelas">
            <button type="button" onClick={salvarDespesas} class="buttonSave">Salvar</button>
            <button type="button" onClick={voltarHome} class="buttonBack">Voltar</button>
        </form>
    </div> 
    <div>
        
    </div>   
</body>
</html>
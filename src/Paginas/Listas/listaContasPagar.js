<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="teste.css">    
    <title>Lista de Despesas</title>
</head>
<body class="background">
    <div class="div-despesas">
        <form class="formularioDespesas">
            <div class="filtro">
                    <label >Tipo de Despesas:</label>
                    <input type="text">
                    <label >Data de Lançamento:</label>
                    <input type="date">
                    <label >Data de Vencimento:</label>
                    <input type="date">
                    <button>Pesquisar</button>    
            </div>    
            <div class="">
                <table class='tabelaDes'>
                    <thead>
                        <tr>
                            <td>Tipo</td>
                            <td>Valor</td>
                            <td>Data Lançamento</td>
                            <td>Data vencimento</td>
                            <td>Número de Parcelas</td>
                            <td>Tipo de Pagamento</td>
                            <td>Data de Pagamento</td>
                        </tr>
                    </thead>
                </table>
                <button type="button" onClick={voltarHome} class="buttonBack">Voltar</button>
            </div> 
        </form> 
</body>
</html>
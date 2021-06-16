import React, { useState,useEffect } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import Header from '../../Components/Header'
import './listaContasPagar.css'
import ReactLoading from 'react-loading';
function ListarContasPagar()
{
    return (
        <div></div>
       /*
        <div id="tela" className="background">
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
            </div>
        </div>*/
    );
}

export default ListarContasPagar;